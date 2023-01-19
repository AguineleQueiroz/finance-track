import { closeModal } from './modules/modal.mjs'

/* events on backend ================================================================================== */
const keyOfDataLocalStorage = 'transactions';
const btnRegisterTransaction = document.querySelector(".btn-add");

/* get all transacts */
const getTransactsInLocalStorage = localStorage.getItem(keyOfDataLocalStorage);

/* add new transact in localStorage */
function addLocalStorage(data) {
    localStorage.setItem(keyOfDataLocalStorage, data);
}
/* Send new transact to the localStorage */
function setDataInLocalStorage(obj) {
    if (getTransactsInLocalStorage === null) {
        addLocalStorage(JSON.stringify([obj]));
    } else {
        addLocalStorage(JSON.stringify([...JSON.parse(localStorage.getItem(keyOfDataLocalStorage)), obj]));
    }
}
/* get data of the inputs */
const getDataForm = () => {
    const typeTransact = document.getElementById("type-transact").value;
    const descriptionTransact = document.getElementById("description").value;
    const valueTransact = document.getElementById("value").value;
    processDataInputs(typeTransact, descriptionTransact, valueTransact);
}

/* checks whether or not to send data to localStorage */
function processDataInputs(typeTransact, descriptionTransact, valueTransact) {
    if (!typeTransact || !descriptionTransact || !valueTransact) {
        showMessageError();
    } else {
        hideMessageError();
        const dataObj = { typeTransact, descriptionTransact, valueTransact }
        setDataInLocalStorage(dataObj);
        closeModal();
    }
}
/* call of the functions for the add new transacts */
const addNewTransact = (event) => {
    event.preventDefault();
    getDataForm();
}

/* events on html ================================================================================== */
function showMessageError() {
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

function hideMessageError() {
    const message = document.querySelector(".error");
    if (message !== null) message.classList.add("hide");
}

function renderTransactions(transact) {
    const transactionsList = document.querySelector(".transactions-list");
    let transactHtml = document.createElement("div");
    transactHtml.innerHTML = `
        <div class="card-transaction">
            <div class="body-text-transaction">
                <p class="type-transaction">${transact.typeTransact}</p>
                <p class="description-transaction">${transact.descriptionTransact}</p>
            </div>
            <div class="value-transact">
              <span>+ R$</span>
              <span>${transact.valueTransact}</span>
            </div>
        </div>`;

    transactionsList.appendChild(transactHtml);
}

const showTransactions = () => {
    if (getTransactsInLocalStorage) {
        const arrAllTransactions = JSON.parse(localStorage.getItem(keyOfDataLocalStorage));
        arrAllTransactions.forEach(obj => renderTransactions(obj));
    }
    return;
}

showTransactions();


btnRegisterTransaction.addEventListener('click', addNewTransact)