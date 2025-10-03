const mongoose = require('mongoose');
const ContactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  submission_date: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },
  is_read: { type: Boolean, default: false },
  is_replied: { type: Boolean, default: false }
}, { collection: 'contact_messages' });
module.exports = mongoose.model('ContactMessage', ContactMessageSchema);