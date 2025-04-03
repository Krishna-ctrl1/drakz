const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB Connection with explicit database name
const dbURI = process.env.MONGODB_ATLAS_URI || 'mongodb://localhost:27017/DRAKZ';
mongoose.connect(dbURI, {})
  .then(() => console.log('Connected to DRAKZ database'))
  .catch(err => console.error('MongoDB connection error:', err));

// Reference existing User model structure to match your database
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

// Credit Card Bills Schema
const creditCardBillSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  card_number: {
    type: String,
    required: true
  },
  current_bill: {
    type: Number,
    required: true
  },
  minimum_amount_due: {
    type: Number,
    required: true
  },
  due_date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue'],
    default: 'pending',
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Create Credit Card Bills Model - specify the collection name explicitly
const CreditCardBill = mongoose.model('CreditCardBill', creditCardBillSchema, 'credit_card_bills');

// Insertion Function
const insertCreditCardBills = async () => {
  try {
    // First, get all users to reference their ObjectIds
    const users = await User.find().select('_id email');
    
    if (users.length === 0) {
      console.error('No users found in the DRAKZ database');
      return;
    }

    console.log(`Found ${users.length} users in the database`);

    // Map emails to user IDs - using the same mapping as in the previous scripts
    const userEmailToIndexMap = {
      'xdphantom1202@gmail.com': 1,
      'ragamaie.n23@iiits.in': 2,
      'abhinay.m23@iiits.in': 3,
      'arjun.patel@gmail.com': 4,
      'priya.sharma@yahoo.com': 5,
      'rohan.khanna@outlook.com': 6,
      'sneha.reddy@hotmail.com': 7,
      'vikram.singh@gmail.com': 8,
      'neha.gupta@yahoo.com': 9,
      'arun.kumar@outlook.com': 10
    };

    // Create a map of numeric IDs to actual MongoDB ObjectIds
    const userIdMap = {};
    users.forEach(user => {
      const numericId = userEmailToIndexMap[user.email];
      if (numericId) {
        userIdMap[numericId] = user._id;
      }
    });

    // Credit Card Bills data from SQL converted to MongoDB format
    const creditCardBillsData = [
      { user_id: 1, card_number: '4111 1111 1111 1111', current_bill: 45250.75, minimum_amount_due: 2262.54, due_date: new Date('2025-04-21'), status: 'pending' },
      { user_id: 1, card_number: '4666 6666 6666 6666', current_bill: 32100.50, minimum_amount_due: 1605.03, due_date: new Date('2025-03-23'), status: 'overdue' },
      { user_id: 1, card_number: '4777 7777 7777 7777', current_bill: 58750.25, minimum_amount_due: 2937.51, due_date: new Date('2025-03-24'), status: 'paid' },
      { user_id: 1, card_number: '4888 8888 8888 8888', current_bill: 41600.90, minimum_amount_due: 2080.05, due_date: new Date('2025-04-22'), status: 'pending' },
      { user_id: 1, card_number: '4999 9999 9999 9999', current_bill: 37890.60, minimum_amount_due: 1894.53, due_date: new Date('2025-03-25'), status: 'paid' },
      { user_id: 2, card_number: '4222 2222 2222 2222', current_bill: 52340.30, minimum_amount_due: 2617.02, due_date: new Date('2025-03-26'), status: 'overdue' },
      { user_id: 2, card_number: '4333 3333 3333 3333', current_bill: 28750.40, minimum_amount_due: 1437.52, due_date: new Date('2025-04-23'), status: 'pending' },
      { user_id: 2, card_number: '4444 4444 4444 4444', current_bill: 35600.75, minimum_amount_due: 1780.04, due_date: new Date('2025-03-22'), status: 'paid' },
      { user_id: 2, card_number: '4555 5555 5555 5555', current_bill: 47890.20, minimum_amount_due: 2394.51, due_date: new Date('2025-03-21'), status: 'overdue' },
      { user_id: 2, card_number: '4000 0000 0000 0000', current_bill: 33750.85, minimum_amount_due: 1687.54, due_date: new Date('2025-04-25'), status: 'pending' },
      { user_id: 3, card_number: '4111 2222 3333 4444', current_bill: 62500.75, minimum_amount_due: 3125.04, due_date: new Date('2025-04-22'), status: 'pending' },
      { user_id: 3, card_number: '4555 6666 7777 8888', current_bill: 41230.50, minimum_amount_due: 2061.53, due_date: new Date('2025-03-24'), status: 'overdue' },
      { user_id: 3, card_number: '4999 8888 7777 6666', current_bill: 55670.25, minimum_amount_due: 2783.51, due_date: new Date('2025-03-26'), status: 'paid' },
      { user_id: 3, card_number: '4333 4444 5555 6666', current_bill: 38920.90, minimum_amount_due: 1946.05, due_date: new Date('2025-04-24'), status: 'pending' },
      { user_id: 3, card_number: '4777 8888 9999 0000', current_bill: 49230.60, minimum_amount_due: 2461.53, due_date: new Date('2025-03-23'), status: 'paid' },
      { user_id: 4, card_number: '4444 1111 2222 3333', current_bill: 35890.75, minimum_amount_due: 1794.54, due_date: new Date('2025-04-21'), status: 'pending' },
      { user_id: 4, card_number: '4888 5555 6666 7777', current_bill: 25670.40, minimum_amount_due: 1283.52, due_date: new Date('2025-03-26'), status: 'overdue' },
      { user_id: 4, card_number: '4222 9999 8888 7777', current_bill: 42350.25, minimum_amount_due: 2117.51, due_date: new Date('2025-03-22'), status: 'paid' },
      { user_id: 4, card_number: '4666 3333 4444 5555', current_bill: 38620.90, minimum_amount_due: 1931.05, due_date: new Date('2025-04-25'), status: 'pending' },
      { user_id: 4, card_number: '4000 7777 8888 9999', current_bill: 30450.60, minimum_amount_due: 1522.53, due_date: new Date('2025-03-25'), status: 'paid' },
      { user_id: 5, card_number: '4555 2222 3333 4444', current_bill: 67500.75, minimum_amount_due: 3375.04, due_date: new Date('2025-04-22'), status: 'pending' },
      { user_id: 5, card_number: '4111 6666 7777 8888', current_bill: 45230.50, minimum_amount_due: 2261.53, due_date: new Date('2025-03-23'), status: 'overdue' },
      { user_id: 5, card_number: '4999 4444 5555 6666', current_bill: 58670.25, minimum_amount_due: 2933.51, due_date: new Date('2025-03-24'), status: 'paid' },
      { user_id: 5, card_number: '4333 8888 9999 0000', current_bill: 52920.90, minimum_amount_due: 2646.05, due_date: new Date('2025-04-26'), status: 'pending' },
      { user_id: 5, card_number: '4777 2222 3333 4444', current_bill: 43230.60, minimum_amount_due: 2161.53, due_date: new Date('2025-03-25'), status: 'paid' },
      { user_id: 6, card_number: '4444 5555 6666 7777', current_bill: 39890.75, minimum_amount_due: 1994.54, due_date: new Date('2025-04-21'), status: 'pending' },
      { user_id: 6, card_number: '4888 1111 2222 3333', current_bill: 29670.40, minimum_amount_due: 1483.52, due_date: new Date('2025-03-23'), status: 'overdue' },
      { user_id: 6, card_number: '4222 7777 8888 9999', current_bill: 46350.25, minimum_amount_due: 2317.51, due_date: new Date('2025-03-26'), status: 'paid' },
      { user_id: 6, card_number: '4666 9999 0000 1111', current_bill: 42620.90, minimum_amount_due: 2131.05, due_date: new Date('2025-04-24'), status: 'pending' },
      { user_id: 6, card_number: '4000 3333 4444 5555', current_bill: 34450.60, minimum_amount_due: 1722.53, due_date: new Date('2025-03-22'), status: 'paid' },
      { user_id: 7, card_number: '4555 6666 7777 8888', current_bill: 33250.75, minimum_amount_due: 1662.54, due_date: new Date('2025-04-22'), status: 'pending' },
      { user_id: 7, card_number: '4111 4444 5555 6666', current_bill: 25670.50, minimum_amount_due: 1283.53, due_date: new Date('2025-03-23'), status: 'overdue' },
      { user_id: 7, card_number: '4999 2222 3333 4444', current_bill: 40670.25, minimum_amount_due: 2033.51, due_date: new Date('2025-03-24'), status: 'paid' },
      { user_id: 7, card_number: '4333 6666 7777 8888', current_bill: 36920.90, minimum_amount_due: 1846.05, due_date: new Date('2025-04-25'), status: 'pending' },
      { user_id: 7, card_number: '4777 4444 5555 6666', current_bill: 29230.60, minimum_amount_due: 1461.53, due_date: new Date('2025-03-25'), status: 'paid' },
      { user_id: 8, card_number: '4444 7777 8888 9999', current_bill: 75890.75, minimum_amount_due: 3794.54, due_date: new Date('2025-04-26'), status: 'pending' },
      { user_id: 8, card_number: '4888 3333 4444 5555', current_bill: 52670.40, minimum_amount_due: 2633.52, due_date: new Date('2025-03-24'), status: 'overdue' },
      { user_id: 8, card_number: '4222 5555 6666 7777', current_bill: 68350.25, minimum_amount_due: 3417.51, due_date: new Date('2025-03-22'), status: 'paid' },
      { user_id: 8, card_number: '4666 1111 2222 3333', current_bill: 62620.90, minimum_amount_due: 3131.05, due_date: new Date('2025-04-24'), status: 'pending' },
      { user_id: 8, card_number: '4000 9999 0000 1111', current_bill: 57450.60, minimum_amount_due: 2872.53, due_date: new Date('2025-03-23'), status: 'paid' },
      { user_id: 9, card_number: '4555 8888 9999 0000', current_bill: 37250.75, minimum_amount_due: 1862.54, due_date: new Date('2025-04-22'), status: 'pending' },
      { user_id: 9, card_number: '4111 6666 7777 8888', current_bill: 29670.50, minimum_amount_due: 1483.53, due_date: new Date('2025-03-23'), status: 'overdue' },
      { user_id: 9, card_number: '4999 4444 5555 6666', current_bill: 44670.25, minimum_amount_due: 2233.51, due_date: new Date('2025-03-26'), status: 'paid' },
      { user_id: 9, card_number: '4333 2222 3333 4444', current_bill: 40920.90, minimum_amount_due: 2046.05, due_date: new Date('2025-04-25'), status: 'pending' },
      { user_id: 9, card_number: '4777 6666 7777 8888', current_bill: 33230.60, minimum_amount_due: 1661.53, due_date: new Date('2025-03-22'), status: 'paid' },
      { user_id: 10, card_number: '4444 9999 0000 1111', current_bill: 42890.75, minimum_amount_due: 2144.54, due_date: new Date('2025-04-21'), status: 'pending' },
      { user_id: 10, card_number: '4888 7777 8888 9999', current_bill: 35670.40, minimum_amount_due: 1783.52, due_date: new Date('2025-03-23'), status: 'overdue' },
      { user_id: 10, card_number: '4222 3333 4444 5555', current_bill: 49350.25, minimum_amount_due: 2467.51, due_date: new Date('2025-03-24'), status: 'paid' },
      { user_id: 10, card_number: '4666 5555 6666 7777', current_bill: 45620.90, minimum_amount_due: 2281.05, due_date: new Date('2025-04-25'), status: 'pending' },
      { user_id: 10, card_number: '4000 1111 2222 3333', current_bill: 38450.60, minimum_amount_due: 1922.53, due_date: new Date('2025-03-25'), status: 'paid' }
    ];

    // Map the SQL numeric user_ids to MongoDB ObjectIds
    const creditCardBillsWithObjectIds = creditCardBillsData.map(bill => ({
      user_id: userIdMap[bill.user_id],
      card_number: bill.card_number,
      current_bill: bill.current_bill,
      minimum_amount_due: bill.minimum_amount_due,
      due_date: bill.due_date,
      status: bill.status
    }));

    // Filter out any entries with undefined user_id
    const validCreditCardBills = creditCardBillsWithObjectIds.filter(bill => bill.user_id);
    
    if (validCreditCardBills.length !== creditCardBillsWithObjectIds.length) {
      console.warn(`Warning: ${creditCardBillsWithObjectIds.length - validCreditCardBills.length} credit card bill(s) have users not found in the database`);
      
      // Log the missing user IDs
      const missingUserIds = creditCardBillsData
        .filter(bill => !userIdMap[bill.user_id])
        .map(bill => bill.user_id);
      console.log('Missing user IDs:', [...new Set(missingUserIds)]);
    }

    // Insert credit card bills
    const result = await CreditCardBill.insertMany(validCreditCardBills);
    console.log('Credit card bills inserted successfully:', result.length);
  } catch (error) {
    console.error('Error inserting credit card bills:', error);
  } finally {
    // Close the connection after operation completes
    mongoose.connection.close()
      .then(() => console.log('MongoDB connection closed'))
      .catch(err => console.error('Error closing MongoDB connection:', err));
  }
};

// Run the insertion
insertCreditCardBills();