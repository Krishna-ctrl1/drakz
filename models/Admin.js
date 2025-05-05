// First, define the Admin schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Admin schema
const adminSchema = new Schema({
  name: String,
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

// Create the Admin model
const Admin = mongoose.model('admins', adminSchema);

module.exports = Admin;