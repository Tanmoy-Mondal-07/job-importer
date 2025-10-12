const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  guid: { type: String, index: true, unique: true, sparse: true },
  link: { type: String, index: true, sparse: true },
  title: String,
  company: String,
  location: String,
  description: String,
  pubDate: Date,
  raw: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);