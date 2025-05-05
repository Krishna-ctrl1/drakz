const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB Connection with explicit database name
const dbURI = process.env.MONGODB_ATLAS_URI || 'mongodb://localhost:27017/DRAKZ';
mongoose.connect(dbURI, {})
  .then(() => console.log('Connected to DRAKZ database'))
  .catch(err => console.error('MongoDB connection error:', err));

// Reference existing User model structure to match your database
const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  password: String,
  monthly_income: Number,
  employment_status: String,
  financial_goals: String,
  risk_tolerance: String,
  aadhaar_number: String,
  pan_number: String,
  email_verified: Boolean,
  is_premium: Boolean,
  created_at: Date
});

// Create User model with existing collection name
const User = mongoose.model('User', userSchema, 'users');

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
});

// Create User Insurance Policy Model - specify the collection name explicitly
const UserInsurancePolicy = mongoose.model('UserInsurancePolicy', userInsurancePolicySchema, 'user_insurance_policies');

// Insertion Function
const insertUserInsurancePolicies = async () => {
  try {
    // First, get all users to reference their ObjectIds
    const users = await User.find().select('_id email');
    
    if (users.length === 0) {
      console.error('No users found in the DRAKZ database');
      return;
    }

    console.log(`Found ${users.length} users in the database`);

    // Map emails to user IDs - using the same mapping as in the previous scripts
    const userEmailToIndexMap = {
      'xdphantom1202@gmail.com': 1,
      'ragamaie.n23@iiits.in': 2,
      'abhinay.m23@iiits.in': 3,
      'arjun.patel@gmail.com': 4,
      'priya.sharma@yahoo.com': 5,
      'rohan.khanna@outlook.com': 6,
      'sneha.reddy@hotmail.com': 7,
      'vikram.singh@gmail.com': 8,
      'neha.gupta@yahoo.com': 9,
      'arun.kumar@outlook.com': 10
    };

    // Create a map of numeric IDs to actual MongoDB ObjectIds
    const userIdMap = {};
    users.forEach(user => {
      const numericId = userEmailToIndexMap[user.email];
      if (numericId) {
        userIdMap[numericId] = user._id;
      }
    });

    // Insurance Policy data from SQL converted to MongoDB format
    const insurancePolicyData = [
      { user_id: 1, policy_name: 'Home Shield Pro', policy_number: 'POL-HOME-2024-001', property_description: 'Mumbai City Apartment', coverage_amount: 1000000.00, renewal_date: new Date('2025-06-15') },
      { user_id: 1, policy_name: 'Personal Accident Cover', policy_number: 'POL-ACC-2024-101', property_description: 'Individual Comprehensive Protection', coverage_amount: 2500000.00, renewal_date: new Date('2025-03-20') },
      { user_id: 1, policy_name: 'Critical Illness Guard', policy_number: 'POL-MED-2024-201', property_description: 'Comprehensive Health Coverage', coverage_amount: 5000000.00, renewal_date: new Date('2025-09-10') },
      { user_id: 2, policy_name: 'Property Guardian', policy_number: 'POL-HOME-2024-002', property_description: 'Bangalore Suburban Residence', coverage_amount: 1500000.00, renewal_date: new Date('2025-01-15') },
      { user_id: 2, policy_name: 'Tech Professional Shield', policy_number: 'POL-PRO-2024-102', property_description: 'Professional Liability Insurance', coverage_amount: 3000000.00, renewal_date: new Date('2025-07-22') },
      { user_id: 2, policy_name: 'Family Health Protector', policy_number: 'POL-MED-2024-202', property_description: 'Family Comprehensive Medical', coverage_amount: 4500000.00, renewal_date: new Date('2025-04-30') },
      { user_id: 3, policy_name: 'Business Ventures Secure', policy_number: 'POL-BIZ-2024-003', property_description: 'Business Assets Protection', coverage_amount: 7500000.00, renewal_date: new Date('2025-08-05') },
      { user_id: 3, policy_name: 'Commercial Property Shield', policy_number: 'POL-PROP-2024-103', property_description: 'Business Property Coverage', coverage_amount: 5000000.00, renewal_date: new Date('2025-02-28') },
      { user_id: 3, policy_name: 'Entrepreneur Health Guard', policy_number: 'POL-MED-2024-203', property_description: 'Comprehensive Health for Business Owner', coverage_amount: 6000000.00, renewal_date: new Date('2025-05-15') },
      { user_id: 4, policy_name: 'Education Fund Protector', policy_number: 'POL-EDU-2024-004', property_description: 'Future Education Savings', coverage_amount: 2000000.00, renewal_date: new Date('2025-10-20') },
      { user_id: 4, policy_name: 'Personal Asset Guard', policy_number: 'POL-HOME-2024-104', property_description: 'Suburban Home Protection', coverage_amount: 1200000.00, renewal_date: new Date('2025-03-10') },
      { user_id: 4, policy_name: 'Accident and Disability Cover', policy_number: 'POL-ACC-2024-204', property_description: 'Comprehensive Personal Protection', coverage_amount: 3000000.00, renewal_date: new Date('2025-07-05') },
      { user_id: 5, policy_name: 'Urban Lifestyle Protector', policy_number: 'POL-HOME-2024-005', property_description: 'Delhi Metropolitan Loft', coverage_amount: 2000000.00, renewal_date: new Date('2025-06-30') },
      { user_id: 5, policy_name: 'Marketing Professional Shield', policy_number: 'POL-PRO-2024-105', property_description: 'Professional Liability Insurance', coverage_amount: 4000000.00, renewal_date: new Date('2025-02-15') },
      { user_id: 5, policy_name: 'Comprehensive Health Plus', policy_number: 'POL-MED-2024-205', property_description: 'Premium Health Coverage', coverage_amount: 5500000.00, renewal_date: new Date('2025-09-25') },
      { user_id: 6, policy_name: 'Luxury Asset Guardian', policy_number: 'POL-HOME-2024-006', property_description: 'Mumbai Luxury Penthouse', coverage_amount: 4000000.00, renewal_date: new Date('2025-05-18') },
      { user_id: 6, policy_name: 'Consultant Professional Cover', policy_number: 'POL-PRO-2024-106', property_description: 'Professional Indemnity Insurance', coverage_amount: 6000000.00, renewal_date: new Date('2025-01-10') },
      { user_id: 6, policy_name: 'Global Health Protector', policy_number: 'POL-MED-2024-206', property_description: 'International Medical Coverage', coverage_amount: 7500000.00, renewal_date: new Date('2025-08-15') },
      { user_id: 7, policy_name: 'Tech Professional Security', policy_number: 'POL-PRO-2024-007', property_description: 'Data Scientist Professional Cover', coverage_amount: 3500000.00, renewal_date: new Date('2025-04-05') },
      { user_id: 7, policy_name: 'Home and Contents Shield', policy_number: 'POL-HOME-2024-107', property_description: 'Hyderabad Studio Apartment', coverage_amount: 1000000.00, renewal_date: new Date('2025-07-20') },
      { user_id: 7, policy_name: 'Critical Care Companion', policy_number: 'POL-MED-2024-207', property_description: 'Comprehensive Medical Protection', coverage_amount: 4000000.00, renewal_date: new Date('2025-02-28') },
      { user_id: 8, policy_name: 'Tech Leadership Guardian', policy_number: 'POL-PRO-2024-008', property_description: 'Professional Liability for Tech Lead', coverage_amount: 5000000.00, renewal_date: new Date('2025-06-10') },
      { user_id: 8, policy_name: 'Investment Property Shield', policy_number: 'POL-PROP-2024-108', property_description: 'Multiple Property Protection', coverage_amount: 6000000.00, renewal_date: new Date('2025-03-15') },
      { user_id: 8, policy_name: 'Family Health Premium', policy_number: 'POL-MED-2024-208', property_description: 'Comprehensive Family Health', coverage_amount: 8000000.00, renewal_date: new Date('2025-10-05') },
      { user_id: 9, policy_name: 'Educator Asset Protector', policy_number: 'POL-HOME-2024-009', property_description: 'Teachers Residential Property', coverage_amount: 1200000.00, renewal_date: new Date('2025-05-25') },
      { user_id: 9, policy_name: 'Professional Liability Cover', policy_number: 'POL-PRO-2024-109', property_description: 'Educational Professional Insurance', coverage_amount: 2500000.00, renewal_date: new Date('2025-08-10') },
      { user_id: 9, policy_name: 'Wellness and Health Shield', policy_number: 'POL-MED-2024-209', property_description: 'Comprehensive Medical Coverage', coverage_amount: 3500000.00, renewal_date: new Date('2025-01-20') },
      { user_id: 10, policy_name: 'Sales Professional Guardian', policy_number: 'POL-PRO-2024-010', property_description: 'Professional Liability for Sales', coverage_amount: 3000000.00, renewal_date: new Date('2025-07-15') },
      { user_id: 10, policy_name: 'Property Investment Shield', policy_number: 'POL-PROP-2024-110', property_description: 'Multiple Property Protection', coverage_amount: 4500000.00, renewal_date: new Date('2025-04-20') },
      { user_id: 10, policy_name: 'Retirement Health Secure', policy_number: 'POL-MED-2024-210', property_description: 'Comprehensive Health Coverage', coverage_amount: 5000000.00, renewal_date: new Date('2025-09-30') }
    ];

    // Map the SQL numeric user_ids to MongoDB ObjectIds
    const insurancePoliciesWithObjectIds = insurancePolicyData.map(policy => ({
      user_id: userIdMap[policy.user_id],
      policy_name: policy.policy_name,
      policy_number: policy.policy_number,
      property_description: policy.property_description,
      coverage_amount: policy.coverage_amount,
      renewal_date: policy.renewal_date
    }));

    // Filter out any entries with undefined user_id
    const validInsurancePolicies = insurancePoliciesWithObjectIds.filter(policy => policy.user_id);
    
    if (validInsurancePolicies.length !== insurancePoliciesWithObjectIds.length) {
      console.warn(`Warning: ${insurancePoliciesWithObjectIds.length - validInsurancePolicies.length} insurance policy(ies) have users not found in the database`);
      
      // Log the missing user IDs
      const missingUserIds = insurancePolicyData
        .filter(policy => !userIdMap[policy.user_id])
        .map(policy => policy.user_id);
      console.log('Missing user IDs:', [...new Set(missingUserIds)]);
    }

    // Insert insurance policies
    const result = await UserInsurancePolicy.insertMany(validInsurancePolicies);
    console.log('Insurance policies inserted successfully:', result.length);
  } catch (error) {
    console.error('Error inserting insurance policies:', error);
  } finally {
    // Close the connection after operation completes
    mongoose.connection.close()
      .then(() => console.log('MongoDB connection closed'))
      .catch(err => console.error('Error closing MongoDB connection:', err));
  }
};

// Run the insertion
insertUserInsurancePolicies();