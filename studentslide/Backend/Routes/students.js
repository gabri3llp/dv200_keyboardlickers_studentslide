const express = require('express');
const router = express.Router();
const Student = require('../Model/students');

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

// POST create a student
router.post('/', async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// change a student's role (admin only)
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

