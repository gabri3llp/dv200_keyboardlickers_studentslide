const express = require('express');
const router = express.Router();
const Listing = require('../Model/listings');
const jwt = require('jsonwebtoken');

const editableListingFields = ['title', 'category', 'price', 'description', 'image'];
const JWT_SECRET = process.env.JWT_SECRET || 'studentslide-dev-secret';

const requireAdmin = (req, res, next) => {
  const roleHeader = req.header('x-user-role');
  const token = (req.header('authorization') || '').replace('Bearer ', '');
  let tokenRole = '';

  try {
    tokenRole = token ? jwt.verify(token, JWT_SECRET).role : '';
  } catch {
    // Invalid tokens simply fall back to the role header for the class demo.
  }

  if (!['admin', 'moderator'].includes(roleHeader) && !['admin', 'moderator'].includes(tokenRole)) {
    return res.status(403).json({ error: 'Admin or moderator access required' });
  }

  next();
};

const pickEditableFields = (body) =>
  editableListingFields.reduce((fields, field) => {
    if (body[field] !== undefined) {
      fields[field] = body[field];
    }

    return fields;
  }, {});

// GET all of our listings
router.get('/', async (req, res) => {
  try {
    const filter = req.query.state ? { listingState: req.query.state } : {};
    const listings = await Listing.find(filter).sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a single listing
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a listing
router.post('/', async (req, res) => {
  try {
    const listing = await Listing.create(pickEditableFields(req.body));
    res.status(201).json(listing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH edit listing details
router.patch('/:id', async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      pickEditableFields(req.body),
      { new: true, runValidators: true }
    );

    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH update listing state (admin only) which will be done on MongoDB
router.patch('/:id/state', requireAdmin, async (req, res) => {
  try {
    if (!['pending', 'live'].includes(req.body.listingState)) {
      return res.status(400).json({ error: 'listingState must be pending or live' });
    }

    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { listingState: req.body.listingState },
      { new: true, runValidators: true }
    );
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a listing
router.delete('/:id', async (req, res) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

// make sure you understand everything in this code, and how it connects to the rest of the backend. This is where you will be doing most of your work for the marketplace, so you need to understand how it works.
