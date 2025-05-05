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

// Reference Blog model structure
const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  likes: Number,
  dislikes: Number,
  comments: mongoose.Schema.Types.Mixed,
  created_at: Date
});

// Create Blog model with existing collection name
const Blog = mongoose.model('Blog', blogSchema, 'blogs');

// Blog Interactions Schema
const blogInteractionSchema = new mongoose.Schema({
  blog_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  interaction_type: {
    type: String,
    enum: ['like', 'dislike'],
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Add a compound index to ensure uniqueness of blog_id and user_id combination
// This replicates the UNIQUE KEY constraint from SQL
blogInteractionSchema.index({ blog_id: 1, user_id: 1 }, { unique: true });

// Create Blog Interactions Model - specify the collection name explicitly
const BlogInteraction = mongoose.model('BlogInteraction', blogInteractionSchema, 'blog_interactions');

console.log('Blog Interactions schema and model created successfully');

// Since no entries are needed, we'll just close the connection
mongoose.connection.close()
  .then(() => console.log('MongoDB connection closed'))
  .catch(err => console.error('Error closing MongoDB connection:', err));