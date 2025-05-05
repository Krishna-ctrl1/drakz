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

// User Stocks Schema
const userStocksSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  last_updated: {
    type: Date,
    default: Date.now
  }
});

// Create User Stocks Model - specify the collection name explicitly
const UserStocks = mongoose.model('UserStocks', userStocksSchema, 'user_stocks');

// Insertion Function
const insertUserStocks = async () => {
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
    const userStocksData = [
      { user_id: 1, symbol: 'AAPL', price: 185.50 },
      { user_id: 1, symbol: 'GOOGL', price: 125.75 },
      { user_id: 1, symbol: 'MSFT', price: 340.25 },
      { user_id: 1, symbol: 'AMZN', price: 140.60 },
      { user_id: 1, symbol: 'NVDA', price: 450.30 },
      { user_id: 2, symbol: 'TCS', price: 3500.00 },
      { user_id: 2, symbol: 'INFY', price: 1450.25 },
      { user_id: 2, symbol: 'HDFC', price: 1600.75 },
      { user_id: 2, symbol: 'RELIANCE', price: 2350.50 },
      { user_id: 2, symbol: 'WIPRO', price: 400.10 },
      { user_id: 3, symbol: 'BAJAJ', price: 6500.00 },
      { user_id: 3, symbol: 'ICICI', price: 950.25 },
      { user_id: 3, symbol: 'MARUTI', price: 9000.50 },
      { user_id: 3, symbol: 'SBI', price: 550.75 },
      { user_id: 3, symbol: 'INDIGO', price: 2100.30 },
      { user_id: 4, symbol: 'TSLA', price: 250.60 },
      { user_id: 4, symbol: 'META', price: 300.25 },
      { user_id: 4, symbol: 'NFLX', price: 500.40 },
      { user_id: 4, symbol: 'PYPL', price: 75.50 },
      { user_id: 4, symbol: 'INTC', price: 45.75 },
      { user_id: 5, symbol: 'UBER', price: 50.25 },
      { user_id: 5, symbol: 'SNOW', price: 250.60 },
      { user_id: 5, symbol: 'CRM', price: 220.30 },
      { user_id: 5, symbol: 'ADBE', price: 550.75 },
      { user_id: 5, symbol: 'DELL', price: 75.40 },
      { user_id: 6, symbol: 'AMD', price: 120.50 },
      { user_id: 6, symbol: 'SBUX', price: 110.25 },
      { user_id: 6, symbol: 'DIS', price: 95.60 },
      { user_id: 6, symbol: 'QCOM', price: 150.40 },
      { user_id: 6, symbol: 'BA', price: 220.75 },
      { user_id: 7, symbol: 'ORCL', price: 90.25 },
      { user_id: 7, symbol: 'CSCO', price: 55.60 },
      { user_id: 7, symbol: 'IBM', price: 140.50 },
      { user_id: 7, symbol: 'HPQ', price: 35.75 },
      { user_id: 7, symbol: 'INTL', price: 65.40 },
      { user_id: 8, symbol: 'BIIB', price: 280.50 },
      { user_id: 8, symbol: 'GILD', price: 80.25 },
      { user_id: 8, symbol: 'MRK', price: 120.60 },
      { user_id: 8, symbol: 'PFE', price: 40.75 },
      { user_id: 8, symbol: 'BMY', price: 75.40 },
      { user_id: 9, symbol: 'AAPL', price: 185.50 },
      { user_id: 9, symbol: 'MSFT', price: 340.25 },
      { user_id: 9, symbol: 'GOOGL', price: 125.75 },
      { user_id: 9, symbol: 'AMZN', price: 140.60 },
      { user_id: 9, symbol: 'INTC', price: 45.75 },
      { user_id: 10, symbol: 'TCS', price: 3500.00 },
      { user_id: 10, symbol: 'INFY', price: 1450.25 },
      { user_id: 10, symbol: 'HDFC', price: 1600.75 },
      { user_id: 10, symbol: 'RELIANCE', price: 2350.50 },
      { user_id: 10, symbol: 'WIPRO', price: 400.10 }
    ];

    // Convert SQL IDs to MongoDB ObjectIds
    const mongoUserStocks = userStocksData.map(stock => ({
      user_id: userMap[stock.user_id],
      symbol: stock.symbol,
      price: stock.price,
      last_updated: new Date()
    }));

    // Filter out any entries with undefined user_id
    const validUserStocks = mongoUserStocks.filter(stock => stock.user_id);
    
    if (validUserStocks.length !== mongoUserStocks.length) {
      console.warn(`Warning: ${mongoUserStocks.length - validUserStocks.length} stock entries have users not found in the database`);
      const missingUserIds = userStocksData
        .filter(stock => !userMap[stock.user_id])
        .map(stock => stock.user_id);
      console.log('Missing user IDs:', [...new Set(missingUserIds)]);
    }

    // Insert user stocks
    const result = await UserStocks.insertMany(validUserStocks);
    console.log('User stocks inserted successfully:', result.length);
    
  } catch (error) {
    console.error('Error inserting user stocks:', error);
  } finally {
    // Close the connection after operation completes
    mongoose.connection.close()
      .then(() => console.log('MongoDB connection closed'))
      .catch(err => console.error('Error closing MongoDB connection:', err));
  }
};

// Run the insertion
insertUserStocks();