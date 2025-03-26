const API_URL = 'https://controlecontabil.netlify.app';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token não encontrado');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

const api = {
  async getTransactions() {
    try {
      console.log('Fazendo requisição para buscar transações...');
      const response = await fetch(`${API_URL}/transactions`, {
        headers: getHeaders()
      });
      
      if (response.status === 401) {
        localStorage.clear();
        window.location.href = 'login.html';
        throw new Error('Sessão expirada');
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar transações');
      }

      console.log('Transações recebidas:', data);
      return data;
    } catch (error) {
      console.error('Erro detalhado na API:', error);
      throw error;
    }
  },

  async addTransaction(transaction) {
    try {
      console.log('Preparando envio da transação:', transaction);
      
      // Validar dados antes de enviar
      if (!transaction.name || !transaction.amount || !transaction.category) {
        throw new Error('Dados incompletos');
      }

      const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(transaction)
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Erro na resposta:', data);
        throw new Error(data.error || 'Erro ao adicionar transação');
      }

      console.log('Transação criada com sucesso:', data);
      return data;
    } catch (error) {
      console.error('Erro detalhado:', error);
      throw error;
    }
  },

  async deleteTransaction(id) {
    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Erro ao deletar transação');
    } catch (error) {
      console.error('Erro:', error);
      throw error;
    }
  }
};
