"use strict";

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// Function for displaying movements
const displayMovements = (movements) => {
  containerMovements.innerHTML = '';
  movements.forEach((mov, i) => {
    const type = mov > 0 ? "DEPOSIT " : "WITHDRAWAL";
    const html = `
        <div class="movements__row">
        <div class="movements__type movements__type--${type.toLocaleLowerCase()}">${i + 1} ${type}</div>
        <div class="movements__value">${mov}€</div>
        </div>
      `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Calculate balance and then display
const calcDisplayBalance = (acc) => {
  acc.balance = acc.movements.reduce((acc, mov) => {
    return acc + mov;
  }, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

// Compute user name and then add username property to the object
const createUserNames = (accs) => {
  accs.forEach((acc) => {
    acc.username = acc.owner
    .toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join('');
  });
};

// Compute deposits, withdrawals and interest summary
const calcDisplaySummary = (acc) => {
  // Computes deposit summary
  const incomes = acc.movements
  .filter(movement => movement > 0)
  .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  // Compute withdrawals summary
  const outs = acc.movements
  .filter(movement => movement < 0)
  .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outs)}€`;

  // Compute interest summary
  const interest = acc.movements
  .filter(movement => movement > 0)
  .map(deposit => deposit * acc.interestRate / 100)
  .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const updateUI = (acc) => {
  //Display movements
  displayMovements(acc.movements);
  
  //Display balance
  calcDisplayBalance(acc);
    
  //Display movements
  calcDisplaySummary(acc);
};

createUserNames(accounts);

let currentAccount;

// Event handlers function for logging in the user
btnLogin.addEventListener('click', (event) => {
  event.preventDefault();
  currentAccount = accounts.find((acc) => {
    return acc.username === inputLoginUsername.value.trim();
  });
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and welcome message for
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
  }
  containerApp.style.opacity = 100;

  //Clear inputs
  inputLoginUsername.value = inputLoginPin.value = '';

  //Lose focus
  inputLoginPin.blur();

  updateUI(currentAccount);
});

// Event handlers function for transfering money to a user
btnTransfer.addEventListener('click', (event) => {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find((acc) => {
    return acc.username === inputTransferTo.value;
  });
  //Clear inputs
  inputTransferTo.value = inputTransferAmount.value = '';

  //Lose focus
  inputTransferAmount.blur();

  if (amount > 0 && receiverAcc && currentAccount.balance >= amount && currentAccount.username !== receiverAcc?.username) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);
  }
});

// Event handlers function for closing a account
btnClose.addEventListener('click', (event) => {
  event.preventDefault();
});