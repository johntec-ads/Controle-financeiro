const transactionUl = document.querySelector('#transactions');//Variável recebe à id da (ul do html)
const incomeDisplay = document.querySelector('#money-plus');
const expenseDisplay = document.querySelector('#money-minus');
const balanceDisplay = document.querySelector('#balance');
const form = document.querySelector('#form');
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')

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
const addTransactionIntoDOM = ({ amount, name, id }) => {
  const operator = amount < 0 ? '-' : '+';//Menor que 0, recebe a string (-),senão (+).   
  const CSSClass = amount < 0 ? 'minus' : 'plus';//String para uma id class:(minus),ou (plus).
  const amountWithoutOperator = Math.abs(amount);
  const li = document.createElement('li');//Criação da linha HTML.
  li.classList.add(CSSClass)//Criando o elemento (li) e adicionando a (CSSClass -> nome da classe).

  /* Setando a marcação interna dentro da (li) com o li.innerHTML */
  li.innerHTML = `
  ${name} <span>${operator} R$ ${amountWithoutOperator}</span>
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
  const transactionAmounts = transactions.map(({ amount }) =>
    amount);

  /* Mudança no código */
  //Original
  /* const total = getTotal(transactionAmounts); */

  /* Alterado */


  const total = convertNumberToReal(Number(getTotal
    (transactionAmounts)));

  const income = convertNumberToReal(Number(getIncome(transactionAmounts)));

  const expense = convertNumberToReal(Number(getExpenses(transactionAmounts)));



  incomeDisplay.innerText = `R$ ${income}`;
	expenseDisplay.innerText = `- R$ ${expense}`;
	balanceDisplay.innerText = `R$ ${total}`;


}
/* Função que adiciona as transações no DOM , sempre que a pag for carregada */
const init = () => {
  transactionUl.innerHTML = '';
  transactions.forEach(addTransactionIntoDOM);
  updateBalanceValues();
}

init();

const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => (Math.random() * 1000)

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
