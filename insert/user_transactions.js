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

// User Transactions Schema
const userTransactionsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  transaction_datetime: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Create User Transactions Model - specify the collection name explicitly
const UserTransactions = mongoose.model('UserTransactions', userTransactionsSchema, 'user_transactions');

// Insertion Function
const insertUserTransactions = async () => {
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
    const userTransactionsData = [
      { user_id: 1, description: 'Utility Bill Payment', type: 'Expense', transaction_datetime: '2025-03-22 09:10:00', amount: -3200.00 },
      { user_id: 1, description: 'Mutual Fund Redemption', type: 'Income', transaction_datetime: '2025-03-25 14:00:00', amount: 50000.00 },
      { user_id: 1, description: 'Electronics Purchase', type: 'Expense', transaction_datetime: '2025-03-27 17:30:00', amount: -12000.00 },
      { user_id: 2, description: 'Mobile Recharge', type: 'Expense', transaction_datetime: '2025-03-22 11:20:00', amount: -500.00 },
      { user_id: 2, description: 'Fixed Deposit Maturity', type: 'Income', transaction_datetime: '2025-03-26 14:30:00', amount: 100000.00 },
      { user_id: 2, description: 'Online Course Payment', type: 'Expense', transaction_datetime: '2025-03-27 16:00:00', amount: -5500.00 },
      { user_id: 3, description: 'Insurance Premium', type: 'Expense', transaction_datetime: '2025-03-23 09:20:00', amount: -25000.00 },
      { user_id: 3, description: 'Property Rental Income', type: 'Income', transaction_datetime: '2025-03-27 14:45:00', amount: 45000.00 },
      { user_id: 3, description: 'Business Equipment Purchase', type: 'Expense', transaction_datetime: '2025-03-26 17:10:00', amount: -75000.00 },
      { user_id: 4, description: 'Electricity Bill', type: 'Expense', transaction_datetime: '2025-03-22 11:00:00', amount: -4500.00 },
      { user_id: 4, description: 'Dividend Receipt', type: 'Income', transaction_datetime: '2025-03-26 15:30:00', amount: 8000.00 },
      { user_id: 4, description: 'Home Decor Shopping', type: 'Expense', transaction_datetime: '2025-03-27 16:45:00', amount: -9000.00 },
      { user_id: 5, description: 'Health Insurance', type: 'Expense', transaction_datetime: '2025-03-22 10:15:00', amount: -12000.00 },
      { user_id: 5, description: 'Real Estate Dividend', type: 'Income', transaction_datetime: '2025-03-27 14:00:00', amount: 55000.00 },
      { user_id: 5, description: 'Travel Booking', type: 'Expense', transaction_datetime: '2025-03-25 17:45:00', amount: -25000.00 },
      { user_id: 6, description: 'Internet Bill', type: 'Expense', transaction_datetime: '2025-03-22 11:15:00', amount: -2000.00 },
      { user_id: 6, description: 'Mutual Fund Redemption', type: 'Income', transaction_datetime: '2025-03-26 15:45:00', amount: 40000.00 },
      { user_id: 6, description: 'Electronics Upgrade', type: 'Expense', transaction_datetime: '2025-03-27 16:30:00', amount: -18000.00 },
      { user_id: 7, description: 'Car Maintenance', type: 'Expense', transaction_datetime: '2025-03-22 10:45:00', amount: -7000.00 },
      { user_id: 7, description: 'Bond Maturity', type: 'Income', transaction_datetime: '2025-03-27 14:15:00', amount: 60000.00 },
      { user_id: 7, description: 'Online Subscription', type: 'Expense', transaction_datetime: '2025-03-25 17:20:00', amount: -1500.00 },
      { user_id: 8, description: 'Water Bill', type: 'Expense', transaction_datetime: '2025-03-22 11:30:00', amount: -1800.00 },
      { user_id: 8, description: 'Investment Dividend', type: 'Income', transaction_datetime: '2025-03-26 14:45:00', amount: 35000.00 },
      { user_id: 8, description: 'Clothing Shopping', type: 'Expense', transaction_datetime: '2025-03-27 16:15:00', amount: -12000.00 },
      { user_id: 9, description: 'Phone Bill', type: 'Expense', transaction_datetime: '2025-03-22 10:30:00', amount: -1500.00 },
      { user_id: 9, description: 'Investment Return', type: 'Income', transaction_datetime: '2025-03-27 14:30:00', amount: 45000.00 },
      { user_id: 9, description: 'Book Purchase', type: 'Expense', transaction_datetime: '2025-03-25 17:00:00', amount: -3000.00 },
      { user_id: 10, description: 'Home Maintenance', type: 'Expense', transaction_datetime: '2025-03-23 09:45:00', amount: -15000.00 },
      { user_id: 10, description: 'Dividend Payout', type: 'Income', transaction_datetime: '2025-03-26 14:15:00', amount: 65000.00 },
      { user_id: 10, description: 'Software Subscription', type: 'Expense', transaction_datetime: '2025-03-27 17:45:00', amount: -2500.00 }
    ];

    // Convert SQL IDs to MongoDB ObjectIds and date strings to Date objects
    const mongoUserTransactions = userTransactionsData.map(transaction => ({
      user_id: userMap[transaction.user_id],
      description: transaction.description,
      type: transaction.type,
      transaction_datetime: new Date(transaction.transaction_datetime),
      amount: transaction.amount,
      created_at: new Date()
    }));

    // Filter out any entries with undefined user_id
    const validUserTransactions = mongoUserTransactions.filter(transaction => transaction.user_id);
    
    if (validUserTransactions.length !== mongoUserTransactions.length) {
      console.warn(`Warning: ${mongoUserTransactions.length - validUserTransactions.length} transaction(s) have users not found in the database`);
      const missingUserIds = userTransactionsData
        .filter(transaction => !userMap[transaction.user_id])
        .map(transaction => transaction.user_id);
      console.log('Missing user IDs:', missingUserIds);
    }

    // Insert user transactions
    const result = await UserTransactions.insertMany(validUserTransactions);
    console.log('User transactions inserted successfully:', result.length);
    
  } catch (error) {
    console.error('Error inserting user transactions:', error);
  } finally {
    // Close the connection after operation completes
    mongoose.connection.close()
      .then(() => console.log('MongoDB connection closed'))
      .catch(err => console.error('Error closing MongoDB connection:', err));
  }
};

// Run the insertion
insertUserTransactions();