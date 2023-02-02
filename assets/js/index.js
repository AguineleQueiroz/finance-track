import { closeModal } from './modules/modal.mjs'
export {
    hideMessageErrorInDOM,
    allTransactions,
    addTransactionMeaning,
    natureTransactionCssClass,
    renderTransactionsInDOM
}


const keyOfDataLocalStorage = 'transactions';

/**
 * 
 * @returns {Object} - objeto 'stringnificado'.
 */
const allTransactions = () => localStorage.getItem(keyOfDataLocalStorage);
const btnRegisterTransaction = document.querySelector(".btn-add");

/**
 * 
 * @param {object} data - objeto contendo id, natureza da transação, tipo, descrição e valor
 */
function addTransactionInLocalStorage(data) {
    localStorage.setItem(keyOfDataLocalStorage, data);
}

/**
 * 
 * @param {Object} obj 
 */
function sendDataToLocalStorage(obj) {
    if (allTransactions() === null) {
        addTransactionInLocalStorage(JSON.stringify([obj]));
    } else {
        addTransactionInLocalStorage(
            JSON.stringify(
                [...JSON.parse(allTransactions()), obj]
            )
        );
    }
}

/**
 * 
 * @param {number} idTransaction 
 * @param {string} natureOfTransaction 
 * @param {string} typeTransaction 
 * @param {string} descriptionTransaction 
 * @param {number} valueTransaction 
 */
function handleDataInputs(idTransaction, natureOfTransaction, typeTransaction,
    descriptionTransaction, valueTransaction) {
    if (!natureOfTransaction ||
        !typeTransaction ||
        !descriptionTransaction ||
        !valueTransaction ||
        valueTransaction === "0") {

        showMessageErrorInDOM();

    } else {
        const dataObj = {
            idTransaction,
            natureOfTransaction,
            typeTransaction,
            descriptionTransaction,
            valueTransaction
        }
        sendDataToLocalStorage(dataObj);
        closeModal();
    }
}

/**
 * 
 * @returns {number} int
 */
const generateID = () => Math.round(Math.random() * 1000);

const getDataForm = () => {
    const id = generateID();
    const natureOfTransaction = document
        .querySelector("input[name=naturetransaction]:checked").value;
    const typeTransaction = document
        .getElementById("type-transact").value;
    const descriptionTransaction = document
        .getElementById("description").value;
    const valueTransaction = document
        .getElementById("value").value.replace(/[^0-9\\.]+/g, '');

    const arr = [
        id,
        natureOfTransaction,
        typeTransaction,
        descriptionTransaction,
        valueTransaction
    ];

    handleDataInputs(...arr);
}

/**
 * 
 * @param {object} transactions 
 */
const updateLocalStorage = (transactions) => {
    localStorage.clear();
    addTransactionInLocalStorage(JSON.stringify(transactions));
    refreshListTransactions();
    updateInfoFinanceValues();
}

/**
 * 
 * @param {number} ID 
 */
const removeTransaction = (ID) => {
    const arrAllTransactions = JSON.parse(allTransactions());
    const transactionsCannotBeRemoved = arrAllTransactions
        .filter(item => item.idTransaction !== ID);
    updateLocalStorage(transactionsCannotBeRemoved);
}

function showMessageErrorInDOM() {
    const element = document.querySelector(".error");
    if (element === null) {
        const fieldSet = document.querySelector(".transact-form");
        const messageElement = document.createElement("p");
        messageElement.innerHTML = `
            <p class="error">
            <img class="exclamation-message-error" 
            src="./assets/img/exclamation.svg" alt="exclamation icon"></img>
            Preencha os campos corretamente.
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

/**
 * 
 * @param {object} obj 
 * @returns {string} 'add' ou 'minus'
 */
const natureTransactionCssClass = (obj) =>
    obj["natureOfTransaction"] === "pay" ? "minus" : "add";


function addTransactionMeaning() {
    const meaning = document.querySelector(".meaning-transaction");
    const tag = document.querySelector(".tag-nature-transaction");
    const add = document.createTextNode('+');
    const minus = document.createTextNode('-');
    if (tag) {
        tag.classList.contains("minus") ?
            meaning.appendChild(minus) : meaning.appendChild(add);
    }
}

const renderTransactionsInDOM = (
    { idTransaction, typeTransaction, descriptionTransaction, valueTransaction }, CSSClass) => {
    const transactionsList = document.querySelector(".transactions-list");
    let transactionHtml = document.createElement("div");
    transactionHtml.innerHTML = `
            <button class="btn-delete">
                <img src="assets/img/trash.svg"></img>
            </button>
            <div class="body-text-transaction">
                <p class="type-transaction">${typeTransaction}</p>
                <p class="description-transaction">
                ${descriptionTransaction}
                </p>
            </div>
            <div class="value-transact">
              <span class="meaning-transaction"></span>              
              <span>${formatMonetaryValues(Number(valueTransaction))}</span>
            </div>
            <div class="tag-nature-transaction"><div>`;
    transactionHtml.classList.add("card-transaction");
    transactionHtml.children[3].classList.add(CSSClass);
    transactionHtml.children[0].addEventListener("click", function () { removeTransaction(idTransaction) })
    transactionsList.prepend(transactionHtml);
}

const createTextValuesFinances = (idField, sumTransactions) => {
    let spanContent = document.getElementById(idField);
    const nodeTextValue = sumTransactions;
    spanContent.textContent = nodeTextValue;
}

/**
 * 
 * @param {string} natureTransaction 
 * @returns {number} soma total das transações.
 */
const getTotal = (natureTransaction) => {
    const transactions = JSON
        .parse(allTransactions());

    if (transactions) {
        const transactionsValues = transactions
            .filter(item => item.natureOfTransaction === natureTransaction);

        const sumTransactionsValues = transactionsValues
            .reduce(
                (acumulator, currentTransaction) =>
                    acumulator + Number(currentTransaction.valueTransaction), 0
            );

        return Number(sumTransactionsValues);
    } else {
        return 0.00;
    }
}

const updateInfoFinanceValues = () => {
    const incomes = getTotal("receive");
    const expenses = getTotal("pay");
    const incomesFormated = formatMonetaryValues(incomes);
    const expensesFormated = formatMonetaryValues(expenses);
    const amount = formatMonetaryValues(incomes - expenses);

    createTextValuesFinances("amount", amount);
    createTextValuesFinances("incomes", incomesFormated);
    createTextValuesFinances("expenses", expensesFormated);
}

/**
 * 
 * @param {number} value 
 * @returns {string} 
 */
const formatMonetaryValues = (value) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}


function showTransactionsInDOM() {
    if (allTransactions()) {
        const arrAllTransactions = JSON
            .parse(allTransactions());
        arrAllTransactions.forEach(async obj => {
            renderTransactionsInDOM(obj, natureTransactionCssClass(obj));
            addTransactionMeaning();
        });
    }
}

const refreshListTransactions = () => {
    const transactionsList = document.querySelector(".transactions-list");
    transactionsList.innerText = '';
    showTransactionsInDOM();
}

const addNewTransaction = (event) => {
    event.preventDefault();
    getDataForm();
    refreshListTransactions();
    updateInfoFinanceValues();
}

showTransactionsInDOM();
updateInfoFinanceValues();

btnRegisterTransaction.addEventListener('click', addNewTransaction);