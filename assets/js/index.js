import { closeModal } from './modules/modal.mjs'
export { hideMessageErrorInDOM }


const keyOfDataLocalStorage = 'transactions';
const allTransactions = () => localStorage.getItem(keyOfDataLocalStorage);
const btnRegisterTransaction = document.querySelector(".btn-add");

function addTransactionInLocalStorage(data) {
    localStorage.setItem(keyOfDataLocalStorage, data);
}

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

function renderTransactionsInDOM({ id, typeTransaction, descriptionTransaction, valueTransaction }, CSSClass) {
    const transactionsList = document.querySelector(".transactions-list");
    let transactionHtml = document.createElement("div");
    transactionHtml.innerHTML = `
            <button class="btn-delete">
                X
            </button>
            <div class="body-text-transaction">
                <p class="type-transaction">${typeTransaction}</p>
                <p class="description-transaction">
                ${descriptionTransaction}
                </p>
            </div>
            <div class="value-transact">
              <span class="meaning-transaction"></span>
              <span class="symbol-real">R$</span>
              <span>${valueTransaction}</span>
            </div>
            <div class="tag-nature-transaction"><div>`;
    transactionHtml.classList.add("card-transaction");
    transactionHtml.children[3].classList.add(CSSClass);
    transactionsList.prepend(transactionHtml);
}


const createTextValuesFinances = (idField, sumTransactions) => {
    let spanContent = document.getElementById(idField);
    const nodeTextValue = "R$ " + sumTransactions;
    spanContent.textContent = nodeTextValue;
}

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

        return sumTransactionsValues.toFixed(2);
    } else {
        return "0.00"
    }
}

const updateInfoFinanceValues = () => {
    const incomes = getTotal("receive");
    const expenses = getTotal("pay");
    const amount = incomes - expenses;

    createTextValuesFinances("amount", amount)
    createTextValuesFinances("incomes", incomes)
    createTextValuesFinances("expenses", expenses)
}


const showTransactionsInDOM = () => {
    if (allTransactions()) {
        const arrAllTransactions = JSON
            .parse(allTransactions());
        arrAllTransactions.forEach(obj => {
            renderTransactionsInDOM(obj, natureTransactionCssClass(obj));
            addTransactionMeaning();
        });
    }
    return;
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