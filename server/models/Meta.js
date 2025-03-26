const mongoose = require('mongoose');

const MetaSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  categoria: {
    type: String,
    required: true
  },
  valorMeta: {
    type: Number,
    required: true
  },
  dataInicio: Date,
  dataFim: Date,
  notificarQuandoProximo: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Meta', MetaSchema);
