const mongoose = require('mongoose');
const mongodbURI = require('config').get('mongoDB');

const connectDB = async () => {
  try {
    await mongoose.connect(mongodbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });

    console.log('Database connected..');
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;
