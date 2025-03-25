const mongoose = require('mongoose');

// String de conexão correta para MongoDB Atlas
const MONGODB_URI = 'mongodb+srv://johntecads:V3o09qjDHMYHJ3mo@financeiro.mpg04.mongodb.net/financeiro?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conectado ao MongoDB Atlas com sucesso!');
}).catch((error) => {
  console.error('Erro ao conectar ao MongoDB:', error.message);
});

const TransactionSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  category: String,
  date: Date,
  type: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
