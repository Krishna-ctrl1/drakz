const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB Connection with explicit database name
const dbURI = process.env.MONGODB_ATLAS_URI || 'mongodb://localhost:27017/DRAKZ';

mongoose.connect(dbURI, {})
  .then(() => console.log('Connected to DRAKZ database'))
  .catch(err => console.error('MongoDB connection error:', err));

// Reference existing User model structure
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

// User Holdings Schema
const userHoldingsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  total_balance: {
    type: Number,
    required: true
  },
  savings_account_balance: {
    type: Number,
    required: true
  },
  income: {
    type: Number,
    required: true
  },
  expense: {
    type: Number,
    required: true
  },
  last_updated: {
    type: Date,
    default: Date.now
  }
});

// Create User Holdings Model - specify the collection name explicitly
const UserHoldings = mongoose.model('UserHoldings', userHoldingsSchema, 'user_holdings');

// Insertion Function
const insertUserHoldings = async () => {
  try {
    // First, get all users to reference their ObjectIds
    const users = await User.find().select('_id email');
    
    if (users.length === 0) {
      console.error('No users found in the DRAKZ database');
      return;
    }
    
    console.log(`Found ${users.length} users in the database`);

    // Create an array of user emails to map with the SQL data
    const userEmails = [
      'xdphantom1202@gmail.com',
      'ragamaie.n23@iiits.in',
      'abhinay.m23@iiits.in',
      'arjun.patel@gmail.com',
      'priya.sharma@yahoo.com',
      'rohan.khanna@outlook.com',
      'sneha.reddy@hotmail.com',
      'vikram.singh@gmail.com',
      'neha.gupta@yahoo.com',
      'arun.kumar@outlook.com'
    ];

    // Create mapping of index to user _id
    const userMap = {};
    userEmails.forEach((email, index) => {
      const user = users.find(u => u.email === email);
      if (user) {
        userMap[index + 1] = user._id;
      }
    });

    // SQL data converted to MongoDB format
    const userHoldingsData = [
      { user_id: 1, total_balance: 450000.00, savings_account_balance: 150000.00, income: 82000.00, expense: 45000.00 },
      { user_id: 2, total_balance: 380000.00, savings_account_balance: 120000.00, income: 75000.00, expense: 42000.00 },
      { user_id: 3, total_balance: 280000.00, savings_account_balance: 90000.00, income: 91000.00, expense: 55000.00 },
      { user_id: 4, total_balance: 320000.00, savings_account_balance: 100000.00, income: 85000.00, expense: 48000.00 },
      { user_id: 5, total_balance: 520000.00, savings_account_balance: 180000.00, income: 105000.00, expense: 62000.00 },
      { user_id: 6, total_balance: 250000.00, savings_account_balance: 80000.00, income: 70000.00, expense: 40000.00 },
      { user_id: 7, total_balance: 420000.00, savings_account_balance: 140000.00, income: 95000.00, expense: 55000.00 },
      { user_id: 8, total_balance: 380000.00, savings_account_balance: 120000.00, income: 88000.00, expense: 50000.00 },
      { user_id: 9, total_balance: 290000.00, savings_account_balance: 95000.00, income: 78000.00, expense: 45000.00 },
      { user_id: 10, total_balance: 460000.00, savings_account_balance: 160000.00, income: 98000.00, expense: 58000.00 }
    ];

    // Convert SQL IDs to MongoDB ObjectIds
    const mongoUserHoldings = userHoldingsData.map(holding => ({
      user_id: userMap[holding.user_id],
      total_balance: holding.total_balance,
      savings_account_balance: holding.savings_account_balance,
      income: holding.income,
      expense: holding.expense,
      last_updated: new Date()
    }));

    // Filter out any entries with undefined user_id
    const validUserHoldings = mongoUserHoldings.filter(holding => holding.user_id);
    
    if (validUserHoldings.length !== mongoUserHoldings.length) {
      console.warn(`Warning: ${mongoUserHoldings.length - validUserHoldings.length} user(s) not found in the database`);
      const missingUserIds = userHoldingsData
        .filter(holding => !userMap[holding.user_id])
        .map(holding => holding.user_id);
      console.log('Missing user IDs:', missingUserIds);
    }

    // Insert user holdings
    const result = await UserHoldings.insertMany(validUserHoldings);
    console.log('User holdings inserted successfully:', result.length);
    
  } catch (error) {
    console.error('Error inserting user holdings:', error);
  } finally {
    // Close the connection after operation completes
    mongoose.connection.close()
      .then(() => console.log('MongoDB connection closed'))
      .catch(err => console.error('Error closing MongoDB connection:', err));
  }
};

// Run the insertion
insertUserHoldings();