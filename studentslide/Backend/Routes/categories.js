const express = require('express');
const router = express.Router();
const Category = require('../Model/categories');

const requireAdmin = (req, res, next) => {
  if (req.header('x-user-role') !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  next();
};

const makeSlug = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

// GET all categories for dropdown menus
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a category
router.post('/', requireAdmin, async (req, res) => {
  try {
    const name = req.body.name?.trim();

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const category = await Category.create({
      name,
      slug: req.body.slug?.trim() || makeSlug(name),
    });

    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
