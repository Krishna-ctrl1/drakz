const mongoose = require('mongoose');

// User Insurance Policy Schema
const userInsurancePolicySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  policy_name: {
    type: String,
    required: true
  },
  policy_number: {
    type: String,
    required: true,
    unique: true
  },
  property_description: {
    type: String
  },
  coverage_amount: {
    type: Number,
    required: true
  },
  renewal_date: {
    type: Date
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
    collection: 'user_insurance_policies'
  });

// Create User Insurance Policy Model - specify the collection name explicitly
const UserInsurancePolicy = mongoose.model('UserInsurancePolicy', userInsurancePolicySchema, 'user_insurance_policies');

module.exports = UserInsurancePolicy;