const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title:        { type: String, required: true },
  category:     { type: String, required: true },
  price:        { type: Number, required: true },
  description:  { type: String, required: true },
  image:        { type: String, required: true },
  listingState: { type: String, enum: ['pending', 'live'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);