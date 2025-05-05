const mongoose = require('mongoose');
const crypto = require('crypto');
require('dotenv').config();

// MongoDB Connection
mongoose.connect(process.env.MONGODB_ATLAS_URI, {});

// Advisor Schema
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

// Create Advisor Model
const Advisor = mongoose.model('Advisor', advisorSchema);

// Hash function
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Insertion Function
const insertAdvisors = async () => {
  try {
    const advisors = [
      {
        username: 'advisor_ziko',
        name: 'Ziko Ahmed',
        email: 'ziko120204@gmail.com',
        password: hashPassword('advisor_ziko'),
        number_of_clients: 3
      },
      {
        username: 'advisor_krishna_gpt',
        name: 'Krishna Gpt',
        email: 'krishna.gpt607@gmail.com',
        password: hashPassword('advisor_krishna'),
        number_of_clients: 3
      }
    ];

    // Insert advisors
    const result = await Advisor.insertMany(advisors);
    console.log('Advisors inserted successfully:', result);
  } catch (error) {
    console.error('Error inserting advisors:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
};

// Run the insertion
insertAdvisors();