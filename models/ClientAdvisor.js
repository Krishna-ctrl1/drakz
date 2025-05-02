// Define Mongoose schemas and models first
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Client-Advisor Relationship Schema
const ClientAdvisorSchema = new Schema({
  advisor_id: { type: Schema.Types.ObjectId, ref: 'Advisor' },
  user_id: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  collection: 'client_advisors'
});

// Create models
const ClientAdvisor = mongoose.model('ClientAdvisor', ClientAdvisorSchema);

module.exports = ClientAdvisor;