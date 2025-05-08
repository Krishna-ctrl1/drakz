const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogInteractionSchema = new Schema({
  blog_id: {
    type: Schema.Types.ObjectId,
    ref: 'Blog',
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
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

// Creating a compound index to ensure uniqueness of blog_id and user_id combination
BlogInteractionSchema.index({ blog_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model('BlogInteraction', BlogInteractionSchema);