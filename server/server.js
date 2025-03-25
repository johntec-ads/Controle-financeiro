const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Transaction = require('./db');
const User = require('./models/User');

const app = express();
app.use(cors({
  origin: '*', // Em produção, especifique o domínio correto
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));
app.use(express.json());

// Rota de registro
app.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = jwt.sign({ userId: user._id }, 'secret_key');
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rota de login
app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.senha, user.senha))) {
      throw new Error('Credenciais inválidas');
    }
    const token = jwt.sign({ userId: user._id }, 'secret_key');
    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Middleware de autenticação
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'secret_key');
    const user = await User.findOne({ _id: decoded.userId });
    if (!user) throw new Error();
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Por favor, faça login.' });
  }
};

// Buscar transações
app.get('/transactions', auth, async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id }).sort('-date');
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
