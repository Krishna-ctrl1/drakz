// First, define MongoDB schemas needed for these endpoints
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Expense schema
const ExpenseSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  amount: Number,
  category: String,
  date: { type: Date, default: Date.now }
  // Add other expense fields
}, {
  collection: 'user_expenses'
});

const Expense = mongoose.model('Expense', ExpenseSchema);

module.exports = Expense;