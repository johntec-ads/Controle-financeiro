const API_URL = 'http://localhost:3000';

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
      const response = await fetch(`${API_URL}/transactions`, {
        headers: getHeaders()
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao buscar transações');
      }
      
      return response.json();
    } catch (error) {
      console.error('Erro:', error);
      if (error.message.includes('Token')) {
        window.location.href = 'login.html';
      }
      throw error;
    }
  },

  async addTransaction(transaction) {
    try {
      const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(transaction)
      });
      if (!response.ok) throw new Error('Erro ao adicionar transação');
      return response.json();
    } catch (error) {
      console.error('Erro:', error);
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
