const transactionUl = document.querySelector('#transactions');//Variável recebe à id da (ul do html)
const incomeDisplay = document.querySelector('#money-plus');
const expenseDisplay = document.querySelector('#money-minus');
const balanceDisplay = document.querySelector('#balance');
const form = document.querySelector('#form');
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')
const inputTransactionCategory = document.querySelector('#category')
const inputTransactionType = document.querySelector('#type')
const inputTransactionDate = document.querySelector('#date')

const modal = document.getElementById('categoryModal');
const categoryManagerModal = document.getElementById('categoryManagerModal');
const addCategoryBtn = document.getElementById('add-category');

// Array para armazenar categorias
let categories = JSON.parse(localStorage.getItem('categories')) || [
  'alimentacao', 'transporte', 'moradia', 'lazer', 'saude', 'outros'
];

// Função para abrir modal
const openModal = () => {
  modal.style.display = 'block';
}

// Função para fechar modal
const closeModal = () => {
  modal.style.display = 'none';
  document.getElementById('newCategory').value = '';
}

// Função para salvar nova categoria
const saveNewCategory = () => {
  const newCategory = document.getElementById('newCategory').value.trim();
  if (newCategory) {
    categories.push(newCategory);
    localStorage.setItem('categories', JSON.stringify(categories));
    updateCategorySelects();
    closeModal();
  }
}

// Função para atualizar os selects de categoria
const updateCategorySelects = () => {
  const selects = [
    document.getElementById('category'),
    document.getElementById('filter-category')
  ];
  selects.forEach(select => {
    const currentValue = select.value;
    select.innerHTML = '<option value="">Todas</option>';
    categories.forEach(category => {
      select.innerHTML += `<option value="${category}">${category}</option>`;
    });
    select.value = currentValue;
  });
}

// Adicionar evento ao botão de nova categoria
addCategoryBtn.addEventListener('click', openModal);

// Inicializar os selects de categoria
updateCategorySelects();

//API salva os dados no local storage.
const localStorageTransactions = JSON.parse(localStorage
  .getItem('transactions'))
let transactions = localStorage
  .getItem('transactions') !== null ? localStorageTransactions : []

const removeTransaction = ID => {
  transactions = transactions.filter(transaction =>
    transaction.id !== ID)
  updateLocalStorage()
  init()
}


//Adicionar as transações do DOM.
const addTransactionIntoDOM = ({ amount, name, id, category }) => {
  const CSSClass = amount < 0 ? 'minus' : 'plus';
  const amountFormatted = formatarParaReal(Math.abs(amount));
  const li = document.createElement('li');
  li.classList.add(CSSClass);

  li.innerHTML = `
    ${name} 
    <span class="category-tag">${category}</span>
    <span>${amountFormatted}</span>
    <button class="delete-btn" onClick="removeTransaction(${id})">x</button>
  `
  transactionUl.append(li);
}

const getExpenses = transactionAmounts => Math.abs
  (transactionAmounts
    .filter(value => value < 0)
    .reduce((accumulator, value) => accumulator
      + value, 0))
  .toFixed(2);

const getIncome = transactionAmounts =>
  transactionAmounts
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator
      + value, 0)
    .toFixed(2);

const getTotal = transactionAmounts =>
  transactionAmounts
    .reduce((accumulator, transaction) => accumulator
      + transaction, 0)
    .toFixed(2);


/* Mudança no código, sugerido por seguidor do youtube */
const convertNumberToReal = number => {
  console.log(number.toFixed(0).split('.')[0].split(/(?=(?:...)*$)/).join('.'))
  let newNumber = `${number.toFixed(0).split('.')[0].split(/(?=(?:...)*$)/)
    .join('.')},${number.toFixed(2).split('.')[1]}`
  console.log(newNumber)
  return newNumber
}

// Refatorando a função de conversão para Real
const formatarParaReal = (valor) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

// Refatorando funções de cálculo
const calcularDespesas = transacoes => {
  return Math.abs(transacoes
    .filter(valor => valor < 0)
    .reduce((total, valor) => total + valor, 0));
}

