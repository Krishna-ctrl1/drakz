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
  author_name: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  },
  liked_by: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  disliked_by: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    username: {
      type: String,
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

module.exports = mongoose.model('Blog', BlogSchema);