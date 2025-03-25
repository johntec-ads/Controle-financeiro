const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const config = require('../config');

const client = new MongoClient(config.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectDB() {
  try {
    await client.connect();
    console.log("Conectado ao MongoDB Atlas com sucesso!");

    // Configurar mongoose com a mesma conexão
    await mongoose.connect(config.MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }
}

connectDB();

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
