const API_URL = 'http://localhost:3000';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

const api = {
  async getTransactions() {
    const response = await fetch(`${API_URL}/transactions`, {
      headers: getHeaders()
    });
    return response.json();
  },

  async addTransaction(transaction) {
    const response = await fetch(`${API_URL}/transactions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(transaction)
    });
    return response.json();
  },

  async deleteTransaction(id) {
    await fetch(`${API_URL}/transactions/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
  }
};
