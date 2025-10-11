const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGODB_URI || '';

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(MONGO_URI);
  console.log('MongoDB connected');
}

module.exports = { dbConnect };