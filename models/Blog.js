const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  dislikes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true
    },
    created_at: {
      type: Date,
      default: Date.now
    }
  }],
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Create index for efficient searching
BlogSchema.index({ title: 'text', content: 'text' });

// Ensure unique user likes/dislikes (optional, enforced in application logic)
BlogSchema.index({ 'likes': 1 }, { sparse: true });
BlogSchema.index({ 'dislikes': 1 }, { sparse: true });

module.exports = mongoose.model('Blog', BlogSchema);