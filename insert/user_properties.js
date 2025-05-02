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

// User Properties Schema
const userPropertiesSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  property_name: {
    type: String,
    required: true
  },
  property_value: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  image_url: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Create User Properties Model - specify the collection name explicitly
const UserProperties = mongoose.model('UserProperties', userPropertiesSchema, 'user_properties');

// Insertion Function
const insertUserProperties = async () => {
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
    const userPropertiesData = [
      { user_id: 1, property_name: 'City Apartment', property_value: 750000.00, location: 'Mumbai, Maharashtra', image_url: '/Users/ziko/Downloads/imgg1.jpeg' },
      { user_id: 1, property_name: 'Weekend Farmhouse', property_value: 1250000.00, location: 'Lonavala, Maharashtra', image_url: '/Users/ziko/Downloads/imgg2.jpeg' },
      { user_id: 1, property_name: 'Investment Flat', property_value: 620000.00, location: 'Pune, Maharashtra', image_url: '/Users/ziko/Downloads/imgg3.jpeg' },
      { user_id: 2, property_name: 'Tech Park Flat', property_value: 1200000.00, location: 'Bangalore, Karnataka', image_url: '/Users/ziko/Downloads/imgg4.jpeg' },
      { user_id: 2, property_name: 'Hill Station Cottage', property_value: 950000.00, location: 'Coorg, Karnataka', image_url: '/Users/ziko/Downloads/imgg5.jpeg' },
      { user_id: 2, property_name: 'Commercial Space', property_value: 1800000.00, location: 'Electronic City, Bangalore', image_url: '/Users/ziko/Downloads/imgg6.jpeg' },
      { user_id: 3, property_name: 'Luxury Villa', property_value: 2500000.00, location: 'Goa', image_url: '/Users/ziko/Downloads/imgg7.jpeg' },
      { user_id: 3, property_name: 'Beach Resort Plot', property_value: 1750000.00, location: 'Panjim, Goa', image_url: '/Users/ziko/Downloads/imgg8.jpeg' },
      { user_id: 3, property_name: 'Warehouse', property_value: 1500000.00, location: 'Verna Industrial Estate, Goa', image_url: '/Users/ziko/Downloads/imgg9.jpeg' },
      { user_id: 4, property_name: 'Mountain Cabin', property_value: 450000.00, location: 'Himachal Pradesh', image_url: 'https://example.com/property10.jpg' },
      { user_id: 4, property_name: 'Suburban Home', property_value: 980000.00, location: 'Chandigarh', image_url: 'https://example.com/property11.jpg' },
      { user_id: 4, property_name: 'Agricultural Land', property_value: 650000.00, location: 'Mohali, Punjab', image_url: 'https://example.com/property12.jpg' },
      { user_id: 5, property_name: 'Downtown Loft', property_value: 1800000.00, location: 'Delhi', image_url: 'https://example.com/property13.jpg' },
      { user_id: 5, property_name: 'Farmhouse', property_value: 2200000.00, location: 'Noida, Uttar Pradesh', image_url: 'https://example.com/property14.jpg' },
      { user_id: 5, property_name: 'Rental Apartment', property_value: 750000.00, location: 'Gurgaon, Haryana', image_url: 'https://example.com/property15.jpg' },
      { user_id: 6, property_name: 'Luxury Penthouse', property_value: 3500000.00, location: 'Mumbai, Maharashtra', image_url: 'https://example.com/property16.jpg' },
      { user_id: 6, property_name: 'Seaside Villa', property_value: 2800000.00, location: 'Alibaug, Maharashtra', image_url: 'https://example.com/property17.jpg' },
      { user_id: 6, property_name: 'Commercial Office', property_value: 2200000.00, location: 'Bandra, Mumbai', image_url: 'https://example.com/property18.jpg' },
      { user_id: 7, property_name: 'Studio Apartment', property_value: 620000.00, location: 'Hyderabad, Telangana', image_url: 'https://example.com/property19.jpg' },
      { user_id: 7, property_name: 'Tech Campus Flat', property_value: 1100000.00, location: 'Hitec City, Hyderabad', image_url: 'https://example.com/property20.jpg' },
      { user_id: 7, property_name: 'Farmland', property_value: 950000.00, location: 'Warangal, Telangana', image_url: 'https://example.com/property21.jpg' },
      { user_id: 8, property_name: 'Golf Course Residence', property_value: 4500000.00, location: 'Gurugram, Haryana', image_url: 'https://example.com/property22.jpg' },
      { user_id: 8, property_name: 'Investment Property', property_value: 2600000.00, location: 'Faridabad, Haryana', image_url: 'https://example.com/property23.jpg' },
      { user_id: 8, property_name: 'Startup Incubation Space', property_value: 3200000.00, location: 'Noida Sector 62', image_url: 'https://example.com/property24.jpg' },
      { user_id: 9, property_name: 'Traditional Home', property_value: 980000.00, location: 'Lucknow, Uttar Pradesh', image_url: 'https://example.com/property25.jpg' },
      { user_id: 9, property_name: 'Teacher\'s Quarters', property_value: 650000.00, location: 'Allahabad, Uttar Pradesh', image_url: 'https://example.com/property26.jpg' },
      { user_id: 9, property_name: 'Educational Trust Land', property_value: 1250000.00, location: 'Varanasi, Uttar Pradesh', image_url: 'https://example.com/property27.jpg' },
      { user_id: 10, property_name: 'Sales Hub Office', property_value: 2100000.00, location: 'Chennai, Tamil Nadu', image_url: 'https://example.com/property28.jpg' },
      { user_id: 10, property_name: 'Beach Side Condo', property_value: 1750000.00, location: 'Pondicherry', image_url: 'https://example.com/property29.jpg' },
      { user_id: 10, property_name: 'Retirement Home Plot', property_value: 1200000.00, location: 'Coimbatore, Tamil Nadu', image_url: 'https://example.com/property30.jpg' }
    ];

    // Convert SQL IDs to MongoDB ObjectIds
    const mongoUserProperties = userPropertiesData.map(property => ({
      user_id: userMap[property.user_id],
      property_name: property.property_name,
      property_value: property.property_value,
      location: property.location,
      image_url: property.image_url,
      created_at: new Date()
    }));

    // Filter out any entries with undefined user_id
    const validUserProperties = mongoUserProperties.filter(property => property.user_id);
    
    if (validUserProperties.length !== mongoUserProperties.length) {
      console.warn(`Warning: ${mongoUserProperties.length - validUserProperties.length} property entries have users not found in the database`);
      const missingUserIds = userPropertiesData
        .filter(property => !userMap[property.user_id])
        .map(property => property.user_id);
      console.log('Missing user IDs:', [...new Set(missingUserIds)]);
    }

    // Insert user properties
    const result = await UserProperties.insertMany(validUserProperties);
    console.log('User properties inserted successfully:', result.length);
    
  } catch (error) {
    console.error('Error inserting user properties:', error);
  } finally {
    // Close the connection after operation completes
    mongoose.connection.close()
      .then(() => console.log('MongoDB connection closed'))
      .catch(err => console.error('Error closing MongoDB connection:', err));
  }
};

// Run the insertion
insertUserProperties();