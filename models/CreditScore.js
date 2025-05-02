const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Credit Score schema
const CreditScoreSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  score: Number,
  provider: String,
  date: { type: Date, default: Date.now }
  // Add other credit score fields
}, {
  collection: 'user_credit_scores'
});

const CreditScore = mongoose.model('CreditScore', CreditScoreSchema);

module.exports = CreditScore;