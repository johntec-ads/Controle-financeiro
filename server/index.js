const express = require('express');
const cors = require('cors');
require('./db');

const app = express();
const transactionRoutes = require('./routes/transactions');

app.use(cors());
app.use(express.json());
app.use('/api', transactionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
