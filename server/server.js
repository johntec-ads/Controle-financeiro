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

// Rota de login - Melhorar validação e resposta
app.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ error: 'Email não encontrado' });
    }
    
    const senhaCorreta = await bcrypt.compare(senha, user.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }
    
    const token = jwt.sign({ userId: user._id }, 'secret_key', { expiresIn: '24h' });
    res.json({ 
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email
      }, 
      token 
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Middleware de autenticação - Adicionar log para debug
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    console.log('Token recebido:', token); // Log para debug
    
    const decoded = jwt.verify(token, 'secret_key');
    console.log('Token decodificado:', decoded); // Log para debug
    
    const user = await User.findOne({ _id: decoded.userId });
    console.log('Usuário encontrado:', user); // Log para debug
    
    if (!user) throw new Error();
    
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Erro de autenticação:', error); // Log para debug
    res.status(401).json({ error: 'Por favor, faça login.' });
  }
};

// Rota de transações - Adicionar proteção e associação com usuário
app.get('/transactions', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id });
    res.json(transactions);
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    res.status(500).json({ error: 'Erro ao buscar transações' });
  }
});

app.post('/transactions', auth, async (req, res) => {
  try {
    const transaction = new Transaction({
      ...req.body,
      user: req.user._id
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    res.status(500).json({ error: 'Erro ao criar transação' });
  }
});

// Deletar transação
app.delete('/transactions/:id', async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ message: 'Transação deletada' });
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
