const mongoose = require('mongoose');

const ChildSchema = new mongoose.Schema({
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  parent_email: {
    type: String,
    required: true
  },
  Date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Child = mongoose.model('child', ChildSchema);
