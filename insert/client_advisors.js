const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB Connection with explicit database name
const dbURI = process.env.MONGODB_ATLAS_URI || 'mongodb://localhost:27017/DRAKZ';

mongoose.connect(dbURI, {})
  .then(() => console.log('Connected to DRAKZ database'))
  .catch(err => console.error('MongoDB connection error:', err));

// Reference User model structure
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

// Reference Advisor model structure
const advisorSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  number_of_clients: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Create Advisor model
const Advisor = mongoose.model('Advisor', advisorSchema, 'advisors');

// Client Advisors Schema
const clientAdvisorsSchema = new mongoose.Schema({
  advisor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Advisor',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assigned_at: {
    type: Date,
    default: Date.now
  }
});

// Add compound unique index to match SQL UNIQUE constraint
clientAdvisorsSchema.index({ advisor_id: 1, user_id: 1 }, { unique: true });

// Create Client Advisors Model - specify the collection name explicitly
const ClientAdvisors = mongoose.model('ClientAdvisors', clientAdvisorsSchema, 'client_advisors');

// Insertion Function
const insertClientAdvisors = async () => {
  try {
    // Get all users and advisors to reference their ObjectIds
    const users = await User.find().select('_id email');
    const advisors = await Advisor.find().select('_id email');
    
    if (users.length === 0) {
      console.error('No users found in the DRAKZ database');
      return;
    }
    
    if (advisors.length === 0) {
      console.error('No advisors found in the DRAKZ database');
      return;
    }
    
    console.log(`Found ${users.length} users and ${advisors.length} advisors in the database`);

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

    // Map advisor_id from SQL (1, 2) to MongoDB ObjectIds
    const advisorEmails = {
      1: 'ziko120204@gmail.com',
      2: 'krishna.gpt607@gmail.com'
    };
    
    const advisorMap = {};
    for (const [sqlId, email] of Object.entries(advisorEmails)) {
      const advisor = advisors.find(a => a.email === email);
      if (advisor) {
        advisorMap[sqlId] = advisor._id;
      }
    }

    // SQL data converted to MongoDB format
    const clientAdvisorsData = [
      { advisor_id: 1, user_id: 1 },
      { advisor_id: 1, user_id: 2 },
      { advisor_id: 1, user_id: 3 },
      { advisor_id: 1, user_id: 4 },
      { advisor_id: 1, user_id: 5 },
      { advisor_id: 2, user_id: 6 },
      { advisor_id: 2, user_id: 7 },
      { advisor_id: 2, user_id: 8 },
      { advisor_id: 2, user_id: 9 },
      { advisor_id: 2, user_id: 10 }
    ];

    // Convert SQL IDs to MongoDB ObjectIds
    const mongoClientAdvisors = clientAdvisorsData.map(relation => ({
      advisor_id: advisorMap[relation.advisor_id],
      user_id: userMap[relation.user_id],
      assigned_at: new Date()
    }));

    // Filter out any entries with undefined advisor_id or user_id
    const validClientAdvisors = mongoClientAdvisors.filter(relation => 
      relation.advisor_id && relation.user_id
    );
    
    if (validClientAdvisors.length !== mongoClientAdvisors.length) {
      console.warn(`Warning: ${mongoClientAdvisors.length - validClientAdvisors.length} relation(s) have invalid references`);
    }

    // Insert client-advisor relations
    const result = await ClientAdvisors.insertMany(validClientAdvisors);
    console.log('Client-advisor relations inserted successfully:', result.length);
    
  } catch (error) {
    console.error('Error inserting client-advisor relations:', error);
    if (error.code === 11000) {
      console.error('Duplicate key error - some relations may already exist');
    }
  } finally {
    // Close the connection after operation completes
    mongoose.connection.close()
      .then(() => console.log('MongoDB connection closed'))
      .catch(err => console.error('Error closing MongoDB connection:', err));
  }
};

// Run the insertion
insertClientAdvisors();