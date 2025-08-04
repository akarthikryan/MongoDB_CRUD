// db.js
const mongoose = require('mongoose');

async function getDatabase() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/library');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

module.exports = {
  getDatabase
};
