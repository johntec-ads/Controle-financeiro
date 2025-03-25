const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  nome: String,
  email: { type: String, unique: true },
  senha: String,
  metasMensais: [{
    categoria: String,
    valor: Number
  }]
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (this.isModified('senha')) {
    this.senha = await bcrypt.hash(this.senha, 8);
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);
