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

// User Bank Accounts Schema (matching the UserBankAccount.js model)
const userBankAccountSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bank_name: {
    type: String,
    required: true
  },
  account_number: {
    type: String,
    required: true
  },
  account_type: {
    type: String,
    required: true
  },
  last_four_digits: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Create User Bank Accounts Model - specify the collection name explicitly
const UserBankAccount = mongoose.model('UserBankAccount', userBankAccountSchema, 'user_bank_accounts');

// Insertion Function with sample data
const insertUserBankAccounts = async () => {
  try {
    // First, get all users to reference their ObjectIds
    const users = await User.find().select('_id email');
    
    if (users.length === 0) {
      console.error('No users found in the DRAKZ database');
      return;
    }

    console.log(`Found ${users.length} users in the database`);

    // Create mapping of email to user _id
    const userMap = {};
    users.forEach(user => {
      userMap[user.email] = user._id;
    });

    // Sample bank accounts data mapped by user email
    const bankAccountsData = [
      // User 1 - XD Phantom
      { email: 'xdphantom1202@gmail.com', bank_name: 'State Bank of India', account_number: '123456789012', account_type: 'Savings', last_four_digits: '9012' },
      { email: 'xdphantom1202@gmail.com', bank_name: 'HDFC Bank', account_number: '987654321098', account_type: 'Checking', last_four_digits: '1098' },
      
      // User 2 - Ragamaie Nagineni
      { email: 'ragamaie.n23@iiits.in', bank_name: 'ICICI Bank', account_number: '112233445566', account_type: 'Savings', last_four_digits: '5566' },
      { email: 'ragamaie.n23@iiits.in', bank_name: 'Axis Bank', account_number: '667788990011', account_type: 'Credit Card', last_four_digits: '0011' },
      
      // User 3 - Abhinay Malle
      { email: 'abhinay.m23@iiits.in', bank_name: 'Punjab National Bank', account_number: '223344556677', account_type: 'Savings', last_four_digits: '6677' },
      
      // User 4 - Arjun Patel
      { email: 'arjun.patel@gmail.com', bank_name: 'Bank of Baroda', account_number: '334455667788', account_type: 'Checking', last_four_digits: '7788' },
      
      // User 5 - Priya Sharma
      { email: 'priya.sharma@yahoo.com', bank_name: 'Kotak Mahindra Bank', account_number: '445566778899', account_type: 'Savings', last_four_digits: '8899' },
      
      // User 6 - Rohan Khanna
      { email: 'rohan.khanna@outlook.com', bank_name: 'IndusInd Bank', account_number: '556677889900', account_type: 'Credit Card', last_four_digits: '9900' },
      
      // User 7 - Sneha Reddy
      { email: 'sneha.reddy@hotmail.com', bank_name: 'Yes Bank', account_number: '667788990011', account_type: 'Savings', last_four_digits: '0011' },
      
      // User 8 - Vikram Singh
      { email: 'vikram.singh@gmail.com', bank_name: 'IDFC First Bank', account_number: '778899001122', account_type: 'Checking', last_four_digits: '1122' },
      
      // User 9 - Neha Gupta
      { email: 'neha.gupta@yahoo.com', bank_name: 'Paytm Payments Bank', account_number: '889900112233', account_type: 'Savings', last_four_digits: '2233' },
      
      // User 10 - Arun Kumar
      { email: 'arun.kumar@outlook.com', bank_name: 'Airtel Payments Bank', account_number: '990011223344', account_type: 'Savings', last_four_digits: '3344' }
    ];

    // Prepare user bank accounts data with ObjectIds
    const userBankAccountsData = bankAccountsData.map(account => ({
      user_id: userMap[account.email],
      bank_name: account.bank_name,
      account_number: account.account_number,
      account_type: account.account_type,
      last_four_digits: account.last_four_digits
    }));

    // Filter out any entries with undefined user_id
    const validUserBankAccounts = userBankAccountsData.filter(account => account.user_id);
    
    if (validUserBankAccounts.length !== userBankAccountsData.length) {
      console.warn(`Warning: ${userBankAccountsData.length - validUserBankAccounts.length} bank account entries couldn't be matched to users`);
      const missingEmails = [...new Set(
        bankAccountsData
          .filter(account => !userMap[account.email])
          .map(account => account.email)
      )];
      console.log('Missing user emails:', missingEmails);
    }

    // Insert user bank accounts
    const result = await UserBankAccount.insertMany(validUserBankAccounts);
    console.log('User bank accounts inserted successfully:', result.length);
  } catch (error) {
    console.error('Error inserting user bank accounts:', error);
  } finally {
    // Close the connection after operation completes
    mongoose.connection.close()
      .then(() => console.log('MongoDB connection closed'))
      .catch(err => console.error('Error closing MongoDB connection:', err));
  }
};

// Run the insertion
insertUserBankAccounts();