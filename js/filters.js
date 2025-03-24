const filterTransactions = (transactions, filters) => {
  return transactions.filter(transaction => {
    const matchesCategory = !filters.category || transaction.category === filters.category;
    const matchesSearch = !filters.search || 
      transaction.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchesType = !filters.type || 
      (filters.type === 'income' ? transaction.amount > 0 : transaction.amount < 0);
    
    return matchesCategory && matchesSearch && matchesType;
  });
};

const applyFilters = () => {
  const categoryFilter = document.querySelector('#filter-category').value;
  const searchFilter = document.querySelector('#filter-search').value;
  const typeFilter = document.querySelector('#filter-type').value;

  const filteredTransactions = filterTransactions(transactions, {
    category: categoryFilter,
    search: searchFilter,
    type: typeFilter
  });

  transactionUl.innerHTML = '';
  filteredTransactions.forEach(addTransactionIntoDOM);
};
