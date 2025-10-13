const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const goalSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  goal_name: {
    type: String,
    required: true,
    trim: true
  },
  target_amount: {
    type: Number,
    required: true,
    min: 0
  },
  current_savings: {
    type: Number,
    default: 0,
    min: 0
  },
  target_date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['house', 'car', 'travel', 'education', 'other'],
    default: 'other'
  }
}, {
  timestamps: true,
  collection: 'user_goals'
});

goalSchema.index({ user_id: 1, target_date: -1 });

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;