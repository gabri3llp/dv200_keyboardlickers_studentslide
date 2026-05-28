const express = require('express');
const router = express.Router();
const Student = require('../Model/students');

// GET all students
router.get('/', async (req, res) => {
  const students = await Student.find();
  res.json(students);
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

