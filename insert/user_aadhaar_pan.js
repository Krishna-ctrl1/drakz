const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB Connection with explicit database name
const dbURI = process.env.MONGODB_ATLAS_URI || 'mongodb://localhost:27017/DRAKZ';

mongoose.connect(dbURI, {})
  .then(() => console.log('Connected to DRAKZ database'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Aadhaar Pan Schema
const userAadhaarPanSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  aadhaar_number: {
    type: String,
    unique: true
  },
  pan_number: {
    type: String,
    unique: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Create User Aadhaar Pan Model - specify the collection name explicitly
const UserAadhaarPan = mongoose.model('UserAadhaarPan', userAadhaarPanSchema, 'users_aadhaar_pan');

// Insertion Function
const insertUserAadhaarPan = async () => {
  try {
    // Data from SQL insert statements
    const userAadhaarPanData = [
      { email: 'xdphantom1202@gmail.com', aadhaar_number: '998877665544', pan_number: 'SXCVB1234Y' },
      { email: 'ragamaie.n23@iiits.in', aadhaar_number: '334455667788', pan_number: 'RSTUV9012W' },
      { email: 'abhinay.m23@iiits.in', aadhaar_number: '445566778899', pan_number: 'XYZAB3456C' },
      { email: 'arjun.patel@gmail.com', aadhaar_number: '556677889900', pan_number: 'MNOPQ7890Z' },
      { email: 'priya.sharma@yahoo.com', aadhaar_number: '667788990011', pan_number: 'DEFGH5678W' },
      { email: 'rohan.khanna@outlook.com', aadhaar_number: '778899001122', pan_number: 'JKLMN2345X' },
      { email: 'sneha.reddy@hotmail.com', aadhaar_number: '889900112233', pan_number: 'PQRST6789Y' },
      { email: 'vikram.singh@gmail.com', aadhaar_number: '990011223344', pan_number: 'UVWXY4567Z' },
      { email: 'neha.gupta@yahoo.com', aadhaar_number: '112233445566', pan_number: 'BCDEF9012W' },
      { email: 'arun.kumar@outlook.com', aadhaar_number: '223344556677', pan_number: 'GHIJK3456X' }
    ];

    // Add creation timestamp
    const mongoUserAadhaarPan = userAadhaarPanData.map(user => ({
      ...user,
      created_at: new Date()
    }));

    // Check if any records already exist to avoid duplicate key errors
    const existingEmails = await UserAadhaarPan.distinct('email');
    const existingAadhaar = await UserAadhaarPan.distinct('aadhaar_number');
    const existingPan = await UserAadhaarPan.distinct('pan_number');
    
    const filteredUsers = mongoUserAadhaarPan.filter(user => 
      !existingEmails.includes(user.email) && 
      !existingAadhaar.includes(user.aadhaar_number) && 
      !existingPan.includes(user.pan_number)
    );
    
    if (filteredUsers.length < mongoUserAadhaarPan.length) {
      console.warn(`Warning: ${mongoUserAadhaarPan.length - filteredUsers.length} user(s) already exist in the database`);
    }
    
    // Only proceed if there are records to insert
    if (filteredUsers.length > 0) {
      // Insert user aadhaar and pan details
      const result = await UserAadhaarPan.insertMany(filteredUsers);
      console.log('User Aadhaar and PAN details inserted successfully:', result.length);
    } else {
      console.log('No new records to insert');
    }
    
  } catch (error) {
    console.error('Error inserting user aadhaar and pan details:', error);
  } finally {
    // Close the connection after operation completes
    mongoose.connection.close()
      .then(() => console.log('MongoDB connection closed'))
      .catch(err => console.error('Error closing MongoDB connection:', err));
  }
};

// Run the insertion
insertUserAadhaarPan();