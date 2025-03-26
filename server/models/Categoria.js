const mongoose = require('mongoose');

const CategoriaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    unique: true
  },
  tipo: {
    type: String,
    enum: ['receita', 'despesa', 'ambos'],
    default: 'ambos'
  },
  cor: {
    type: String,
    default: '#000000'
  },
  icone: String,
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Categoria', CategoriaSchema);
