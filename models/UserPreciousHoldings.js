const mongoose = require('mongoose');

// User Precious Holdings Schema
const userPreciousHoldingsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  metal_type: {
    type: String,
    required: true,
    lowercase: true
  },
  amount: {
    type: Number,
    required: true
  },
  amount_unit: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  date_of_purchase: {
    type: Date,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
    collection: 'user_precious_holdings'
  });

// Create User Precious Holdings Model - specify the collection name explicitly
const UserPreciousHoldings = mongoose.model('UserPreciousHoldings', userPreciousHoldingsSchema, 'user_precious_holdings');

module.exports = UserPreciousHoldings;