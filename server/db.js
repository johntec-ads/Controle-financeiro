const mongoose = require('mongoose');
const config = require('./config'); // Ajustando o caminho

// Opções de conexão
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Conexão com MongoDB
mongoose.connect(config.MONGODB_URI, options);

// Eventos de conexão
const db = mongoose.connection;

db.on('error', (error) => {
  console.error('Erro na conexão com MongoDB:', error);
});

db.on('connected', () => {
  console.log('MongoDB conectado com sucesso!');
});

db.on('disconnected', () => {
  console.log('MongoDB desconectado');
});

db.on('reconnected', () => {
  console.log('MongoDB reconectado');
});

const TransactionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome é obrigatório']
  },
  amount: {
    type: Number,
    required: [true, 'Valor é obrigatório']
  },
  category: {
    type: String,
    required: [true, 'Categoria é obrigatória']
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = {
  connection: db,
  Transaction
};
