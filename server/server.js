const express = require('express');
const cors = require('cors');
const Transaction = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Buscar transações
app.get('/transactions', async (req, res) => {
  const transactions = await Transaction.find().sort('-date');
  res.json(transactions);
});

// Adicionar transação
app.post('/transactions', async (req, res) => {
  const transaction = new Transaction(req.body);
  await transaction.save();
  res.json(transaction);
});

// Deletar transação
app.delete('/transactions/:id', async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ message: 'Transação deletada' });
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
