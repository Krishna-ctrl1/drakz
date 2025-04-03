const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB Connection with explicit database name
const dbURI = process.env.MONGODB_ATLAS_URI || 'mongodb://localhost:27017/DRAKZ';

mongoose.connect(dbURI, {})
  .then(() => console.log('Connected to DRAKZ database'))
  .catch(err => console.error('MongoDB connection error:', err));

// Contact Messages Schema
const contactMessagesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  submission_date: {
    type: Date,
    required: true
  },
  is_read: {
    type: Boolean,
    default: false
  },
  is_replied: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Create Contact Messages Model - specify the collection name explicitly
const ContactMessages = mongoose.model('ContactMessages', contactMessagesSchema, 'contact_messages');

// Insertion Function
const insertContactMessages = async () => {
  try {
    // Current date for submission_date
    const now = new Date();
    
    // Data from SQL insert statements
    const contactMessagesData = [
      {
        name: 'Krishna Gpt',
        email: 'krishna.gpt607@gmail.com',
        phone: '+911234567891',
        subject: 'Query about account',
        message: 'I have a question regarding my account balance.',
        submission_date: now
      },
      {
        name: 'Zulqarnain Ahmed',
        email: 'zulqar.ahmed.12@gmail.com',
        phone: '+911234567893',
        subject: 'Issue with transaction',
        message: 'I noticed an incorrect transaction on my statement.',
        submission_date: now
      }
    ];

    // Insert contact messages
    const result = await ContactMessages.insertMany(contactMessagesData);
    console.log('Contact messages inserted successfully:', result.length);
    
  } catch (error) {
    console.error('Error inserting contact messages:', error);
  } finally {
    // Close the connection after operation completes
    mongoose.connection.close()
      .then(() => console.log('MongoDB connection closed'))
      .catch(err => console.error('Error closing MongoDB connection:', err));
  }
};

// Run the insertion
insertContactMessages();