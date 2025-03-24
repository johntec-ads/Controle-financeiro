const API_URL = 'http://localhost:3000';

const api = {
  async getTransactions() {
    const response = await fetch(`${API_URL}/transactions`);
    return response.json();
  },

  async addTransaction(transaction) {
    const response = await fetch(`${API_URL}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction)
    });
    return response.json();
  },

  async deleteTransaction(id) {
    await fetch(`${API_URL}/transactions/${id}`, {
      method: 'DELETE'
    });
  }
};
