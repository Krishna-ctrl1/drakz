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

// User Precious Holdings Schema
const userPreciousHoldingsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  metal_type: {
    type: String,
    enum: ['gold', 'silver', 'platinum', 'other'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  amount_unit: {
    type: String,
    enum: ['grams', 'kg', 'oz'],
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  date_of_purchase: {
    type: Date,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Create User Precious Holdings Model - specify the collection name explicitly
const UserPreciousHolding = mongoose.model('UserPreciousHolding', userPreciousHoldingsSchema, 'user_precious_holdings');

// Insertion Function
const insertUserPreciousHoldings = async () => {
  try {
    // First, get all users to reference their ObjectIds
    const users = await User.find().select('_id email');
    
    if (users.length === 0) {
      console.error('No users found in the DRAKZ database');
      return;
    }

    console.log(`Found ${users.length} users in the database`);

    // Map SQL user IDs to MongoDB ObjectIds
    // This mapping assumes that users in the SQL database have IDs from 1-10
    // And these correspond to users in MongoDB in the same order as returned by the query
    const userIdMap = {};
    users.slice(0, 10).forEach((user, index) => {
      userIdMap[index + 1] = user._id;
    });

    // Precious metals data from SQL insert statements
    const preciousHoldingsData = [
      { user_id: 1, metal_type: 'gold', amount: 250.5, amount_unit: 'grams', value: 1750000.00, date_of_purchase: new Date('2023-02-15') },
      { user_id: 1, metal_type: 'silver', amount: 5000.0, amount_unit: 'grams', value: 350000.00, date_of_purchase: new Date('2022-11-30') },
      { user_id: 1, metal_type: 'platinum', amount: 75.25, amount_unit: 'grams', value: 2600000.00, date_of_purchase: new Date('2023-09-22') },
      { user_id: 2, metal_type: 'gold', amount: 180.75, amount_unit: 'grams', value: 1260000.00, date_of_purchase: new Date('2023-05-18') },
      { user_id: 2, metal_type: 'silver', amount: 4200.0, amount_unit: 'grams', value: 294000.00, date_of_purchase: new Date('2022-08-25') },
      { user_id: 2, metal_type: 'other', amount: 50.5, amount_unit: 'grams', value: 2200000.00, date_of_purchase: new Date('2024-01-10') },
      { user_id: 3, metal_type: 'gold', amount: 300.25, amount_unit: 'grams', value: 2100000.00, date_of_purchase: new Date('2023-07-22') },
      { user_id: 3, metal_type: 'silver', amount: 6000.0, amount_unit: 'grams', value: 420000.00, date_of_purchase: new Date('2022-12-15') },
      { user_id: 3, metal_type: 'other', amount: 25.0, amount_unit: 'oz', value: 1500000.00, date_of_purchase: new Date('2024-03-05') },
      { user_id: 4, metal_type: 'gold', amount: 500.0, amount_unit: 'grams', value: 3500000.00, date_of_purchase: new Date('2022-05-10') },
      { user_id: 4, metal_type: 'silver', amount: 7500.0, amount_unit: 'grams', value: 525000.00, date_of_purchase: new Date('2023-01-20') },
      { user_id: 4, metal_type: 'platinum', amount: 100.75, amount_unit: 'grams', value: 3500000.00, date_of_purchase: new Date('2023-11-08') },
      { user_id: 5, metal_type: 'other', amount: 75.0, amount_unit: 'oz', value: 1250000.00, date_of_purchase: new Date('2023-09-05') },
      { user_id: 5, metal_type: 'gold', amount: 220.5, amount_unit: 'grams', value: 1540000.00, date_of_purchase: new Date('2023-04-12') },
      { user_id: 5, metal_type: 'silver', amount: 4800.0, amount_unit: 'grams', value: 336000.00, date_of_purchase: new Date('2022-10-15') },
      { user_id: 6, metal_type: 'platinum', amount: 120.5, amount_unit: 'grams', value: 4200000.00, date_of_purchase: new Date('2023-06-30') },
      { user_id: 6, metal_type: 'gold', amount: 275.25, amount_unit: 'grams', value: 1925000.00, date_of_purchase: new Date('2023-01-25') },
      { user_id: 6, metal_type: 'other', amount: 60.75, amount_unit: 'grams', value: 2650000.00, date_of_purchase: new Date('2024-02-14') },
      { user_id: 7, metal_type: 'gold', amount: 150.5, amount_unit: 'grams', value: 1050000.00, date_of_purchase: new Date('2022-09-17') },
      { user_id: 7, metal_type: 'silver', amount: 3500.0, amount_unit: 'grams', value: 245000.00, date_of_purchase: new Date('2023-03-22') },
      { user_id: 7, metal_type: 'other', amount: 40.0, amount_unit: 'oz', value: 800000.00, date_of_purchase: new Date('2023-11-30') },
      { user_id: 8, metal_type: 'gold', amount: 400.75, amount_unit: 'grams', value: 2800000.00, date_of_purchase: new Date('2023-08-05') },
      { user_id: 8, metal_type: 'platinum', amount: 90.25, amount_unit: 'grams', value: 3150000.00, date_of_purchase: new Date('2024-01-15') },
      { user_id: 8, metal_type: 'silver', amount: 6500.0, amount_unit: 'grams', value: 455000.00, date_of_purchase: new Date('2022-07-20') },
      { user_id: 9, metal_type: 'silver', amount: 4000.0, amount_unit: 'grams', value: 280000.00, date_of_purchase: new Date('2023-02-28') },
      { user_id: 9, metal_type: 'gold', amount: 175.5, amount_unit: 'grams', value: 1225000.00, date_of_purchase: new Date('2022-10-10') },
      { user_id: 9, metal_type: 'other', amount: 45.25, amount_unit: 'grams', value: 1980000.00, date_of_purchase: new Date('2023-12-05') },
      { user_id: 10, metal_type: 'gold', amount: 225.25, amount_unit: 'grams', value: 1575000.00, date_of_purchase: new Date('2023-05-30') },
      { user_id: 10, metal_type: 'silver', amount: 5500.0, amount_unit: 'grams', value: 385000.00, date_of_purchase: new Date('2022-12-25') },
      { user_id: 10, metal_type: 'other', amount: 50.0, amount_unit: 'oz', value: 1000000.00, date_of_purchase: new Date('2024-02-20') }
    ];

    // Map SQL user IDs to MongoDB ObjectIds
    const mongoHoldingsData = preciousHoldingsData.map(holding => ({
      user_id: userIdMap[holding.user_id],
      metal_type: holding.metal_type,
      amount: holding.amount,
      amount_unit: holding.amount_unit,
      value: holding.value,
      date_of_purchase: holding.date_of_purchase
    }));

    // Filter out any entries with undefined user_id
    const validHoldingsData = mongoHoldingsData.filter(holding => holding.user_id);
    
    if (validHoldingsData.length !== mongoHoldingsData.length) {
      console.warn(`Warning: ${mongoHoldingsData.length - validHoldingsData.length} holding(s) could not be mapped to valid user_id`);
    }

    // Insert the holdings data
    const result = await UserPreciousHolding.insertMany(validHoldingsData);
    console.log('User precious holdings inserted successfully:', result.length);
  } catch (error) {
    console.error('Error inserting user precious holdings:', error);
  } finally {
    // Close the connection after operation completes
    mongoose.connection.close()
      .then(() => console.log('MongoDB connection closed'))
      .catch(err => console.error('Error closing MongoDB connection:', err));
  }
};

// Run the insertion
insertUserPreciousHoldings();