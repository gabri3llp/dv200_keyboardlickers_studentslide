const express = require('express');
const router = express.Router();
const Student = require('../Model/students');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const validRoles = ['normal', 'moderator', 'admin'];

const requireAdmin = (req, res, next) => {
  if (req.header('x-user-role') !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// GET all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a student (basic)
router.post('/', async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST register with creative auth
router.post('/register', async (req, res) => {
  try {
    const { username, color, sequence } = req.body;

    const existing = await Student.findOne({ email: username });
    if (existing) return res.status(400).json({ ok: false, message: 'User already exists' });

    const hashed = await bcrypt.hash(sequence.join('-'), 10);

    const student = await Student.create({
      name: username,
      surname: 'Student',
      email: username,
      password: hashed,
      studentNum: Date.now().toString(),
      role: 'normal',
      color,
      sequence,
    });

    const token = jwt.sign(
      { id: student._id, role: student.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ ok: true, token, user: student });
  } catch (err) {
    res.status(400).json({ ok: false, message: err.message });
  }
});

// POST login with creative auth
router.post('/login', async (req, res) => {
  try {
    const { username, color, sequence } = req.body;

    const student = await Student.findOne({ email: username });
    if (!student) return res.status(404).json({ ok: false, message: 'User not found' });

    if (student.color !== color) {
      return res.status(401).json({ ok: false, message: 'Wrong color or sequence' });
    }

    const sequenceMatch = JSON.stringify(student.sequence) === JSON.stringify(sequence);
    if (!sequenceMatch) {
      return res.status(401).json({ ok: false, message: 'Wrong sequence' });
    }

    const token = jwt.sign(
      { id: student._id, role: student.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ ok: true, token, user: student });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// PATCH change student role (admin only)
router.patch('/:id/role', requireAdmin, async (req, res) => {
  try {
    if (!validRoles.includes(req.body.role)) {
      return res.status(400).json({ error: 'Role must be normal, moderator, or admin' });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true, runValidators: true }
    );
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;