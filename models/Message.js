
// First, define the Message schema and model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  // Assuming these fields from your MySQL table
  name: String,
  email: String,
  subject: String,
  message: String,
  submission_date: { type: Date, default: Date.now },
  is_read: { type: Boolean, default: false },
  is_replied: { type: Boolean, default: false }
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;