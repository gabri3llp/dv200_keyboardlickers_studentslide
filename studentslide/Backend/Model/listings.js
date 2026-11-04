const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title:        { type: String, required: true, trim: true },
  category:     { type: String, required: true, trim: true },
  price:        { type: Number, required: true, min: 0 },
  description:  { type: String, required: true, trim: true },
  image:        { type: String, required: true, trim: true },
  // Optional for legacy documents; every new listing is assigned by the server.
  seller:       { type: mongoose.Schema.Types.ObjectId, ref: 'Student', immutable: true, index: true },
  sellerName:   { type: String, trim: true },
  listingState: { type: String, enum: ['pending', 'live'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);
