const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const studentRoutes = require('./Routes/students');
app.use('/api/students', studentRoutes);

const listingRoutes = require('./Routes/listings');
app.use('/api/listings', listingRoutes);

const categoryRoutes = require('./Routes/categories');
app.use('/api/categories', categoryRoutes);

// Error handler
app.use((err, req, res, next) => {
  void next;
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => console.error('❌ DB connection failed:', err));