const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserTransactionSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    description: String,
    type: String,
    transaction_datetime: Date,
    amount: Number,
    created_at: { type: Date, default: Date.now }
  }, {
    collection: 'user_transactions'
  });

  const UserTransaction = mongoose.model('UserTransaction', UserTransactionSchema);

  module.exports = UserTransaction;