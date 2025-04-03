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

// User Credit Scores Schema
const userCreditScoreSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  credit_score: {
    type: Number,
    required: true
  },
  report_date: {
    type: Date,
    required: true,
    default: Date.now
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Create User Credit Scores Model - specify the collection name explicitly
const UserCreditScore = mongoose.model('UserCreditScore', userCreditScoreSchema, 'user_credit_scores');

// Insertion Function
const insertUserCreditScores = async () => {
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

    // Current date for report_date
    const currentDate = new Date();

    // Map of user emails to credit scores
    const userCreditData = [
      { email: 'xdphantom1202@gmail.com', score: 750 },
      { email: 'ragamaie.n23@iiits.in', score: 780 },
      { email: 'abhinay.m23@iiits.in', score: 710 },
      { email: 'arjun.patel@gmail.com', score: 720 },
      { email: 'priya.sharma@yahoo.com', score: 790 },
      { email: 'rohan.khanna@outlook.com', score: 735 },
      { email: 'sneha.reddy@hotmail.com', score: 765 },
      { email: 'vikram.singh@gmail.com', score: 800 },
      { email: 'neha.gupta@yahoo.com', score: 740 },
      { email: 'arun.kumar@outlook.com', score: 755 }
    ];

    // Prepare user credit scores data
    const userCreditScoresData = userCreditData.map(data => ({
      user_id: userMap[data.email],
      credit_score: data.score,
      report_date: currentDate
    }));

    // Filter out any entries with undefined user_id
    const validUserCreditScores = userCreditScoresData.filter(score => score.user_id);
    
    if (validUserCreditScores.length !== userCreditScoresData.length) {
      console.warn(`Warning: ${userCreditScoresData.length - validUserCreditScores.length} user(s) not found in the database`);
      const missingEmails = userCreditData
        .filter(data => !userMap[data.email])
        .map(data => data.email);
      console.log('Missing users:', missingEmails);
    }

    // Insert user credit scores
    const result = await UserCreditScore.insertMany(validUserCreditScores);
    console.log('User credit scores inserted successfully:', result.length);
  } catch (error) {
    console.error('Error inserting user credit scores:', error);
  } finally {
    // Close the connection after operation completes
    mongoose.connection.close()
      .then(() => console.log('MongoDB connection closed'))
      .catch(err => console.error('Error closing MongoDB connection:', err));
  }
};

// Run the insertion
insertUserCreditScores();