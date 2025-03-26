const mongoose = require('mongoose');

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
    default: Date.now
  },
  type: {
    type: String,
    required: [true, 'Tipo é obrigatório'],
    enum: ['income', 'expense']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: {
    url: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^(http|https):\/\/.+\.(jpg|jpeg|png|gif)$/i.test(v);
        },
        message: 'URL de imagem inválida'
      }
    },
    filename: String,
    contentType: {
      type: String,
      enum: ['image/jpeg', 'image/png', 'image/gif']
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
