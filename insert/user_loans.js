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
    const userLoansData = [
      { user_id: 1, loan_type: 'Personal Loan', principal_amount: 500000.00, remaining_balance: 350000.00, interest_rate: 9.50, loan_term: 5, emi_amount: 11500.00, loan_taken_on: '2022-03-15', next_payment_due: '2025-03-15', total_paid: 150000.00, status: 'Active' },
      { user_id: 1, loan_type: 'Home Improvement Loan', principal_amount: 250000.00, remaining_balance: 180000.00, interest_rate: 8.75, loan_term: 3, emi_amount: 8500.00, loan_taken_on: '2023-01-10', next_payment_due: '2025-01-10', total_paid: 70000.00, status: 'Paid' },
      { user_id: 1, loan_type: 'Car Loan', principal_amount: 750000.00, remaining_balance: 500000.00, interest_rate: 7.25, loan_term: 7, emi_amount: 13000.00, loan_taken_on: '2021-07-20', next_payment_due: '2026-07-20', total_paid: 250000.00, status: 'Paid' },
      { user_id: 1, loan_type: 'Education Loan', principal_amount: 300000.00, remaining_balance: 100000.00, interest_rate: 6.50, loan_term: 4, emi_amount: 7500.00, loan_taken_on: '2022-11-05', next_payment_due: '2024-11-05', total_paid: 200000.00, status: 'Overdue' },
      
      { user_id: 2, loan_type: 'Personal Loan', principal_amount: 400000.00, remaining_balance: 280000.00, interest_rate: 9.25, loan_term: 5, emi_amount: 9500.00, loan_taken_on: '2022-04-01', next_payment_due: '2025-04-01', total_paid: 120000.00, status: 'Paid' },
      { user_id: 2, loan_type: 'Home Loan', principal_amount: 2000000.00, remaining_balance: 1500000.00, interest_rate: 8.50, loan_term: 20, emi_amount: 18000.00, loan_taken_on: '2020-06-15', next_payment_due: '2040-06-15', total_paid: 500000.00, status: 'Active' },
      { user_id: 2, loan_type: 'Business Loan', principal_amount: 600000.00, remaining_balance: 400000.00, interest_rate: 10.00, loan_term: 6, emi_amount: 12500.00, loan_taken_on: '2023-02-20', next_payment_due: '2026-02-20', total_paid: 200000.00, status: 'Active' },
      { user_id: 2, loan_type: 'Vehicle Loan', principal_amount: 500000.00, remaining_balance: 350000.00, interest_rate: 7.75, loan_term: 5, emi_amount: 11000.00, loan_taken_on: '2021-09-10', next_payment_due: '2026-09-10', total_paid: 150000.00, status: 'Overdue' },
      
      { user_id: 3, loan_type: 'Business Expansion Loan', principal_amount: 1000000.00, remaining_balance: 700000.00, interest_rate: 11.50, loan_term: 7, emi_amount: 18000.00, loan_taken_on: '2021-12-01', next_payment_due: '2028-12-01', total_paid: 300000.00, status: 'Active' },
      { user_id: 3, loan_type: 'Equipment Financing', principal_amount: 500000.00, remaining_balance: 350000.00, interest_rate: 9.00, loan_term: 5, emi_amount: 12000.00, loan_taken_on: '2022-08-15', next_payment_due: '2025-08-15', total_paid: 150000.00, status: 'Overdue' },
      { user_id: 3, loan_type: 'Personal Loan', principal_amount: 300000.00, remaining_balance: 150000.00, interest_rate: 8.75, loan_term: 3, emi_amount: 9500.00, loan_taken_on: '2023-03-10', next_payment_due: '2025-03-10', total_paid: 150000.00, status: 'Paid' },
      { user_id: 3, loan_type: 'Working Capital Loan', principal_amount: 750000.00, remaining_balance: 500000.00, interest_rate: 10.25, loan_term: 6, emi_amount: 15500.00, loan_taken_on: '2022-05-20', next_payment_due: '2026-05-20', total_paid: 250000.00, status: 'Paid' },
      
      { user_id: 4, loan_type: 'Home Loan', principal_amount: 1500000.00, remaining_balance: 1200000.00, interest_rate: 8.25, loan_term: 15, emi_amount: 16000.00, loan_taken_on: '2020-10-01', next_payment_due: '2035-10-01', total_paid: 300000.00, status: 'Paid' },
      { user_id: 4, loan_type: 'Personal Loan', principal_amount: 350000.00, remaining_balance: 200000.00, interest_rate: 9.00, loan_term: 4, emi_amount: 9000.00, loan_taken_on: '2022-11-15', next_payment_due: '2024-11-15', total_paid: 150000.00, status: 'Overdue' },
      { user_id: 4, loan_type: 'Car Loan', principal_amount: 600000.00, remaining_balance: 400000.00, interest_rate: 7.50, loan_term: 5, emi_amount: 13000.00, loan_taken_on: '2021-06-10', next_payment_due: '2026-06-10', total_paid: 200000.00, status: 'Active' },
      { user_id: 4, loan_type: 'Education Loan', principal_amount: 250000.00, remaining_balance: 100000.00, interest_rate: 6.75, loan_term: 3, emi_amount: 7500.00, loan_taken_on: '2023-01-20', next_payment_due: '2025-01-20', total_paid: 150000.00, status: 'Active' },
      
      { user_id: 5, loan_type: 'Business Loan', principal_amount: 800000.00, remaining_balance: 600000.00, interest_rate: 10.50, loan_term: 6, emi_amount: 17000.00, loan_taken_on: '2022-02-15', next_payment_due: '2026-02-15', total_paid: 200000.00, status: 'Active' },
      { user_id: 5, loan_type: 'Home Improvement Loan', principal_amount: 400000.00, remaining_balance: 250000.00, interest_rate: 8.50, loan_term: 4, emi_amount: 11000.00, loan_taken_on: '2023-04-01', next_payment_due: '2025-04-01', total_paid: 150000.00, status: 'Paid' },
      { user_id: 5, loan_type: 'Personal Loan', principal_amount: 300000.00, remaining_balance: 180000.00, interest_rate: 9.25, loan_term: 3, emi_amount: 9500.00, loan_taken_on: '2022-09-20', next_payment_due: '2024-09-20', total_paid: 120000.00, status: 'Active' },
      { user_id: 5, loan_type: 'Vehicle Loan', principal_amount: 550000.00, remaining_balance: 400000.00, interest_rate: 7.75, loan_term: 5, emi_amount: 12500.00, loan_taken_on: '2021-07-05', next_payment_due: '2026-07-05', total_paid: 150000.00, status: 'Active' },
      
      { user_id: 6, loan_type: 'Personal Loan', principal_amount: 400000.00, remaining_balance: 250000.00, interest_rate: 9.00, loan_term: 4, emi_amount: 10500.00, loan_taken_on: '2022-12-10', next_payment_due: '2024-12-10', total_paid: 150000.00, status: 'Active' },
      { user_id: 6, loan_type: 'Home Loan', principal_amount: 1200000.00, remaining_balance: 900000.00, interest_rate: 8.00, loan_term: 12, emi_amount: 14500.00, loan_taken_on: '2020-08-15', next_payment_due: '2032-08-15', total_paid: 300000.00, status: 'Overdue' },
      { user_id: 6, loan_type: 'Business Equipment Loan', principal_amount: 600000.00, remaining_balance: 450000.00, interest_rate: 10.25, loan_term: 5, emi_amount: 15000.00, loan_taken_on: '2023-01-05', next_payment_due: '2026-01-05', total_paid: 150000.00, status: 'Paid' },
      { user_id: 6, loan_type: 'Education Loan', principal_amount: 250000.00, remaining_balance: 120000.00, interest_rate: 6.50, loan_term: 3, emi_amount: 7500.00, loan_taken_on: '2022-06-20', next_payment_due: '2024-06-20', total_paid: 130000.00, status: 'Active' },
      
      { user_id: 7, loan_type: 'Home Loan', principal_amount: 1800000.00, remaining_balance: 1400000.00, interest_rate: 8.50, loan_term: 18, emi_amount: 17500.00, loan_taken_on: '2019-11-01', next_payment_due: '2037-11-01', total_paid: 400000.00, status: 'Active' },
      { user_id: 7, loan_type: 'Personal Loan', principal_amount: 350000.00, remaining_balance: 220000.00, interest_rate: 9.25, loan_term: 4, emi_amount: 9500.00, loan_taken_on: '2022-10-15', next_payment_due: '2024-10-15', total_paid: 130000.00, status: 'Paid' },
      { user_id: 7, loan_type: 'Car Loan', principal_amount: 500000.00, remaining_balance: 350000.00, interest_rate: 7.25, loan_term: 5, emi_amount: 11500.00, loan_taken_on: '2021-05-20', next_payment_due: '2026-05-20', total_paid: 150000.00, status: 'Paid' },
      { user_id: 7, loan_type: 'Business Expansion Loan', principal_amount: 700000.00, remaining_balance: 500000.00, interest_rate: 10.75, loan_term: 6, emi_amount: 16000.00, loan_taken_on: '2023-02-10', next_payment_due: '2026-02-10', total_paid: 200000.00, status: 'Active' },
      
      { user_id: 8, loan_type: 'Personal Loan', principal_amount: 400000.00, remaining_balance: 280000.00, interest_rate: 9.00, loan_term: 4, emi_amount: 10500.00, loan_taken_on: '2022-11-01', next_payment_due: '2024-11-01', total_paid: 120000.00, status: 'Active' },
      { user_id: 8, loan_type: 'Home Improvement Loan', principal_amount: 500000.00, remaining_balance: 350000.00, interest_rate: 8.25, loan_term: 5, emi_amount: 12000.00, loan_taken_on: '2023-03-15', next_payment_due: '2025-03-15', total_paid: 150000.00, status: 'Overdue' },
      { user_id: 8, loan_type: 'Vehicle Loan', principal_amount: 450000.00, remaining_balance: 300000.00, interest_rate: 7.50, loan_term: 4, emi_amount: 11500.00, loan_taken_on: '2021-08-20', next_payment_due: '2025-08-20', total_paid: 150000.00, status: 'Active' },
      { user_id: 8, loan_type: 'Education Loan', principal_amount: 250000.00, remaining_balance: 130000.00, interest_rate: 6.75, loan_term: 3, emi_amount: 7500.00, loan_taken_on: '2022-05-10', next_payment_due: '2024-05-10', total_paid: 120000.00, status: 'Overdue' },
      
      { user_id: 9, loan_type: 'Business Loan', principal_amount: 600000.00, remaining_balance: 450000.00, interest_rate: 10.25, loan_term: 5, emi_amount: 15000.00, loan_taken_on: '2022-07-15', next_payment_due: '2025-07-15', total_paid: 150000.00, status: 'Active' },
      { user_id: 9, loan_type: 'Home Loan', principal_amount: 1400000.00, remaining_balance: 1100000.00, interest_rate: 8.25, loan_term: 15, emi_amount: 16500.00, loan_taken_on: '2020-09-01', next_payment_due: '2035-09-01', total_paid: 300000.00, status: 'Paid' },
      { user_id: 9, loan_type: 'Personal Loan', principal_amount: 300000.00, remaining_balance: 180000.00, interest_rate: 9.25, loan_term: 3, emi_amount: 9500.00, loan_taken_on: '2023-01-20', next_payment_due: '2024-01-20', total_paid: 120000.00, status: 'Active' },
      { user_id: 9, loan_type: 'Equipment Financing', principal_amount: 400000.00, remaining_balance: 280000.00, interest_rate: 9.50, loan_term: 4, emi_amount: 11000.00, loan_taken_on: '2022-04-10', next_payment_due: '2025-04-10', total_paid: 120000.00, status: 'Overdue' },
      
      { user_id: 10, loan_type: 'Home Loan', principal_amount: 2000000.00, remaining_balance: 1600000.00, interest_rate: 8.50, loan_term: 20, emi_amount: 18500.00, loan_taken_on: '2019-12-15', next_payment_due: '2039-12-15', total_paid: 400000.00, status: 'Active' },
      { user_id: 10, loan_type: 'Personal Loan', principal_amount: 450000.00, remaining_balance: 300000.00, interest_rate: 9.50, loan_term: 5, emi_amount: 12000.00, loan_taken_on: '2022-09-01', next_payment_due: '2025-09-01', total_paid: 150000.00, status: 'Paid' },
      { user_id: 10, loan_type: 'Business Expansion Loan', principal_amount: 800000.00, remaining_balance: 600000.00, interest_rate: 10.75, loan_term: 6, emi_amount: 17000.00, loan_taken_on: '2023-02-20', next_payment_due: '2026-02-20', total_paid: 200000.00, status: 'Overdue' },
      { user_id: 10, loan_type: 'Vehicle Loan', principal_amount: 550000.00, remaining_balance: 400000.00, interest_rate: 7.75, loan_term: 5, emi_amount: 13000.00, loan_taken_on: '2021-06-15', next_payment_due: '2026-06-15', total_paid: 150000.00, status: 'Active' }
    ];

    // Convert SQL IDs to MongoDB ObjectIds and format dates
    const mongoUserLoans = userLoansData.map(loan => ({
      user_id: userMap[loan.user_id],
      loan_type: loan.loan_type,
      principal_amount: loan.principal_amount,
      remaining_balance: loan.remaining_balance,
      interest_rate: loan.interest_rate,
      loan_term: loan.loan_term,
      emi_amount: loan.emi_amount,
      loan_taken_on: new Date(loan.loan_taken_on),
      next_payment_due: new Date(loan.next_payment_due),
      total_paid: loan.total_paid,
      status: loan.status,
      created_at: new Date()
    }));

    // Filter out any entries with undefined user_id
    const validUserLoans = mongoUserLoans.filter(loan => loan.user_id);
    
    if (validUserLoans.length !== mongoUserLoans.length) {
      console.warn(`Warning: ${mongoUserLoans.length - validUserLoans.length} loan(s) have users not found in the database`);
      const missingUserIds = userLoansData
        .filter(loan => !userMap[loan.user_id])
        .map(loan => loan.user_id);
      console.log('Missing user IDs:', missingUserIds);
    }

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