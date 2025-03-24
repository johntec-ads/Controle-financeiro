let myChart = null; // Variável global para armazenar a instância do gráfico

const updateCharts = () => {
  const ctx = document.getElementById('expenseChart').getContext('2d');
  
  // Destruir o gráfico existente se houver
  if (myChart) {
    myChart.destroy();
  }
  
  // Agrupa transações por categoria
  const categoryData = transactions.reduce((acc, transaction) => {
    if (!acc[transaction.category]) {
      acc[transaction.category] = 0;
    }
    acc[transaction.category] += Math.abs(transaction.amount);
    return acc;
  }, {});

  // Criar novo gráfico e armazenar a referência
  myChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(categoryData),
      datasets: [{
        data: Object.values(categoryData),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Distribuição de Gastos por Categoria'
        }
      }
    }
  });
};
