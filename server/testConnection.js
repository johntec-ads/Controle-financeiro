const mongoose = require('mongoose');
const config = require('./config');

async function testConnection() {
  try {
    console.log('🔄 Iniciando testes do banco de dados...');
    
    // Teste de conexão
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ Conexão estabelecida');
    
    // Criar modelo de teste
    const Transaction = mongoose.model('Transaction', new mongoose.Schema({
      name: String,
      amount: Number,
      type: String
    }));

    // Teste de criação
    const novaTransacao = await Transaction.create({
      name: 'Teste',
      amount: 100,
      type: 'income'
    });
    console.log('✅ Criação funcionando:', novaTransacao._id);

    // Teste de leitura
    const transacaoEncontrada = await Transaction.findById(novaTransacao._id);
    console.log('✅ Leitura funcionando');

    // Teste de atualização
    await Transaction.updateOne(
      { _id: novaTransacao._id },
      { amount: 150 }
    );
    console.log('✅ Atualização funcionando');

    // Teste de deleção
    await Transaction.deleteOne({ _id: novaTransacao._id });
    console.log('✅ Deleção funcionando');

    console.log('✅ Todos os testes passaram com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔄 Conexão fechada');
  }
}

testConnection();