const calcularReceitas = transacoes => {
  return transacoes
    .filter(valor => valor > 0)
    .reduce((total, valor) => total + valor, 0);
}

const calcularSaldoTotal = transacoes => {
  return transacoes.reduce((total, valor) => total + valor, 0);
}

const updateBalanceValues = () => {
  const transactionAmounts = transactions.map(({ amount }) => amount);

  const totalAmount = calcularSaldoTotal(transactionAmounts);
  const receitas = calcularReceitas(transactionAmounts);
  const despesas = calcularDespesas(transactionAmounts);

  balanceDisplay.classList.remove('positive', 'negative');
  balanceDisplay.classList.add(totalAmount >= 0 ? 'positive' : 'negative');

  balanceDisplay.innerText = formatarParaReal(Math.abs(totalAmount));
  incomeDisplay.innerText = formatarParaReal(receitas);
  expenseDisplay.innerText = formatarParaReal(despesas);
}

/* Função que adiciona as transações no DOM , sempre que a pag for carregada */
const init = async () => {
  try {
    transactions = await api.getTransactions();
    transactionUl.innerHTML = '';
    
    const receitas = transactions.filter(t => t.amount >= 0)
      .sort((a, b) => b.amount - a.amount);
    
    const despesas = transactions.filter(t => t.amount < 0)
      .sort((a, b) => a.amount - b.amount);

    receitas.forEach(addTransactionIntoDOM);
    despesas.forEach(addTransactionIntoDOM);
    
    updateBalanceValues();
    updateCharts();
  } catch (error) {
    console.error('Erro ao carregar transações:', error);
  }
}

init();

const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => (Math.random() * 1000)

const addToTransactionsArray = (transactionName, transactionAmount, transactionCategory, transactionType, transactionDate) => {
  const amount = transactionType === 'expense' ? -Math.abs(transactionAmount) : Math.abs(transactionAmount);
  
  transactions.push({
    id: generateID(),
    name: transactionName,
    amount: Number(amount),
    category: transactionCategory,
    date: transactionDate || new Date().toISOString().split('T')[0]
  })
}

const cleanInputs = () => {
  inputTransactionName.value = ''
  inputTransactionAmount.value = ''
  inputTransactionType.value = 'income'
  inputTransactionDate.value = ''
}

const handFormSubmit = event => {
  event.preventDefault()

  const transactionName = inputTransactionName.value.trim();
  const transactionAmount = inputTransactionAmount.value.trim();
  const transactionCategory = inputTransactionCategory.value;
  const transactionType = inputTransactionType.value;
  const transactionDate = inputTransactionDate.value;
  const isSomeInputEmpty = transactionName === '' || transactionAmount === '';

  if (isSomeInputEmpty) {
    alert('Por favor,os campos nomes e valores são obrigatórios.')
    return
  }

  addToTransactionsArray(transactionName, transactionAmount, transactionCategory, transactionType, transactionDate);
  init();

  updateLocalStorage();

  cleanInputs();
}

form.addEventListener('submit', handFormSubmit)

// Funções de gerenciamento de categorias
const openCategoryManager = () => {
  const categoriesList = document.getElementById('categories-list');
  categoriesList.innerHTML = '';
  
  categories.forEach(category => {
    const div = document.createElement('div');
    div.className = `category-item ${category === 'outros' ? 'protected' : ''}`;
    div.innerHTML = `
      ${category}
      ${category !== 'outros' ? 
        `<button onclick="deleteCategory('${category}')">&times;</button>` 
        : ''}
    `;
    categoriesList.appendChild(div);
  });
  
  categoryManagerModal.style.display = 'block';
}

const closeCategoryManager = () => {
  categoryManagerModal.style.display = 'none';
}

const deleteCategory = (category) => {
  if (confirm(`Deseja realmente deletar a categoria "${category}"?`)) {
    const hasTransactions = transactions.some(t => t.category === category);
    
    if (hasTransactions) {
      alert('Não é possível deletar uma categoria que possui transações.');
      return;
    }

    categories = categories.filter(c => c !== category);
    localStorage.setItem('categories', JSON.stringify(categories));
    updateCategorySelects();
    openCategoryManager(); // Atualiza a lista de categorias
  }
}