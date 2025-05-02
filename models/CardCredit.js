// models/CardCredit.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CreditCardSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  card_number: { type: String, required: true },
  cardholder_name: { type: String, required: true },
  valid_from: { type: String, required: true },
  valid_thru: { type: String, required: true },
  bank_name: { type: String, default: 'Unknown Bank' },
  card_type: { type: String, default: 'credit' },
  card_network: { type: String, default: 'Unknown' }
}, {
  collection: 'user_credit_cards'
});

module.exports = mongoose.model('CreditCard', CreditCardSchema);
