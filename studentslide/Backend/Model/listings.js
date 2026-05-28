const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title:        { type: String, required: true, trim: true },
  category:     { type: String, required: true, trim: true },
  price:        { type: Number, required: true, min: 0 },
  description:  { type: String, required: true, trim: true },
  image:        { type: String, required: true, trim: true },
  listingState: { type: String, enum: ['pending', 'live'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);
