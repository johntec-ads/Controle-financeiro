# Controle-financeiro
Aplicação para controle de despesas

const getExpense = transactionsAmounts => Math.abs(transactionsAmounts
	.filter((value) => value < 0)
	.reduce((accumulator, transaction) => accumulator + transaction, 0))
	.toFixed(2);
	
const getIncome = transactionsAmounts => transactionsAmounts
	.filter(value => value > 0)
	.reduce((accumulator, transaction) => accumulator + transaction, 0)
	.toFixed(2);

const getTotal = transactionsAmounts => transactionsAmounts
	.reduce((accumulator, transaction) => accumulator + transaction, 0)
	.toFixed(2);

const convertNumberToReal = number => {
	console.log(number.toFixed(0).split('.')[0].split(/(?=(?:...)*$)/).join('.'))
	let newNumber = `${number.toFixed(0).split('.')[0].split(/(?=(?:...)*$)/)
	.join('.')},${number.toFixed(2).split('.')[1]}`
	console.log(newNumber)
	return newNumber
}



const updateBalanceValues = () =>{
	const transactionsAmounts = transactions.map(({ amount }) => amount);
	
	const total = convertNumberToReal( Number( getTotal(transactionsAmounts) ) );
	
	const income = convertNumberToReal( Number( getIncome(transactionsAmounts) ) );
	
	const expense = convertNumberToReal( Number( getExpense(transactionsAmounts) ) );

	incomeDisplay.innerText = `R$ ${income}`;
	expenseDisplay.innerText = `- R$ ${expense}`;
	balanceDisplay.innerText = `R$ ${total}`;
}

