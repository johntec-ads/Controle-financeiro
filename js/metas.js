const API_URL = 'http://localhost:3000';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

const metasApi = {
  async getMetas() {
    const response = await fetch(`${API_URL}/metas`, {
      headers: getHeaders()
    });
    return response.json();
  },

  async addMeta(meta) {
    const response = await fetch(`${API_URL}/metas`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(meta)
    });
    return response.json();
  },

  async updateMeta(id, meta) {
    const response = await fetch(`${API_URL}/metas/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(meta)
    });
    return response.json();
  }
};

const atualizarProgressoMetas = async () => {
  const metas = await metasApi.getMetas();
  const transactions = await api.getTransactions();
  
  const gastosPorCategoria = transactions.reduce((acc, transaction) => {
    if (transaction.amount < 0) {
      if (!acc[transaction.category]) {
        acc[transaction.category] = 0;
      }
      acc[transaction.category] += Math.abs(transaction.amount);
    }
    return acc;
  }, {});

  metas.forEach(meta => {
    const gasto = gastosPorCategoria[meta.categoria] || 0;
    const progresso = (gasto / meta.valor) * 100;
    
    if (progresso >= 90) {
      notificarMetaProximaLimite(meta);
    }
  });
};
