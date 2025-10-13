const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userBankAccountSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  bank_name: {
    type: String,
    required: true,
    trim: true
  },
  account_number: {
    type: String,
    required: true,
    trim: true
  },
  account_type: {
    type: String,
    enum: ['Savings', 'Checking', 'Credit Card'],
    required: true
  },
  last_four_digits: {
    type: String,
    required: true,
    match: /^\d{4}$/
  }
}, {
  timestamps: true,
  collection: 'user_bank_accounts'
});

userBankAccountSchema.index({ user_id: 1, bank_name: 1 }, { unique: true });

const UserBankAccount = mongoose.model('UserBankAccount', userBankAccountSchema);

module.exports = UserBankAccount;