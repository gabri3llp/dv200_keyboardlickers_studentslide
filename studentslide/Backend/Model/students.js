const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  surname:    { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  studentNum: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);

// Backup main