const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  child: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'children'
  },
  message: {
    type: String,
    required: true
  },
  recipient: {
    type: String,
    required: true
  },
  message_id: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Message = mongoose.model('message', MessageSchema);
