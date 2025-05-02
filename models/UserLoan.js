
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserLoanSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    loan_type: String,
    principal_amount: Number,
    remaining_balance: Number,
    interest_rate: Number,
    loan_term: Number,
    emi_amount: Number,
    loan_taken_on: Date,
    next_payment_due: Date,
    total_paid: Number,
    status: String
  }, {
    collection: 'user_loans'
  });

  const UserLoan = mongoose.model('UserLoan', UserLoanSchema);

  module.exports = UserLoan;