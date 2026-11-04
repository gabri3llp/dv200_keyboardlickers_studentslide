const jwt = require('jsonwebtoken');
const { randomBytes } = require('node:crypto');
const mongoose = require('mongoose');
const Student = require('../Model/students');

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET must be configured in production');
}

// A missing local secret must never enable a publicly known signing key.
const JWT_SECRET = process.env.JWT_SECRET || randomBytes(32).toString('hex');
if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET is unset: local sessions expire when the backend restarts.');
}

const authenticate = async (req, res, next) => {
  const match = /^Bearer ([^\s]+)$/i.exec(req.header('authorization') || '');
  if (!match) return res.status(401).json({ error: 'Sign in to continue' });

  let payload;
  try {
    payload = jwt.verify(match[1], JWT_SECRET, { algorithms: ['HS256'] });
    if (typeof payload.id !== 'string' || !mongoose.isObjectIdOrHexString(payload.id)) {
      throw new Error('Invalid account identity');
    }
  } catch {
    return res.status(401).json({ error: 'Session expired. Please sign in again.' });
  }

  try {
    const student = await Student.findById(payload.id);
    if (!student) return res.status(401).json({ error: 'Account no longer exists' });
    req.user = student;
    return next();
  } catch {
    return res.status(503).json({ error: 'Could not verify your account. Please try again.' });
  }
};

const requireRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ error: 'You do not have permission for this action' });
  }
  return next();
};

const canModerate = (user) => ['admin', 'moderator'].includes(user?.role);

module.exports = { authenticate, requireRoles, canModerate, JWT_SECRET };
