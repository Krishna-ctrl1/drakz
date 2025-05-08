const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogCommentSchema = new Schema({
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
  text: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('BlogComment', BlogCommentSchema);