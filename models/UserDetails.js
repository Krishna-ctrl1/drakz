// models/UserDetails.js
const mongoose = require('mongoose');

const userDetailsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  phone: String,
  country: String,
  postal_code: String,
  // Other details fields
}, { timestamps: true });

module.exports = mongoose.model('UserDetails', userDetailsSchema, 'user_details');