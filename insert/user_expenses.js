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

// User Expenses Schema
const userExpensesSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  expense_month: {
    type: Date,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Create User Expenses Model - specify the collection name explicitly
const UserExpense = mongoose.model('UserExpense', userExpensesSchema, 'user_expenses');

// Insertion Function
const insertUserExpenses = async () => {
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

    // Current date for expense_month
    const currentDate = new Date();

    // Expense data mapped by user email
    const expensesData = [
      // User 1 - XD Phantom
      { email: 'xdphantom1202@gmail.com', category: 'Groceries', amount: 450.00 },
      { email: 'xdphantom1202@gmail.com', category: 'Utilities', amount: 250.00 },
      { email: 'xdphantom1202@gmail.com', category: 'Dining Out', amount: 350.00 },
      { email: 'xdphantom1202@gmail.com', category: 'Entertainment', amount: 200.00 },
      { email: 'xdphantom1202@gmail.com', category: 'Transportation', amount: 180.00 },
      { email: 'xdphantom1202@gmail.com', category: 'Shopping', amount: 500.00 },
      { email: 'xdphantom1202@gmail.com', category: 'Health & Fitness', amount: 150.00 },
      
      // User 2 - Ragamaie Nagineni
      { email: 'ragamaie.n23@iiits.in', category: 'Rent', amount: 800.00 },
      { email: 'ragamaie.n23@iiits.in', category: 'Groceries', amount: 400.00 },
      { email: 'ragamaie.n23@iiits.in', category: 'Online Courses', amount: 300.00 },
      { email: 'ragamaie.n23@iiits.in', category: 'Technology', amount: 250.00 },
      { email: 'ragamaie.n23@iiits.in', category: 'Insurance', amount: 200.00 },
      { email: 'ragamaie.n23@iiits.in', category: 'Travel', amount: 600.00 },
      { email: 'ragamaie.n23@iiits.in', category: 'Healthcare', amount: 350.00 },
      
      // User 3 - Abhinay Malle
      { email: 'abhinay.m23@iiits.in', category: 'Business Expenses', amount: 1200.00 },
      { email: 'abhinay.m23@iiits.in', category: 'Office Supplies', amount: 350.00 },
      { email: 'abhinay.m23@iiits.in', category: 'Marketing', amount: 500.00 },
      { email: 'abhinay.m23@iiits.in', category: 'Client Entertainment', amount: 450.00 },
      { email: 'abhinay.m23@iiits.in', category: 'Travel', amount: 800.00 },
      { email: 'abhinay.m23@iiits.in', category: 'Consulting Fees', amount: 700.00 },
      { email: 'abhinay.m23@iiits.in', category: 'Software Subscriptions', amount: 250.00 },
      
      // User 4 - Arjun Patel
      { email: 'arjun.patel@gmail.com', category: 'Rent', amount: 700.00 },
      { email: 'arjun.patel@gmail.com', category: 'Utilities', amount: 200.00 },
      { email: 'arjun.patel@gmail.com', category: 'Groceries', amount: 450.00 },
      { email: 'arjun.patel@gmail.com', category: 'Education', amount: 300.00 },
      { email: 'arjun.patel@gmail.com', category: 'Transportation', amount: 180.00 },
      { email: 'arjun.patel@gmail.com', category: 'Healthcare', amount: 250.00 },
      { email: 'arjun.patel@gmail.com', category: 'Entertainment', amount: 220.00 },
      
      // User 5 - Priya Sharma
      { email: 'priya.sharma@yahoo.com', category: 'Luxury Shopping', amount: 1000.00 },
      { email: 'priya.sharma@yahoo.com', category: 'Fine Dining', amount: 600.00 },
      { email: 'priya.sharma@yahoo.com', category: 'Travel', amount: 1500.00 },
      { email: 'priya.sharma@yahoo.com', category: 'Skincare & Beauty', amount: 400.00 },
      { email: 'priya.sharma@yahoo.com', category: 'Fitness Membership', amount: 180.00 },
      { email: 'priya.sharma@yahoo.com', category: 'Personal Development', amount: 300.00 },
      { email: 'priya.sharma@yahoo.com', category: 'Technology Gadgets', amount: 750.00 },
      
      // User 6 - Rohan Khanna
      { email: 'rohan.khanna@outlook.com', category: 'Rent', amount: 900.00 },
      { email: 'rohan.khanna@outlook.com', category: 'Consulting Tools', amount: 500.00 },
      { email: 'rohan.khanna@outlook.com', category: 'Professional Networking', amount: 250.00 },
      { email: 'rohan.khanna@outlook.com', category: 'Travel', amount: 700.00 },
      { email: 'rohan.khanna@outlook.com', category: 'Books & Learning', amount: 200.00 },
      { email: 'rohan.khanna@outlook.com', category: 'Coworking Space', amount: 350.00 },
      { email: 'rohan.khanna@outlook.com', category: 'Technology', amount: 450.00 },
      
      // User 7 - Sneha Reddy
      { email: 'sneha.reddy@hotmail.com', category: 'Data Science Tools', amount: 600.00 },
      { email: 'sneha.reddy@hotmail.com', category: 'Online Courses', amount: 400.00 },
      { email: 'sneha.reddy@hotmail.com', category: 'Conferences', amount: 500.00 },
      { email: 'sneha.reddy@hotmail.com', category: 'Home Office Setup', amount: 350.00 },
      { email: 'sneha.reddy@hotmail.com', category: 'Professional Memberships', amount: 200.00 },
      { email: 'sneha.reddy@hotmail.com', category: 'Health Insurance', amount: 250.00 },
      { email: 'sneha.reddy@hotmail.com', category: 'Technology Upgrades', amount: 450.00 },
      
      // User 8 - Vikram Singh
      { email: 'vikram.singh@gmail.com', category: 'Investment Platforms', amount: 500.00 },
      { email: 'vikram.singh@gmail.com', category: 'Financial Advisory', amount: 400.00 },
      { email: 'vikram.singh@gmail.com', category: 'High-End Electronics', amount: 1200.00 },
      { email: 'vikram.singh@gmail.com', category: 'International Travel', amount: 2000.00 },
      { email: 'vikram.singh@gmail.com', category: 'Luxury Clothing', amount: 800.00 },
      { email: 'vikram.singh@gmail.com', category: 'Personal Security', amount: 300.00 },
      { email: 'vikram.singh@gmail.com', category: 'Private Coaching', amount: 600.00 },
      
      // User 9 - Neha Gupta
      { email: 'neha.gupta@yahoo.com', category: 'Classroom Supplies', amount: 200.00 },
      { email: 'neha.gupta@yahoo.com', category: 'Professional Development', amount: 350.00 },
      { email: 'neha.gupta@yahoo.com', category: 'Family Expenses', amount: 500.00 },
      { email: 'neha.gupta@yahoo.com', category: 'Home Renovation', amount: 700.00 },
      { email: 'neha.gupta@yahoo.com', category: 'Education Insurance', amount: 250.00 },
      { email: 'neha.gupta@yahoo.com', category: 'Child Care', amount: 400.00 },
      { email: 'neha.gupta@yahoo.com', category: 'Personal Wellness', amount: 180.00 },
      
      // User 10 - Arun Kumar
      { email: 'arun.kumar@outlook.com', category: 'Business Networking', amount: 400.00 },
      { email: 'arun.kumar@outlook.com', category: 'Sales Tools', amount: 300.00 },
      { email: 'arun.kumar@outlook.com', category: 'Professional Attire', amount: 450.00 },
      { email: 'arun.kumar@outlook.com', category: 'Training Programs', amount: 500.00 },
      { email: 'arun.kumar@outlook.com', category: 'CRM Software', amount: 250.00 },
      { email: 'arun.kumar@outlook.com', category: 'Travel for Work', amount: 800.00 },
      { email: 'arun.kumar@outlook.com', category: 'Marketing Materials', amount: 350.00 }
    ];

    // Prepare user expenses data with ObjectIds
    const userExpensesData = expensesData.map(expense => ({
      user_id: userMap[expense.email],
      category: expense.category,
      amount: expense.amount,
      expense_month: currentDate
    }));

    // Filter out any entries with undefined user_id
    const validUserExpenses = userExpensesData.filter(expense => expense.user_id);
    
    if (validUserExpenses.length !== userExpensesData.length) {
      console.warn(`Warning: ${userExpensesData.length - validUserExpenses.length} expense entries couldn't be matched to users`);
      const missingEmails = [...new Set(
        expensesData
          .filter(expense => !userMap[expense.email])
          .map(expense => expense.email)
      )];
      console.log('Missing user emails:', missingEmails);
    }

    // Insert user expenses
    const result = await UserExpense.insertMany(validUserExpenses);
    console.log('User expenses inserted successfully:', result.length);
  } catch (error) {
    console.error('Error inserting user expenses:', error);
  } finally {
    // Close the connection after operation completes
    mongoose.connection.close()
      .then(() => console.log('MongoDB connection closed'))
      .catch(err => console.error('Error closing MongoDB connection:', err));
  }
};

// Run the insertion
insertUserExpenses();