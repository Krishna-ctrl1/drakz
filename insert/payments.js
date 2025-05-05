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

// Payments Schema
const paymentsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  payment_id: {
    type: String,
    required: true
  },
  order_id: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Completed', 'Pending', 'Failed']
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Create Payments Model - specify the collection name explicitly
const Payments = mongoose.model('Payments', paymentsSchema, 'payments');

// Insertion Function
const insertPayments = async () => {
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
    const paymentsData = [
      { user_id: 1, payment_id: 'PAY10001', order_id: 'ORD10001', amount: 75000.00, status: 'Completed' },
      { user_id: 1, payment_id: 'PAY10002', order_id: 'ORD10002', amount: 45000.50, status: 'Completed' },
      { user_id: 1, payment_id: 'PAY10003', order_id: 'ORD10003', amount: 120000.75, status: 'Completed' },
      { user_id: 1, payment_id: 'PAY10004', order_id: 'ORD10004', amount: 60000.25, status: 'Pending' },
      { user_id: 1, payment_id: 'PAY10005', order_id: 'ORD10005', amount: 90000.60, status: 'Completed' },
      { user_id: 2, payment_id: 'PAY10006', order_id: 'ORD10006', amount: 68000.00, status: 'Completed' },
      { user_id: 2, payment_id: 'PAY10007', order_id: 'ORD10007', amount: 55000.50, status: 'Pending' },
      { user_id: 2, payment_id: 'PAY10008', order_id: 'ORD10008', amount: 95000.75, status: 'Completed' },
      { user_id: 2, payment_id: 'PAY10009', order_id: 'ORD10009', amount: 72000.25, status: 'Completed' },
      { user_id: 2, payment_id: 'PAY10010', order_id: 'ORD10010', amount: 85000.60, status: 'Failed' },
      { user_id: 3, payment_id: 'PAY10011', order_id: 'ORD10011', amount: 91000.00, status: 'Completed' },
      { user_id: 3, payment_id: 'PAY10012', order_id: 'ORD10012', amount: 65000.50, status: 'Pending' },
      { user_id: 3, payment_id: 'PAY10013', order_id: 'ORD10013', amount: 110000.75, status: 'Completed' },
      { user_id: 3, payment_id: 'PAY10014', order_id: 'ORD10014', amount: 78000.25, status: 'Completed' },
      { user_id: 3, payment_id: 'PAY10015', order_id: 'ORD10015', amount: 105000.60, status: 'Failed' },
      { user_id: 4, payment_id: 'PAY10016', order_id: 'ORD10016', amount: 65000.00, status: 'Completed' },
      { user_id: 4, payment_id: 'PAY10017', order_id: 'ORD10017', amount: 50000.50, status: 'Pending' },
      { user_id: 4, payment_id: 'PAY10018', order_id: 'ORD10018', amount: 82000.75, status: 'Completed' },
      { user_id: 4, payment_id: 'PAY10019', order_id: 'ORD10019', amount: 58000.25, status: 'Completed' },
      { user_id: 4, payment_id: 'PAY10020', order_id: 'ORD10020', amount: 75000.60, status: 'Failed' },
      { user_id: 5, payment_id: 'PAY10021', order_id: 'ORD10021', amount: 95000.00, status: 'Completed' },
      { user_id: 5, payment_id: 'PAY10022', order_id: 'ORD10022', amount: 72000.50, status: 'Pending' },
      { user_id: 5, payment_id: 'PAY10023', order_id: 'ORD10023', amount: 120000.75, status: 'Completed' },
      { user_id: 5, payment_id: 'PAY10024', order_id: 'ORD10024', amount: 88000.25, status: 'Completed' },
      { user_id: 5, payment_id: 'PAY10025', order_id: 'ORD10025', amount: 105000.60, status: 'Failed' },
      { user_id: 6, payment_id: 'PAY10026', order_id: 'ORD10026', amount: 87000.00, status: 'Completed' },
      { user_id: 6, payment_id: 'PAY10027', order_id: 'ORD10027', amount: 62000.50, status: 'Pending' },
      { user_id: 6, payment_id: 'PAY10028', order_id: 'ORD10028', amount: 98000.75, status: 'Completed' },
      { user_id: 6, payment_id: 'PAY10029', order_id: 'ORD10029', amount: 75000.25, status: 'Completed' },
      { user_id: 6, payment_id: 'PAY10030', order_id: 'ORD10030', amount: 92000.60, status: 'Failed' },
      { user_id: 7, payment_id: 'PAY10031', order_id: 'ORD10031', amount: 72000.00, status: 'Completed' },
      { user_id: 7, payment_id: 'PAY10032', order_id: 'ORD10032', amount: 55000.50, status: 'Pending' },
      { user_id: 7, payment_id: 'PAY10033', order_id: 'ORD10033', amount: 85000.75, status: 'Completed' },
      { user_id: 7, payment_id: 'PAY10034', order_id: 'ORD10034', amount: 68000.25, status: 'Completed' },
      { user_id: 7, payment_id: 'PAY10035', order_id: 'ORD10035', amount: 80000.60, status: 'Failed' },
      { user_id: 8, payment_id: 'PAY10036', order_id: 'ORD10036', amount: 105000.00, status: 'Completed' },
      { user_id: 8, payment_id: 'PAY10037', order_id: 'ORD10037', amount: 78000.50, status: 'Pending' },
      { user_id: 8, payment_id: 'PAY10038', order_id: 'ORD10038', amount: 132000.75, status: 'Completed' },
      { user_id: 8, payment_id: 'PAY10039', order_id: 'ORD10039', amount: 95000.25, status: 'Completed' },
      { user_id: 8, payment_id: 'PAY10040', order_id: 'ORD10040', amount: 115000.60, status: 'Failed' },
      { user_id: 9, payment_id: 'PAY10041', order_id: 'ORD10041', amount: 68000.00, status: 'Completed' },
      { user_id: 9, payment_id: 'PAY10042', order_id: 'ORD10042', amount: 52000.50, status: 'Pending' },
      { user_id: 9, payment_id: 'PAY10043', order_id: 'ORD10043', amount: 85000.75, status: 'Completed' },
      { user_id: 9, payment_id: 'PAY10044', order_id: 'ORD10044', amount: 70000.25, status: 'Completed' },
      { user_id: 9, payment_id: 'PAY10045', order_id: 'ORD10045', amount: 82000.60, status: 'Failed' },
      { user_id: 10, payment_id: 'PAY10046', order_id: 'ORD10046', amount: 80000.00, status: 'Completed' },
      { user_id: 10, payment_id: 'PAY10047', order_id: 'ORD10047', amount: 60000.50, status: 'Pending' },
      { user_id: 10, payment_id: 'PAY10048', order_id: 'ORD10048', amount: 95000.75, status: 'Completed' },
      { user_id: 10, payment_id: 'PAY10049', order_id: 'ORD10049', amount: 75000.25, status: 'Completed' },
      { user_id: 10, payment_id: 'PAY10050', order_id: 'ORD10050', amount: 88000.60, status: 'Failed' }
    ];

    // Convert SQL IDs to MongoDB ObjectIds
    const mongoPayments = paymentsData.map(payment => ({
      user_id: userMap[payment.user_id],
      payment_id: payment.payment_id,
      order_id: payment.order_id,
      amount: payment.amount,
      status: payment.status,
      created_at: new Date()
    }));

    // Filter out any entries with undefined user_id
    const validPayments = mongoPayments.filter(payment => payment.user_id);
    
    if (validPayments.length !== mongoPayments.length) {
      console.warn(`Warning: ${mongoPayments.length - validPayments.length} payment entries have users not found in the database`);
      const missingUserIds = paymentsData
        .filter(payment => !userMap[payment.user_id])
        .map(payment => payment.user_id);
      console.log('Missing user IDs:', [...new Set(missingUserIds)]);
    }

    // Insert payments
    const result = await Payments.insertMany(validPayments);
    console.log('Payments inserted successfully:', result.length);
    
  } catch (error) {
    console.error('Error inserting payments:', error);
  } finally {
    // Close the connection after operation completes
    mongoose.connection.close()
      .then(() => console.log('MongoDB connection closed'))
      .catch(err => console.error('Error closing MongoDB connection:', err));
  }
};

// Run the insertion
insertPayments();