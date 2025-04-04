// models/UserStocks.js
const mongoose = require('mongoose');

const userStocksSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  // Other stock fields...
}, { timestamps: true });

module.exports = mongoose.model('UserStocks', userStocksSchema, 'user_stocks');