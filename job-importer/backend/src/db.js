const mongoose = require('mongoose');

async function connectMongo(uri) {
  mongoose.set('strictQuery', false);
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log('mongodb connected');
}

module.exports = { connectMongo };