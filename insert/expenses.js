const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const dbURI = process.env.MONGODB_ATLAS_URI || 'mongodb://localhost:27017/DRAKZ';
mongoose.connect(dbURI, {})
  .then(() => console.log('Connected to DRAKZ database'))
  .catch(err => console.error('MongoDB connection error:', err));

// Reference User and Expense models
const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
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
}), 'users');

const Expense = mongoose.model('Expense', new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  category: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  date: { type: Date, required: true, default: Date.now }
}, { timestamps: true, collection: 'expenses' }));

// Function to generate a random date within the last 30 days
function getRandomDateInLast30Days() {
  const today = new Date();
  const daysAgo = Math.floor(Math.random() * 30); // 0 to 29 days ago
  const randomDate = new Date(today);
  randomDate.setDate(today.getDate() - daysAgo);
  randomDate.setHours(Math.floor(Math.random() * 24));
  randomDate.setMinutes(Math.floor(Math.random() * 60));
  return randomDate;
}

// Insertion Function
const insertExpenses = async () => {
  try {
    // Fetch all users to get their ObjectIds
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

    // Sample expense data
    const expensesData = [
      // User 1 - XD Phantom
      { email: 'xdphantom1202@gmail.com', category: 'Groceries', amount: 4500 },
      { email: 'xdphantom1202@gmail.com', category: 'Utilities', amount: 2500 },
      { email: 'xdphantom1202@gmail.com', category: 'Dining Out', amount: 3500 },
      { email: 'xdphantom1202@gmail.com', category: 'Entertainment', amount: 2000 },
      { email: 'xdphantom1202@gmail.com', category: 'Transportation', amount: 1800 },
      
      // User 2 - Ragamaie Nagineni
      { email: 'ragamaie.n23@iiits.in', category: 'Rent', amount: 8000 },
      { email: 'ragamaie.n23@iiits.in', category: 'Groceries', amount: 4000 },
      { email: 'ragamaie.n23@iiits.in', category: 'Online Courses', amount: 3000 },
      { email: 'ragamaie.n23@iiits.in', category: 'Technology', amount: 2500 },
      
      // User 3 - Abhinay Malle
      { email: 'abhinay.m23@iiits.in', category: 'Business Expenses', amount: 12000 },
      { email: 'abhinay.m23@iiits.in', category: 'Office Supplies', amount: 3500 },
      { email: 'abhinay.m23@iiits.in', category: 'Marketing', amount: 5000 },
      
      // User 4 - Arjun Patel
      { email: 'arjun.patel@gmail.com', category: 'Rent', amount: 7000 },
      { email: 'arjun.patel@gmail.com', category: 'Utilities', amount: 2000 },
      { email: 'arjun.patel@gmail.com', category: 'Groceries', amount: 4500 },
      
      // User 5 - Priya Sharma
      { email: 'priya.sharma@yahoo.com', category: 'Luxury Shopping', amount: 10000 },
      { email: 'priya.sharma@yahoo.com', category: 'Fine Dining', amount: 6000 },
      { email: 'priya.sharma@yahoo.com', category: 'Travel', amount: 15000 }
    ];

    // Prepare expense data with user_id and random dates
    const expenseDocuments = expensesData.map(expense => ({
      user_id: userMap[expense.email],
      category: expense.category,
      amount: expense.amount,
      date: getRandomDateInLast30Days() // Random date within last 30 days
    }));

    // Filter out entries with undefined user_id
    const validExpenses = expenseDocuments.filter(expense => expense.user_id);
    
    if (validExpenses.length !== expenseDocuments.length) {
      console.warn(`Warning: ${expenseDocuments.length - validExpenses.length} expense entries couldn't be matched to users`);
      const missingEmails = [...new Set(
        expensesData
          .filter(expense => !userMap[expense.email])
          .map(expense => expense.email)
      )];
      console.log('Missing user emails:', missingEmails);
    }

    // Insert expenses
    const result = await Expense.insertMany(validExpenses);
    console.log(`Inserted ${result.length} expenses successfully`);

  } catch (error) {
    console.error('Error inserting expenses:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

// Run the insertion
insertExpenses();