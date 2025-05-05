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

// User Investments Schema
const userInvestmentsSchema = new mongoose.Schema({
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

// Create User Investments Model - specify the collection name explicitly
const UserInvestments = mongoose.model('UserInvestments', userInvestmentsSchema, 'user_investments');

// Insertion Function
const insertUserInvestments = async () => {
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
    const userInvestmentsData = [
      { user_id: 1, symbol: 'ICICI', price: 100.00 },
      { user_id: 1, symbol: 'HDFC', price: 150.25 },
      { user_id: 1, symbol: 'SBI', price: 40.50 },
      { user_id: 1, symbol: 'Reliance Industries', price: 2500.75 },
      { user_id: 1, symbol: 'Axis Bank', price: 60.25 },
      { user_id: 2, symbol: 'HDFC', price: 150.25 },
      { user_id: 2, symbol: 'Infosys', price: 1500.50 },
      { user_id: 2, symbol: 'State Bank of India', price: 55.75 },
      { user_id: 2, symbol: 'Tata Consultancy Services', price: 3600.00 },
      { user_id: 2, symbol: 'Kotak Mahindra Bank', price: 200.40 },
      { user_id: 3, symbol: 'Tata Motors', price: 320.50 },
      { user_id: 3, symbol: 'Larsen & Toubro', price: 1450.75 },
      { user_id: 3, symbol: 'Maruti Suzuki', price: 8000.25 },
      { user_id: 3, symbol: 'Bajaj Finance', price: 7500.60 },
      { user_id: 3, symbol: 'HDFC Bank', price: 1600.40 },
      { user_id: 4, symbol: 'SBI', price: 40.50 },
      { user_id: 4, symbol: 'ICICI Bank', price: 90.25 },
      { user_id: 4, symbol: 'Maruti Suzuki', price: 8000.50 },
      { user_id: 4, symbol: 'Infosys', price: 1500.75 },
      { user_id: 4, symbol: 'Bajaj Holdings', price: 4500.25 },
      { user_id: 5, symbol: 'Axis Bank', price: 60.25 },
      { user_id: 5, symbol: 'Godrej Consumer', price: 450.50 },
      { user_id: 5, symbol: 'ITC', price: 250.75 },
      { user_id: 5, symbol: 'HDFC Life Insurance', price: 750.25 },
      { user_id: 5, symbol: 'Reliance Industries', price: 2500.60 },
      { user_id: 6, symbol: 'ICICI Prudential', price: 500.25 },
      { user_id: 6, symbol: 'Kotak Mahindra Bank', price: 200.50 },
      { user_id: 6, symbol: 'Tata Steel', price: 120.75 },
      { user_id: 6, symbol: 'Sun Pharmaceutical', price: 600.40 },
      { user_id: 6, symbol: 'Hero MotoCorp', price: 2800.25 },
      { user_id: 7, symbol: 'Tech Mahindra', price: 1200.50 },
      { user_id: 7, symbol: 'Wipro', price: 400.25 },
      { user_id: 7, symbol: 'HDFC Bank', price: 1600.75 },
      { user_id: 7, symbol: 'Britannia Industries', price: 3800.50 },
      { user_id: 7, symbol: 'Ashok Leyland', price: 150.25 },
      { user_id: 8, symbol: 'Infosys', price: 1500.50 },
      { user_id: 8, symbol: 'HDFC Life Insurance', price: 750.25 },
      { user_id: 8, symbol: 'Nestle India', price: 19000.75 },
      { user_id: 8, symbol: 'Bajaj Finance', price: 7500.40 },
      { user_id: 8, symbol: 'Adani Ports', price: 850.25 },
      { user_id: 9, symbol: 'State Bank of India', price: 55.75 },
      { user_id: 9, symbol: 'ITC', price: 250.50 },
      { user_id: 9, symbol: 'Asian Paints', price: 3200.25 },
      { user_id: 9, symbol: 'Max Healthcare', price: 600.75 },
      { user_id: 9, symbol: 'Tata Power', price: 220.40 },
      { user_id: 10, symbol: 'HDFC Bank', price: 1600.40 },
      { user_id: 10, symbol: 'Reliance Industries', price: 2500.75 },
      { user_id: 10, symbol: 'Tata Consultancy Services', price: 3600.00 },
      { user_id: 10, symbol: 'Bajaj Holdings', price: 4500.25 },
      { user_id: 10, symbol: 'Mahindra & Mahindra', price: 1500.60 }
    ];

    // Convert SQL IDs to MongoDB ObjectIds
    const mongoUserInvestments = userInvestmentsData.map(investment => ({
      user_id: userMap[investment.user_id],
      symbol: investment.symbol,
      price: investment.price,
      last_updated: new Date()
    }));

    // Filter out any entries with undefined user_id
    const validUserInvestments = mongoUserInvestments.filter(investment => investment.user_id);
    
    if (validUserInvestments.length !== mongoUserInvestments.length) {
      console.warn(`Warning: ${mongoUserInvestments.length - validUserInvestments.length} investment entries have users not found in the database`);
      const missingUserIds = userInvestmentsData
        .filter(investment => !userMap[investment.user_id])
        .map(investment => investment.user_id);
      console.log('Missing user IDs:', [...new Set(missingUserIds)]);
    }

    // Insert user investments
    const result = await UserInvestments.insertMany(validUserInvestments);
    console.log('User investments inserted successfully:', result.length);
    
  } catch (error) {
    console.error('Error inserting user investments:', error);
  } finally {
    // Close the connection after operation completes
    mongoose.connection.close()
      .then(() => console.log('MongoDB connection closed'))
      .catch(err => console.error('Error closing MongoDB connection:', err));
  }
};

// Run the insertion
insertUserInvestments();