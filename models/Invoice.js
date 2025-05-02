const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InvoiceSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  store_name: String,
  amount: Number,
  transaction_time: Date
}, {
  collection: 'invoices'
});

// Create models
const Invoice = mongoose.model('Invoice', InvoiceSchema);

module.exports = Invoice;