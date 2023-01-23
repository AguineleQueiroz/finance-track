import { closeModal } from './modules/modal.mjs'



const keyOfDataLocalStorage = 'transactions';
const btnRegisterTransaction = document.querySelector(".btn-add");

const getTransactionsOnLocalStorage = localStorage.getItem(keyOfDataLocalStorage);

function addTransactionInLocalStorage(data) {
    localStorage.setItem(keyOfDataLocalStorage, data);
}

function sendDataToLocalStorage(obj) {
    if (getTransactionsOnLocalStorage === null) {
        addTransactionInLocalStorage(JSON.stringify([obj]));
    } else {
        addTransactionInLocalStorage(
            JSON.stringify(
                [...JSON.parse(localStorage.getItem(keyOfDataLocalStorage)), obj]
            )
        );
    }
}

function processDataInputs(natureOfTransaction, typeTransaction, descriptionTransaction, valueTransaction) {
    if (!natureOfTransaction ||
        !typeTransaction ||
        !descriptionTransaction ||
        !valueTransaction) {

        showMessageErrorInDOM();

    } else {
        hideMessageErrorInDOM();
        const dataObj = {
            natureOfTransaction,
            typeTransaction,
            descriptionTransaction,
            valueTransaction
        }
        sendDataToLocalStorage(dataObj);
        closeModal();
    }
}
const getDataForm = () => {
    const natureOfTransaction = document.querySelector("input[name=naturetransaction]:checked").value;
    const typeTransaction = document.getElementById("type-transact").value;
    const descriptionTransaction = document.getElementById("description").value;
    const valueTransaction = document.getElementById("value").value.replace(/[^0-9\\.]+/g, '');
    const arr = [natureOfTransaction, typeTransaction, descriptionTransaction, valueTransaction];
    processDataInputs(...arr);
}

function showMessageErrorInDOM() {
    const element = document.querySelector(".error");
    if (element === null) {
        const fieldSet = document.querySelector(".transact-form");
        const messageElement = document.createElement("p");
        messageElement.innerHTML = `
            <p class="error">
            <img class="exclamation-message-error" src="./assets/img/exclamation.svg" alt="exclamation icon"></img>
            Dados inválidos. Verifique e tente novamente.
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

const natureTransactionCssClass = (obj) => obj["natureOfTransaction"] === "pay" ? "minus" : "add";

function addTransactionMeaning() {
    const meaning = document.querySelector(".meaning-transaction");
    const tag = document.querySelector(".tag-nature-transaction");
    const add = document.createTextNode('+');
    const minus = document.createTextNode('-');
    if (tag) {
        tag.classList.contains("minus") ? meaning.appendChild(minus) : meaning.appendChild(add);
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
              <span class="symbol-real">R$</span>
              <span>${transaction.valueTransaction}</span>
            </div>
            <div class="tag-nature-transaction"><div>`;
    transactionHtml.classList.add("card-transaction");
    transactionHtml.children[2].classList.add(CSSClass);
    transactionsList.prepend(transactionHtml);
}

const updateAmountIncomes = (obj) => {
    const incomes = document.getElementById("incomes");
    if (incomes.textContent === '') {
        // const valueTransaction = obj["valueTransaction"] 
    }
}

const updateAmountExpenses = (obj) => {

}

const isPayorReceive = (obj) => obj["natureOfTransaction"];

function updateInfoFinanceValues(obj) {
    isPayorReceive(obj) === "receive" ? updateAmountIncomes() : updateAmountExpenses();
}


const showTransactionsInDOM = () => {
    if (localStorage.getItem(keyOfDataLocalStorage)) {
        const arrAllTransactions = JSON.parse(localStorage.getItem(keyOfDataLocalStorage));
        arrAllTransactions.forEach(obj => {
            renderTransactionsInDOM(obj, natureTransactionCssClass(obj));
            addTransactionMeaning();
            updateInfoFinanceValues(obj);
        });
    }
    return;
}

showTransactionsInDOM();

const refreshListTransactions = () => {
    const transactionsList = document.querySelector(".transactions-list");
    transactionsList.innerText = '';
    showTransactionsInDOM();
}

const addNewTransaction = (event) => {
    event.preventDefault();
    getDataForm();
    refreshListTransactions();
}

btnRegisterTransaction.addEventListener('click', addNewTransaction)