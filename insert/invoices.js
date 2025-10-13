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
    const startDate = new Date('2025-10-07T00:00:00+05:30'); // IST
    const endDate = new Date('2025-10-13T23:59:59+05:30');   // IST
    const getRandomDate = (start, end) => {
      const timestamp = start.getTime() + Math.random() * (end.getTime() - start.getTime());
      return new Date(timestamp);
    };

    // Store names for variety
    const storeNames = [
      'Apple Store', 'Amazon', 'Flipkart', 'Myntra', 'Swiggy', 'Zomato', 'Uber Eats', 'Food Panda',
      'Big Basket', 'Big Bazaar', 'Reliance Digital', 'Reliance Trends', 'Croma', 'Nike', 'Zara',
      'Ajio', 'Lifestyle', 'Sephora', 'PVR Cinemas', 'BookMyShow', 'Ola Cabs', 'Cult.fit', 'Domino\'s Pizza', 'Starbucks', 'Bose'
    ];

    // Generate invoice data
    const invoiceData = [];
    userEmails.forEach((email, index) => {
      const numInvoices = email === 'xdphantom1202@gmail.com' || email === 'ragamaie.n23@iiits.in' ? 10 : 3;
      for (let i = 0; i < numInvoices; i++) {
        const store_name = storeNames[Math.floor(Math.random() * storeNames.length)];
        const amount = parseFloat((Math.random() * 2450 + 50).toFixed(2)); // ₹50 to ₹2500
        const transaction_time = getRandomDate(startDate, endDate);

        invoiceData.push({
          user_id: index + 1, // Temporary ID for mapping
          store_name,
          amount,
          transaction_time,
          created_at: new Date()
        });
      }
    });

    // Map the temporary user_ids to MongoDB ObjectIds
    const invoicesWithObjectIds = invoiceData.map(invoice => ({
      user_id: userMap[userEmails[invoice.user_id - 1]],
      store_name: invoice.store_name,
      amount: invoice.amount,
      transaction_time: invoice.transaction_time,
      created_at: invoice.created_at
    }));

    // Filter out any entries with undefined user_id
    const validInvoices = invoicesWithObjectIds.filter(invoice => invoice.user_id);
    
    if (validInvoices.length !== invoicesWithObjectIds.length) {
      console.warn(`Warning: ${invoicesWithObjectIds.length - validInvoices.length} invoice(s) have users not found in the database`);
      const missingEmails = userEmails.filter(email => !userMap[email]);
      console.log('Missing user emails:', missingEmails);
    }

    // Clear existing invoices to avoid duplicates (optional, comment out if you want to append)
    await Invoice.deleteMany({ transaction_time: { $gte: startDate, $lte: endDate } });
    console.log('Cleared existing invoices from October 7, 2025, to October 13, 2025');

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