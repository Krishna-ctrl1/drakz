const mongoose = require('mongoose');
const crypto = require('crypto');
require('dotenv').config();

// MongoDB Connection
mongoose.connect(process.env.MONGODB_ATLAS_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Admin Schema
const adminSchema = new mongoose.Schema({
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
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Create Admin Model
const Admin = mongoose.model('Admin', adminSchema);

// Hash function
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Insertion Function
const insertAdmins = async () => {
  try {
    const admins = [
      {
        username: 'admin_deepthi',
        name: 'Deepthi Mullapudi',
        email: 'deepthi.m23@iiits.in',
        password: hashPassword('admin_deepthi')
      },
      {
        username: 'admin_krishna',
        name: 'Krishna Gupta',
        email: 'krishna.g23@iiits.in',
        password: hashPassword('admin_krishna')
      }
    ];

    // Insert admins
    const result = await Admin.insertMany(admins);
    console.log('Admins inserted successfully:', result);
  } catch (error) {
    console.error('Error inserting admins:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
};

// Run the insertion
insertAdmins();