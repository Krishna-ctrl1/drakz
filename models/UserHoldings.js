const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserHoldingsSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    total_balance: { type: Number, default: 0 },
    savings_account_balance: { type: Number, default: 0 },
    income: { type: Number, default: 0 },
    expense: { type: Number, default: 0 },
    last_updated: { type: Date, default: Date.now }
  }, {
    collection: 'user_holdings'
  });

  const UserHoldings = mongoose.model('UserHoldings', UserHoldingsSchema);

  module.exports = UserHoldings;