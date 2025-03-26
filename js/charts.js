let myChart = null; // Variável global para armazenar a instância do gráfico

const updateCharts = () => {
  const ctx = document.getElementById('expenseChart').getContext('2d');
  
  // Destruir o gráfico existente se houver
  if (myChart) {
    myChart.destroy();
  }
  
  // Separar dados por tipo (receita/despesa) e categoria
  const chartData = transactions.reduce((acc, transaction) => {
    const type = transaction.amount >= 0 ? 'receitas' : 'despesas';
    const key = `${type}_${transaction.category}`;
    
    if (!acc[key]) {
      acc[key] = 0;
    }
    acc[key] += Math.abs(transaction.amount);
    return acc;
  }, {});

  // Preparar dados para o gráfico
  const labels = Object.keys(chartData).map(key => {
    const [type, category] = key.split('_');
    return `${category} (${type})`;
  });

  // Definir cores: tons de azul para receitas, outras cores para despesas
  const colors = Object.keys(chartData).map(key => {
    const isReceita = key.startsWith('receitas');
    if (isReceita) {
      return '#2E75CC'; // Azul para todas as receitas
    } else {
      // Array de cores para despesas
      const despesaColors = [
        '#FF6384', // vermelho
        '#FFCE56', // amarelo
        '#4BC0C0', // verde água
        '#9966FF', // roxo
        '#FF9F40', // laranja
        '#e74c3c'  // vermelho escuro
      ];
      // Usar uma cor diferente para cada despesa
      return despesaColors[Math.floor(Math.random() * despesaColors.length)];
    }
  });

  // Criar novo gráfico e armazenar a referência
  myChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: Object.values(chartData),
        backgroundColor: colors,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Distribuição de Receitas e Despesas',
          font: { size: 16 },
          color: '#ffffff'
        },
        legend: {
          position: 'bottom',
          labels: { 
            boxWidth: 12,
            padding: 10,
            color: '#ffffff'
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const value = context.raw;
              return `R$ ${value.toFixed(2)}`;
            }
          }
        }
      },
      scales: {
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#ffffff'
          }
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#ffffff'
          }
        }
      }
    }
  });
};
