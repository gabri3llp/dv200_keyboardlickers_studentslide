const express = require('express');
const router = express.Router();
const Student = require('../Model/students');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// GET all students
router.get('/', async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// REGISTER a new student
router.post('/register', async (req, res) => {
  try {
    const { name, surname, email, password, studentNum } = req.body;

    const existing = await Student.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const student = await Student.create({
      name,
      surname,
      email,
      password: hashedPassword,
      studentNum,
    });

    res.status(201).json({ message: 'Student registered successfully', student });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign(
      { id: student._id, role: student.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    res.json({ message: 'Login successful', token, role: student.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CHANGE role (admin only)
router.patch('/:id/role', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    );
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;