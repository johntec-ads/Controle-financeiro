const transactionUl = document.querySelector('#transactions');//Variável recebe à id da (ul do html)
const incomeDisplay = document.querySelector('#money-plus');
const expenseDisplay = document.querySelector('#money-minus');
const balanceDisplay = document.querySelector('#balance');
const form = document.querySelector('#form');
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')
const inputTransactionCategory = document.querySelector('#category')
const inputTransactionType = document.querySelector('#type')

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
  const operator = amount < 0 ? '-' : '+';//Menor que 0, recebe a string (-),senão (+).   
  const CSSClass = amount < 0 ? 'minus' : 'plus';//String para uma id class:(minus),ou (plus).
  const amountWithoutOperator = Math.abs(amount);
  const li = document.createElement('li');//Criação da linha HTML.
  li.classList.add(CSSClass)//Criando o elemento (li) e adicionando a (CSSClass -> nome da classe).

  /* Setando a marcação interna dentro da (li) com o li.innerHTML */
  li.innerHTML = `
    ${name} 
    <span class="category-tag">${category}</span>
    <span>${operator} R$ ${amountWithoutOperator}</span>
    <button class="delete-btn" onClick="removeTransaction(${id})">x</button>
  `
  transactionUl.append(li);
  /* Metodo append(Argumento)-insere o elemento como último filho.
    Metodo prepend(Argumento)-insere o elemento com primeiro filho */

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



const updateBalanceValues = () => {
  const transactionAmounts = transactions.map(({ amount }) => amount);

  const totalAmount = Number(getTotal(transactionAmounts));
  const total = convertNumberToReal(Math.abs(totalAmount)); // Removendo sinal negativo
  const income = convertNumberToReal(Number(getIncome(transactionAmounts)));
  const expense = convertNumberToReal(Number(getExpenses(transactionAmounts)));

  // Atualizar classe do saldo baseado no valor
  balanceDisplay.classList.remove('positive', 'negative');
  balanceDisplay.classList.add(totalAmount >= 0 ? 'positive' : 'negative');

  // Atualizar valores
  balanceDisplay.innerText = `R$ ${total}`;
  incomeDisplay.innerText = `R$ ${income}`;
  expenseDisplay.innerText = `R$ ${expense}`;
}

/* Função que adiciona as transações no DOM , sempre que a pag for carregada */
const init = () => {
  transactionUl.innerHTML = '';
  transactions.forEach(addTransactionIntoDOM);
  updateBalanceValues();
  if (typeof updateCharts === 'function') { // Adiciona verificação
    updateCharts();
  }
}

init();

const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => (Math.random() * 1000)

const addToTransactionsArray = (transactionName, transactionAmount, transactionCategory, transactionType) => {
  const amount = transactionType === 'expense' ? -Math.abs(transactionAmount) : Math.abs(transactionAmount);
  
  transactions.push({
    id: generateID(),
    name: transactionName,
    amount: Number(amount),
    category: transactionCategory
  })
}

const cleanInputs = () => {
  inputTransactionName.value = ''
  inputTransactionAmount.value = ''
  inputTransactionType.value = 'income' // Reset para receita
}

const handFormSubmit = event => {
  event.preventDefault()

  const transactionName = inputTransactionName.value.trim();
  const transactionAmount = inputTransactionAmount.value.trim();
  const transactionCategory = inputTransactionCategory.value;
  const transactionType = inputTransactionType.value;
  const isSomeInputEmpty = transactionName === '' || transactionAmount === '';

  if (isSomeInputEmpty) {
    alert('Por favor,os campos nomes e valores são obrigatórios.')
    return
  }

  addToTransactionsArray(transactionName, transactionAmount, transactionCategory, transactionType);
  init();

  updateLocalStorage();

  cleanInputs();
}

form.addEventListener('submit', handFormSubmit)
