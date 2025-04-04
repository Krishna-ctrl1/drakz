// models/Client.js
const mongoose = require('mongoose');

const clientAdvisorsSchema = new mongoose.Schema({
  advisor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Advisor',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assigned_at: {
    type: Date,
    default: Date.now
  }
});

// Use the same collection name as in your migration script
module.exports = mongoose.model('ClientAdvisors', clientAdvisorsSchema, 'client_advisors');