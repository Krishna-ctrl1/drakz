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

// Invoices Schema
const invoiceSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  store_name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  transaction_time: {
    type: Date,
    required: true,
    default: Date.now
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Create Invoice Model - specify the collection name explicitly
const Invoice = mongoose.model('Invoice', invoiceSchema, 'invoices');

// Insertion Function
const insertInvoices = async () => {
  try {
    // First, get all users to reference their ObjectIds
    const users = await User.find().select('_id email');
    
    if (users.length === 0) {
      console.error('No users found in the DRAKZ database');
      return;
    }

    console.log(`Found ${users.length} users in the database`);

    // Let's map users to numeric IDs to match the SQL data
    // We'll just use array indices for this example
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

    // Create a map of these numeric IDs to actual MongoDB ObjectIds
    const userIdMap = {};
    users.forEach(user => {
      const numericId = userEmailToIndexMap[user.email];
      if (numericId) {
        userIdMap[numericId] = user._id;
      }
    });

    // Invoice data from SQL converted to MongoDB format
    const invoiceData = [
      { user_id: 1, store_name: 'Apple Store', amount: 1245.99, transaction_time: new Date('2025-03-23T14:23:45') },
      { user_id: 1, store_name: 'Amazon', amount: 456.75, transaction_time: new Date('2025-03-23T11:45:22') },
      { user_id: 1, store_name: 'Starbucks', amount: 18.50, transaction_time: new Date('2025-03-24T08:15:33') },
      { user_id: 1, store_name: 'Nike', amount: 215.60, transaction_time: new Date('2025-03-24T16:37:11') },
      { user_id: 1, store_name: 'Uber Eats', amount: 42.30, transaction_time: new Date('2025-03-25T19:45:00') },
      { user_id: 2, store_name: 'Flipkart', amount: 785.40, transaction_time: new Date('2025-03-23T10:22:15') },
      { user_id: 2, store_name: 'Zara', amount: 350.25, transaction_time: new Date('2025-03-24T15:33:44') },
      { user_id: 2, store_name: 'Swiggy', amount: 65.75, transaction_time: new Date('2025-03-25T20:11:22') },
      { user_id: 2, store_name: 'BookMyShow', amount: 450.00, transaction_time: new Date('2025-03-26T18:45:33') },
      { user_id: 2, store_name: 'Ola Cabs', amount: 175.50, transaction_time: new Date('2025-03-27T07:30:45') },
      { user_id: 3, store_name: 'Amazon', amount: 1200.75, transaction_time: new Date('2025-03-23T13:44:22') },
      { user_id: 3, store_name: 'Reliance Digital', amount: 650.30, transaction_time: new Date('2025-03-24T16:22:11') },
      { user_id: 3, store_name: 'Big Basket', amount: 225.60, transaction_time: new Date('2025-03-25T11:33:44') },
      { user_id: 3, store_name: 'Myntra', amount: 475.90, transaction_time: new Date('2025-03-26T14:55:33') },
      { user_id: 3, store_name: 'Domino\'s Pizza', amount: 560.25, transaction_time: new Date('2025-03-27T19:22:11') },
      { user_id: 4, store_name: 'Croma', amount: 890.50, transaction_time: new Date('2025-03-23T12:11:22') },
      { user_id: 4, store_name: 'Swiggy', amount: 95.75, transaction_time: new Date('2025-03-24T20:33:44') },
      { user_id: 4, store_name: 'BookMyShow', amount: 350.00, transaction_time: new Date('2025-03-25T18:22:33') },
      { user_id: 4, store_name: 'Zomato', amount: 165.40, transaction_time: new Date('2025-03-26T19:45:11') },
      { user_id: 4, store_name: 'Big Bazaar', amount: 275.60, transaction_time: new Date('2025-03-27T10:33:22') },
      { user_id: 5, store_name: 'Sephora', amount: 1150.75, transaction_time: new Date('2025-03-23T15:44:33') },
      { user_id: 5, store_name: 'Myntra', amount: 680.25, transaction_time: new Date('2025-03-24T11:22:45') },
      { user_id: 5, store_name: 'Uber Eats', amount: 95.50, transaction_time: new Date('2025-03-25T20:11:22') },
      { user_id: 5, store_name: 'PVR Cinemas', amount: 550.00, transaction_time: new Date('2025-03-26T17:33:44') },
      { user_id: 5, store_name: 'Cult.fit', amount: 250.75, transaction_time: new Date('2025-03-27T08:45:11') },
      { user_id: 6, store_name: 'Amazon', amount: 750.40, transaction_time: new Date('2025-03-23T09:22:33') },
      { user_id: 6, store_name: 'Flipkart', amount: 450.75, transaction_time: new Date('2025-03-24T14:33:45') },
      { user_id: 6, store_name: 'Zara', amount: 680.25, transaction_time: new Date('2025-03-25T16:11:22') },
      { user_id: 6, store_name: 'Food Panda', amount: 110.50, transaction_time: new Date('2025-03-26T20:45:33') },
      { user_id: 6, store_name: 'Reliance Trends', amount: 350.60, transaction_time: new Date('2025-03-27T12:22:11') },
      { user_id: 7, store_name: 'Ajio', amount: 590.75, transaction_time: new Date('2025-03-23T11:33:44') },
      { user_id: 7, store_name: 'Swiggy', amount: 85.50, transaction_time: new Date('2025-03-24T20:22:33') },
      { user_id: 7, store_name: 'Big Basket', amount: 275.40, transaction_time: new Date('2025-03-25T09:45:11') },
      { user_id: 7, store_name: 'BookMyShow', amount: 450.00, transaction_time: new Date('2025-03-26T18:11:22') },
      { user_id: 7, store_name: 'Nike', amount: 350.75, transaction_time: new Date('2025-03-27T15:33:45') },
      { user_id: 8, store_name: 'Apple Store', amount: 2450.99, transaction_time: new Date('2025-03-23T16:44:22') },
      { user_id: 8, store_name: 'Croma', amount: 1250.50, transaction_time: new Date('2025-03-24T12:33:11') },
      { user_id: 8, store_name: 'Zomato', amount: 195.75, transaction_time: new Date('2025-03-25T20:22:33') },
      { user_id: 8, store_name: 'Bose', amount: 980.25, transaction_time: new Date('2025-03-26T14:11:45') },
      { user_id: 8, store_name: 'Big Bazaar', amount: 350.60, transaction_time: new Date('2025-03-27T10:45:22') },
      { user_id: 9, store_name: 'Amazon', amount: 680.40, transaction_time: new Date('2025-03-23T10:11:33') },
      { user_id: 9, store_name: 'Flipkart', amount: 450.75, transaction_time: new Date('2025-03-24T15:22:45') },
      { user_id: 9, store_name: 'Swiggy', amount: 95.50, transaction_time: new Date('2025-03-25T19:33:11') },
      { user_id: 9, store_name: 'Cult.fit', amount: 250.25, transaction_time: new Date('2025-03-26T08:45:22') },
      { user_id: 9, store_name: 'Lifestyle', amount: 550.60, transaction_time: new Date('2025-03-27T16:11:33') },
      { user_id: 10, store_name: 'Myntra', amount: 750.75, transaction_time: new Date('2025-03-23T13:22:44') },
      { user_id: 10, store_name: 'Zara', amount: 680.25, transaction_time: new Date('2025-03-24T16:33:11') },
      { user_id: 10, store_name: 'PVR Cinemas', amount: 450.00, transaction_time: new Date('2025-03-25T18:45:33') },
      { user_id: 10, store_name: 'Food Panda', amount: 125.50, transaction_time: new Date('2025-03-26T20:11:22') },
      { user_id: 10, store_name: 'Reliance Digital', amount: 890.40, transaction_time: new Date('2025-03-27T11:33:45') }
    ];

    // Map the SQL numeric user_ids to MongoDB ObjectIds
    const invoicesWithObjectIds = invoiceData.map(invoice => ({
      user_id: userIdMap[invoice.user_id],
      store_name: invoice.store_name,
      amount: invoice.amount,
      transaction_time: invoice.transaction_time
    }));

    // Filter out any entries with undefined user_id
    const validInvoices = invoicesWithObjectIds.filter(invoice => invoice.user_id);
    
    if (validInvoices.length !== invoicesWithObjectIds.length) {
      console.warn(`Warning: ${invoicesWithObjectIds.length - validInvoices.length} invoice(s) have users not found in the database`);
      
      // Log the missing user IDs
      const missingUserIds = invoiceData
        .filter(invoice => !userIdMap[invoice.user_id])
        .map(invoice => invoice.user_id);
      console.log('Missing user IDs:', [...new Set(missingUserIds)]);
    }

    // Insert invoices
    const result = await Invoice.insertMany(validInvoices);
    console.log('Invoices inserted successfully:', result.length);
  } catch (error) {
    console.error('Error inserting invoices:', error);
  } finally {
    // Close the connection after operation completes
    mongoose.connection.close()
      .then(() => console.log('MongoDB connection closed'))
      .catch(err => console.error('Error closing MongoDB connection:', err));
  }
};

// Run the insertion
insertInvoices();