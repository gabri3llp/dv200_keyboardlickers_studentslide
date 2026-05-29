const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  surname:    { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  studentNum: { type: String, required: true, unique: true },
  role:       { type: String, enum: ['normal', 'moderator', 'admin'], default: 'normal' },
  color:      { type: String, default: '' },
  sequence:   { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);