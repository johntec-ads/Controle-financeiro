const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/financas', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const TransactionSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  category: String,
  date: Date,
  type: String
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
