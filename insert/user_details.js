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

// User Details Schema
const userDetailsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  postal_code: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Create User Details Model - specify the collection name explicitly
const UserDetails = mongoose.model('UserDetails', userDetailsSchema, 'user_details');

// Insertion Function
const insertUserDetails = async () => {
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

    // Prepare user details data
    const userDetailsData = [
      {
        user_id: userMap['xdphantom1202@gmail.com'],
        phone: '+918420295836',
        country: 'India',
        postal_code: '110001'
      },
      {
        user_id: userMap['ragamaie.n23@iiits.in'],
        phone: '+918765432109',
        country: 'India',
        postal_code: '500032'
      },
      {
        user_id: userMap['abhinay.m23@iiits.in'],
        phone: '+919876543210',
        country: 'India',
        postal_code: '400001'
      },
      {
        user_id: userMap['arjun.patel@gmail.com'],
        phone: '+917890123456',
        country: 'India',
        postal_code: '560001'
      },
      {
        user_id: userMap['priya.sharma@yahoo.com'],
        phone: '+918901234567',
        country: 'India',
        postal_code: '600001'
      },
      {
        user_id: userMap['rohan.khanna@outlook.com'],
        phone: '+919012345678',
        country: 'India',
        postal_code: '700001'
      },
      {
        user_id: userMap['sneha.reddy@hotmail.com'],
        phone: '+918123456789',
        country: 'India',
        postal_code: '302001'
      },
      {
        user_id: userMap['vikram.singh@gmail.com'],
        phone: '+919234567890',
        country: 'India',
        postal_code: '600017'
      },
      {
        user_id: userMap['neha.gupta@yahoo.com'],
        phone: '+917345678901',
        country: 'India',
        postal_code: '110016'
      },
      {
        user_id: userMap['arun.kumar@outlook.com'],
        phone: '+918456789012',
        country: 'India',
        postal_code: '201301'
      }
    ];

    // Filter out any entries with undefined user_id
    const validUserDetails = userDetailsData.filter(detail => detail.user_id);
    
    if (validUserDetails.length !== userDetailsData.length) {
      console.warn(`Warning: ${userDetailsData.length - validUserDetails.length} user(s) not found in the database`);
      console.log('Missing users:', userDetailsData
        .filter(detail => !detail.user_id)
        .map(detail => Object.keys(userMap).find(key => userMap[key] === detail.user_id)));
    }

    // Insert user details
    const result = await UserDetails.insertMany(validUserDetails);
    console.log('User details inserted successfully:', result.length);
  } catch (error) {
    console.error('Error inserting user details:', error);
  } finally {
    // Close the connection after operation completes
    mongoose.connection.close()
      .then(() => console.log('MongoDB connection closed'))
      .catch(err => console.error('Error closing MongoDB connection:', err));
  }
};

// Run the insertion
insertUserDetails();