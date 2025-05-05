// Define the schemas for your MongoDB models
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for credit card bills
const creditCardBillSchema = new Schema({
  user_id: { 
    type: String, 
    required: true,
    index: true  // Add index for faster queries
  },
  card_number: { 
    type: String, 
    required: true 
  },
  current_bill: { 
    type: Number, 
    required: true,
    default: 0 
  },
  minimum_amount_due: { 
    type: Number, 
    required: true,
    default: 0 
  },
  due_date: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String,
    enum: ['paid', 'pending', 'overdue'],
    default: 'pending'
  }
}, { 
  timestamps: true,  
  collection: 'credit_card_bills' 
});

// Create compound index for faster lookup on user_id + card_number combinations
creditCardBillSchema.index({ user_id: 1, card_number: 1, due_date: -1 });

// Register models
const CreditCardBill = mongoose.model('CreditCardBill', creditCardBillSchema);

module.exports = CreditCardBill;