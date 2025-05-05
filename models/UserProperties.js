const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the UserProperty schema
const userPropertySchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  property_name: {
    type: String,
    required: true
  },
  property_value: {
    type: Number,
    default: null
  },
  location: {
    type: String,
    default: null
  },
  image_url: {
    type: String,
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
    collection: 'user_properties'
  });

// Create a compound index for user_id and property_name to ensure uniqueness per user
userPropertySchema.index({ user_id: 1, property_name: 1 }, { unique: true });

// Create the UserProperty model
const UserProperty = mongoose.model('user_properties', userPropertySchema);

module.exports = UserProperty;