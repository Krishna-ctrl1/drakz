// models/UserInvestments.js
const mongoose = require('mongoose');

const userInvestmentsSchema = new mongoose.Schema({
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
  // Other investment fields...
}, { timestamps: true }, {
  collection: 'user_investments'
});

module.exports = mongoose.model('UserInvestments', userInvestmentsSchema, 'user_investments');