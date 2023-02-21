const transactionUl = document.querySelector('#transactions');
const incomeDisplay = document.querySelector('#money-plus');
const expenseDisplay = document.querySelector('#money-minus');
const balanceDisplay = document.querySelector('#balance');
const form = document.querySelector('#form');
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')

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
const addTransactionIntoDOM = ({ amount, name, id }) => {
  const operator = amount < 0 ? '-' : '+'
  const CSSClass = amount < 0 ? 'minus' : 'plus'
  const amountWithoutOperator = Math.abs(amount);
  const li = document.createElement('li');

  li.classList.add(CSSClass)
  li.innerHTML = `
  ${name} <span>${operator} R$ ${amountWithoutOperator}</span>
   <button class="delete-btn" onClick="removeTransaction(${id})">x</button>
  `
  transactionUl.append(li);

}

const getExpenses = transactionAmounts => Math.abs(transactionAmounts
  .filter(value => value < 0)
  .reduce((accumulator, value) => accumulator + value, 0))
  .toFixed(2);

const getIncome = transactionAmounts => transactionAmounts
  .filter(value => value > 0)
  .reduce((accumulator, value) => accumulator + value, 0)
  .toFixed(2);

const getTotal = transactionAmounts => transactionAmounts
  .reduce((accumulator, transaction) => accumulator + transaction, 0)
  .toFixed(2);


const updateBalanceValues = () => {
  const transactionAmounts = transactions.map(({amount}) => amount);
  
  const total = getTotal(transactionAmounts);
  const income = getIncome(transactionAmounts);
  const expense = getExpenses(transactionAmounts);

  balanceDisplay.textContent = `R$ ${total}`;
  incomeDisplay.textContent = `R$ ${income}`;
  expenseDisplay.textContent = `R$ ${expense}`;


}

const init = () => {
  transactionUl.innerHTML = '';
  transactions.forEach(addTransactionIntoDOM);
  updateBalanceValues();
}

init();

const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => Math.round(Math.random() * 1000)

const addToTransactionsArray = (transactionName, transactionAmount) => {
  transactions.push({
    id: generateID(),
    name: transactionName,
    amount: Number(transactionAmount)
  })
}

const cleanInputs = () => {
  inputTransactionName.value = ''
  inputTransactionAmount.value = ''
}

const handFormSubmit = event => {
  event.preventDefault()

  const transactionName = inputTransactionName.value.trim();
  const transactionAmount = inputTransactionAmount.value.trim();
  const isSomeInputEmpty = transactionName === '' || transactionAmount === '';

  if (isSomeInputEmpty) {
    alert('Por favor,os campos nomes e valores são obrigatórios.')
    return
  }

  addToTransactionsArray(transactionName, transactionAmount);
  init();
  updateLocalStorage();

  cleanInputs();
}

form.addEventListener('submit', handFormSubmit)
