const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Listing = require('../Model/listings');
const { authenticate, requireRoles, canModerate } = require('../Middleware/auth');

const editableListingFields = ['title', 'category', 'price', 'description', 'image'];
const pickEditableFields = (body) =>
  editableListingFields.reduce((fields, field) => {
    if (body[field] !== undefined) fields[field] = body[field];
    return fields;
  }, {});

const ownsListing = (user, listing) =>
  Boolean(listing.seller && String(listing.seller) === String(user?._id));

const versionFilter = (version) => version === 0
  ? { $or: [{ __v: 0 }, { __v: { $exists: false } }] }
  : { __v: version };

router.param('id', (req, res, next, id) => {
  if (!mongoose.isObjectIdOrHexString(id)) {
    return res.status(400).json({ error: 'Invalid listing ID' });
  }
  return next();
});

// Public browsing never exposes pending submissions.
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find({ listingState: 'live' }).sort({ createdAt: -1 });
    res.json(listings);
  } catch {
    res.status(500).json({ error: 'Could not load the marketplace. Please try again.' });
  }
});

router.get('/mine', authenticate, async (req, res) => {
  try {
    const listings = await Listing.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.json(listings);
  } catch {
    res.status(500).json({ error: 'Could not load your listings. Please try again.' });
  }
});

router.get('/review', authenticate, requireRoles('admin', 'moderator'), async (req, res) => {
  try {
    const listings = await Listing.find({}).sort({ createdAt: -1 });
    res.json(listings);
  } catch {
    res.status(500).json({ error: 'Could not load the review queue. Please try again.' });
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    if (listing.listingState === 'live') return res.json(listing);
    return authenticate(req, res, () => {
      if (!ownsListing(req.user, listing) && !canModerate(req.user)) {
        return res.status(403).json({ error: 'This listing is awaiting review' });
      }
      return res.json(listing);
    });
  } catch (err) {
    return next(err);
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const listing = await Listing.create({
      ...pickEditableFields(req.body),
      seller: req.user._id,
      sellerName: [req.user.name, req.user.surname].filter(Boolean).join(' ') || 'Student seller',
      listingState: 'pending',
    });
    res.status(201).json(listing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/:id', authenticate, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    if (!ownsListing(req.user, listing) && !canModerate(req.user)) {
      return res.status(403).json({ error: 'You can only edit your own listings' });
    }
    const fields = pickEditableFields(req.body);
    if (!Object.keys(fields).length) {
      return res.status(400).json({ error: 'No editable listing details supplied' });
    }
    // Set content and pending together: a concurrent approval must never leave
    // newly edited content live because Mongoose considered pending unchanged.
    const updated = await Listing.findOneAndUpdate(
      { _id: listing._id, ...(canModerate(req.user) ? {} : { seller: req.user._id }) },
      { $set: { ...fields, listingState: 'pending' }, $inc: { __v: 1 } },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Listing no longer exists' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/:id/state', authenticate, requireRoles('admin', 'moderator'), async (req, res) => {
  try {
    if (!['pending', 'live'].includes(req.body.listingState)) {
      return res.status(400).json({ error: 'listingState must be pending or live' });
    }
    const { expectedVersion } = req.body;
    if (!Number.isSafeInteger(expectedVersion) || expectedVersion < 0) {
      return res.status(400).json({ error: 'Refresh the review queue before changing this listing' });
    }
    // Existing documents without a version key are their original version (0).
    const listing = await Listing.findOneAndUpdate(
      { _id: req.params.id, ...versionFilter(expectedVersion) },
      { $set: { listingState: req.body.listingState }, $inc: { __v: 1 } },
      { new: true, runValidators: true }
    );
    if (!listing) {
      const exists = await Listing.exists({ _id: req.params.id });
      return res.status(exists ? 409 : 404).json({
        error: exists ? 'This listing changed since you reviewed it. Review the refreshed details before trying again.' : 'Listing not found',
      });
    }
    res.json(listing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    if (!ownsListing(req.user, listing) && !canModerate(req.user)) {
      return res.status(403).json({ error: 'You can only delete your own listings' });
    }
    const suppliedVersion = req.query.expectedVersion;
    const expectedVersion = Number(suppliedVersion);
    if (typeof suppliedVersion !== 'string' || !/^\d+$/.test(suppliedVersion) || !Number.isSafeInteger(expectedVersion)) {
      return res.status(400).json({ error: 'Refresh your listings before deleting this item' });
    }
    const removed = await Listing.findOneAndDelete({
      _id: listing._id,
      ...versionFilter(expectedVersion),
      ...(canModerate(req.user) ? {} : { seller: req.user._id }),
    });
    if (!removed) {
      const exists = await Listing.exists({ _id: req.params.id });
      return res.status(exists ? 409 : 404).json({
        error: exists ? 'This listing changed. Review the refreshed details before deleting it.' : 'Listing not found',
      });
    }
    res.json({ message: 'Listing deleted' });
  } catch {
    res.status(500).json({ error: 'Could not delete the listing. Please try again.' });
  }
});

module.exports = router;
