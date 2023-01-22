import { closeModal } from './modules/modal.mjs'

/* events on backend ================================================================================== */
const keyOfDataLocalStorage = 'transactions';
const btnRegisterTransaction = document.querySelector(".btn-add");

/* get all transacts */
const getTransactionsOnLocalStorage = localStorage.getItem(keyOfDataLocalStorage);

/* add new transact in localStorage */
function addTransactionInLocalStorage(data) {
    localStorage.setItem(keyOfDataLocalStorage, data);
}

/* Send new transact to the localStorage */
function sendDataToLocalStorage(obj) {
    if (getTransactionsOnLocalStorage === null) {
        addTransactionInLocalStorage(JSON.stringify([obj]));
    } else {
        addTransactionInLocalStorage(JSON.stringify([...JSON.parse(localStorage.getItem(keyOfDataLocalStorage)), obj]));
    }
}

const getDataForm = () => {
    const natureOfTransaction = document.querySelector("input[name=naturetransaction]:checked").value;
    const typeTransaction = document.getElementById("type-transact").value;
    const descriptionTransaction = document.getElementById("description").value;
    const valueTransaction = document.getElementById("value").value;
    const arr = [natureOfTransaction, typeTransaction, descriptionTransaction, valueTransaction];
    processDataInputs(...arr);
}

/* checks whether or not to send data to localStorage */
function processDataInputs(natureOfTransaction, typeTransaction, descriptionTransaction, valueTransaction) {
    if (!natureOfTransaction || !typeTransaction || !descriptionTransaction || !valueTransaction) {
        showMessageErrorInDOM();
    } else {
        hideMessageErrorInDOM();
        const dataObj = { natureOfTransaction, typeTransaction, descriptionTransaction, valueTransaction }
        sendDataToLocalStorage(dataObj);
        closeModal();
    }
}

/* refresh list of transactions */
const refreshListTransactions = () => {
    const transactionsList = document.querySelector(".transactions-list");
    transactionsList.innerText = '';
    showTransactionsInDOM();
}

/* call of the functions for the add new transacts */
const addNewTransaction = (event) => {
    event.preventDefault();
    getDataForm();
    refreshListTransactions();
}

/* events on html ================================================================================== */
function showMessageErrorInDOM() {
    const element = document.querySelector(".error");
    if (element === null) {
        const fieldSet = document.querySelector(".transact-form");
        const messageElement = document.createElement("p");
        messageElement.innerHTML = `
            <p class="error">
            <img class="exclamation-message-error" src="./assets/img/exclamation.svg" alt="exclamation icon"></img>
            Preenchimento dos campos é obrigatório.
            </p>
        `;
        fieldSet.appendChild(messageElement);
    } else {
        element.classList.remove("hide");
        element.classList.add("show");
    }
}

function hideMessageErrorInDOM() {
    const message = document.querySelector(".error");
    if (message !== null) message.classList.add("hide");
}

/* verify value of Nature of transaction */
const natureTransactionCssClass = (obj) => obj["natureOfTransaction"] === "pay" ? "minus" : "add";

/* add "+" or "-" before each transaction amount */
function addTransactionMeaning() {
    const meaning = document.querySelector(".meaning-transaction");
    const tag = document.querySelector(".tag-nature-transaction");
    const add = document.createTextNode('+');
    const minus = document.createTextNode('-');
    if (tag) {
        tag.classList.contains("minus") ? meaning.appendChild(minus) : meaning.appendChild(add);
        meaning.textContent === "-" ? meaning.classList.add("red") : meaning.classList.add("green");
    }
}

function renderTransactionsInDOM(transaction, CSSClass) {
    const transactionsList = document.querySelector(".transactions-list");
    let transactionHtml = document.createElement("div");
    transactionHtml.innerHTML = `
            <div class="body-text-transaction">
                <p class="type-transaction">${transaction.typeTransaction}</p>
                <p class="description-transaction">${transaction.descriptionTransaction}</p>
            </div>
            <div class="value-transact">
              <span class="meaning-transaction"></span>
              <span>${transaction.valueTransaction}</span>
            </div>
            <div class="tag-nature-transaction"><div>`;
    transactionHtml.classList.add("card-transaction");
    transactionHtml.children[2].classList.add(CSSClass);
    transactionsList.prepend(transactionHtml);
}

// const isNumeric = (value) => {

// }

// function updateInfoFinanceValues(obj, natureTransaction) {
//     const amount = document.getElementById("amount");
//     if (natureTransaction === "minus") {
//         const valueTransacion = Number(obj["valueTransaction"]);

//     }
// }

// function updateAmount() {

// }

// function updateIncomes() {

// }

// function updateExpenses() {

// }

const showTransactionsInDOM = () => {
    if (getTransactionsOnLocalStorage) {
        const arrAllTransactions = JSON.parse(localStorage.getItem(keyOfDataLocalStorage));
        arrAllTransactions.forEach(obj => {
            renderTransactionsInDOM(obj, natureTransactionCssClass(obj));
            addTransactionMeaning();

        });
    }
    return;
}

showTransactionsInDOM();

btnRegisterTransaction.addEventListener('click', addNewTransaction)