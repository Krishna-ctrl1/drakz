const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0 
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'expenses' 
});

expenseSchema.index({ user_id: 1, date: -1 });

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;