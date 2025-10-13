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

// User Loans Schema
const userLoansSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  loan_type: {
    type: String,
    required: true
  },
  principal_amount: {
    type: Number,
    required: true
  },
  remaining_balance: {
    type: Number,
    required: true
  },
  interest_rate: {
    type: Number,
    required: true
  },
  loan_term: {
    type: Number,
    required: true
  },
  emi_amount: {
    type: Number,
    required: true
  },
  loan_taken_on: {
    type: Date,
    required: true
  },
  next_payment_due: {
    type: Date,
    required: true
  },
  total_paid: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Paid', 'Overdue'],
    default: 'Active'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Create User Loans Model - specify the collection name explicitly
const UserLoan = mongoose.model('UserLoan', userLoansSchema, 'user_loans');

// Insertion Function
const insertUserLoans = async () => {
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
    const startDate = new Date('2025-10-07');
    const endDate = new Date('2025-10-13');
    const getRandomDate = (start, end) => {
      const timestamp = start.getTime() + Math.random() * (end.getTime() - start.getTime());
      return new Date(timestamp);
    };

    // Loan types and parameters for variety
    const loanTypes = ['Personal Loan', 'Home Loan', 'Car Loan', 'Education Loan', 'Business Loan', 'Home Improvement Loan', 'Vehicle Loan', 'Business Expansion Loan', 'Equipment Financing', 'Working Capital Loan'];
    const statuses = ['Active', 'Paid', 'Overdue'];

    // Generate user loans data
    const userLoansData = [];
    userEmails.forEach((email, index) => {
      const numLoans = email === 'xdphantom1202@gmail.com' || email === 'ragamaie.n23@iiits.in' ? 10 : 3;
      for (let i = 0; i < numLoans; i++) {
        const principal_amount = Math.floor(Math.random() * 950000) + 50000; // 50,000 to 1,000,000
        const loan_term = Math.floor(Math.random() * 10) + 1; // 1 to 10 years
        const interest_rate = (Math.random() * 5) + 5; // 5% to 10%
        const emi_amount = Math.floor(principal_amount * (interest_rate / 1200) / (1 - Math.pow(1 + interest_rate / 1200, -loan_term * 12))) * 100; // Approximate EMI
        const total_paid = Math.floor(Math.random() * principal_amount * 0.5); // Up to 50% paid
        const remaining_balance = principal_amount - total_paid;
        const loan_taken_on = getRandomDate(startDate, endDate);
        const next_payment_due = new Date(loan_taken_on);
        next_payment_due.setDate(loan_taken_on.getDate() + 30); // Next payment 30 days later

        userLoansData.push({
          user_id: index + 1, // Temporary ID for mapping
          loan_type: loanTypes[Math.floor(Math.random() * loanTypes.length)],
          principal_amount,
          remaining_balance,
          interest_rate: parseFloat(interest_rate.toFixed(2)),
          loan_term,
          emi_amount,
          loan_taken_on,
          next_payment_due,
          total_paid,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          created_at: new Date()
        });
      }
    });

    // Convert temporary user_id to MongoDB ObjectIds
    const mongoUserLoans = userLoansData.map(loan => ({
      user_id: userMap[userEmails[loan.user_id - 1]],
      loan_type: loan.loan_type,
      principal_amount: loan.principal_amount,
      remaining_balance: loan.remaining_balance,
      interest_rate: loan.interest_rate,
      loan_term: loan.loan_term,
      emi_amount: loan.emi_amount,
      loan_taken_on: loan.loan_taken_on,
      next_payment_due: loan.next_payment_due,
      total_paid: loan.total_paid,
      status: loan.status,
      created_at: loan.created_at
    }));

    // Filter out any entries with undefined user_id
    const validUserLoans = mongoUserLoans.filter(loan => loan.user_id);
    
    if (validUserLoans.length !== mongoUserLoans.length) {
      console.warn(`Warning: ${mongoUserLoans.length - validUserLoans.length} loan(s) have users not found in the database`);
      const missingEmails = userEmails.filter(email => !userMap[email]);
      console.log('Missing user emails:', missingEmails);
    }

    // Clear existing loans to avoid duplicates (optional, comment out if you want to append)
    await UserLoan.deleteMany({ loan_taken_on: { $gte: startDate, $lte: endDate } });
    console.log('Cleared existing loans from October 7, 2025, to October 13, 2025');

    // Insert user loans
    const result = await UserLoan.insertMany(validUserLoans);
    console.log('User loans inserted successfully:', result.length);
    
  } catch (error) {
    console.error('Error inserting user loans:', error);
  } finally {
    // Close the connection after operation completes
    mongoose.connection.close()
      .then(() => console.log('MongoDB connection closed'))
      .catch(err => console.error('Error closing MongoDB connection:', err));
  }
};

// Run the insertion
insertUserLoans();