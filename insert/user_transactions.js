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

    // Create an array of user emails to map with the data
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

    // Create mapping of email to user _id
    const userMap = {};
    userEmails.forEach(email => {
      const user = users.find(u => u.email === email);
      if (user) {
        userMap[email] = user._id;
      }
    });

    // Generate dates within the last 7 days (October 7, 2025, to October 13, 2025)
    const startDate = new Date('2025-10-07T00:00:00+05:30'); // IST
    const endDate = new Date('2025-10-13T23:59:59+05:30');   // IST
    const getRandomDate = (start, end) => {
      const timestamp = start.getTime() + Math.random() * (end.getTime() - start.getTime());
      return new Date(timestamp);
    };

    // Transaction descriptions and types for variety
    const transactionDescriptions = {
      Expense: [
        'Utility Bill Payment', 'Mobile Recharge', 'Electricity Bill', 'Internet Bill', 'Water Bill', 'Phone Bill',
        'Home Maintenance', 'Car Maintenance', 'Online Subscription', 'Software Subscription', 'Electronics Purchase',
        'Home Decor Shopping', 'Clothing Shopping', 'Book Purchase', 'Travel Booking', 'Online Course Payment',
        'Health Insurance', 'Insurance Premium', 'Business Equipment Purchase'
      ],
      Income: [
        'Mutual Fund Redemption', 'Fixed Deposit Maturity', 'Property Rental Income', 'Dividend Receipt',
        'Real Estate Dividend', 'Bond Maturity', 'Investment Dividend', 'Investment Return'
      ]
    };

    // Generate user transactions data
    const userTransactionsData = [];
    userEmails.forEach((email, index) => {
      const numTransactions = email === 'xdphantom1202@gmail.com' || email === 'ragamaie.n23@iiits.in' ? 10 : 3;
      for (let i = 0; i < numTransactions; i++) {
        const type = Math.random() > 0.5 ? 'Income' : 'Expense';
        const description = transactionDescriptions[type][Math.floor(Math.random() * transactionDescriptions[type].length)];
        const amount = type === 'Income'
          ? Math.floor(Math.random() * 95000) + 5000  // ₹5,000 to ₹100,000
          : -Math.floor(Math.random() * 24500) - 500; // -₹500 to -₹25,000
        const transaction_datetime = getRandomDate(startDate, endDate);

        userTransactionsData.push({
          user_id: index + 1, // Temporary ID for mapping
          description,
          type,
          transaction_datetime,
          amount,
          created_at: new Date()
        });
      }
    });

    // Convert temporary user_id to MongoDB ObjectIds
    const mongoUserTransactions = userTransactionsData.map(transaction => ({
      user_id: userMap[userEmails[transaction.user_id - 1]],
      description: transaction.description,
      type: transaction.type,
      transaction_datetime: transaction.transaction_datetime,
      amount: transaction.amount,
      created_at: transaction.created_at
    }));

    // Filter out any entries with undefined user_id
    const validUserTransactions = mongoUserTransactions.filter(transaction => transaction.user_id);
    
    if (validUserTransactions.length !== mongoUserTransactions.length) {
      console.warn(`Warning: ${mongoUserTransactions.length - validUserTransactions.length} transaction(s) have users not found in the database`);
      const missingEmails = userEmails.filter(email => !userMap[email]);
      console.log('Missing user emails:', missingEmails);
    }

    // Clear existing transactions to avoid duplicates (optional, comment out if you want to append)
    await UserTransactions.deleteMany({ transaction_datetime: { $gte: startDate, $lte: endDate } });
    console.log('Cleared existing transactions from October 7, 2025, to October 13, 2025');

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