const express = require('express');
const router = express.Router();
const Student = require('../Model/students');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const validRoles = ['normal', 'moderator', 'admin'];
const JWT_SECRET = process.env.JWT_SECRET || 'studentslide-dev-secret';

const safeStudent = (student) => ({
  _id: student._id,
  name: student.name,
  surname: student.surname,
  email: student.email,
  studentNum: student.studentNum,
  role: student.role,
  color: student.color,
  createdAt: student.createdAt,
  updatedAt: student.updatedAt,
});

const getBearerToken = (req) => {
  const header = req.header('authorization') || '';
  return header.startsWith('Bearer ') ? header.slice(7) : '';
};

const authenticate = async (req, res, next) => {
  try {
    const token = getBearerToken(req);
    if (!token) return res.status(401).json({ error: 'Authentication required' });

    const payload = jwt.verify(token, JWT_SECRET);
    const student = await Student.findById(payload.id);
    if (!student) return res.status(401).json({ error: 'User not found' });

    req.user = student;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin' && req.header('x-user-role') !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// GET all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students.map(safeStudent));
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
    const { username, color, sequence, name, surname } = req.body;

    const existing = await Student.findOne({ email: username });
    if (existing) return res.status(400).json({ ok: false, message: 'User already exists' });

    const hashed = await bcrypt.hash(sequence.join('-'), 10);

    const student = await Student.create({
      name: name || username,
      surname: surname || 'Student',
      email: username,
      password: hashed,
      studentNum: Date.now().toString(),
      role: 'normal',
      color,
      sequence,
    });

    const token = jwt.sign(
      { id: student._id, role: student.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ ok: true, token, user: safeStudent(student) });
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
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ ok: true, token, user: safeStudent(student) });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// PATCH change student role (admin only)
router.get('/me', authenticate, async (req, res) => {
  res.json({ user: safeStudent(req.user) });
});

router.patch('/:id/role', authenticate, requireAdmin, async (req, res) => {
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
    res.json(safeStudent(student));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
