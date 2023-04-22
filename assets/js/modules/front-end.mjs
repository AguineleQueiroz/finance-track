import { allTransactions, removeTransaction, editTransaction } from '../back-end.js';

export function showMessageErrorInDOM() {
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

export function hideMessageErrorInDOM() {
    const message = document.querySelector(".error");
    if (message !== null) message.classList.add("hide");
}

/**
 * 
 * @param {object} obj 
 * @returns {string} 'add' ou 'minus'
 */
export const natureTransactionCssClass = (obj) =>
    obj["natureOfTransaction"] === "pay" ? "minus" : "add";


export function addTransactionMeaning() {
    const meaning = document.querySelector(".meaning-transaction");
    const tag = document.querySelector(".tag-nature-transaction");
    const add = document.createTextNode('+');
    const minus = document.createTextNode('-');
    if (tag) {
        tag.classList.contains("minus") ?
            meaning.appendChild(minus) : meaning.appendChild(add);
    }
}

/**
 * 
 * @param {Integer} ID 
 */
export const renderOptionsCard = (ID) => {
    const dropdownOptCard = document.querySelectorAll('.dropdown-opt-card');
    dropdownOptCard.forEach(item => {
        if (item.getAttribute('data-id') == ID) {
            const containsHideOptCardClass = item.classList.contains('hideOptCard');
            if(containsHideOptCardClass){
                item.classList.remove('hideOptCard')
                item.classList.add('showOptCard')
            }else {
                item.classList.remove('showOptCard')        
                item.classList.add('hideOptCard')
            }
        } 
    })
}

/**
 * 
 * @param {Integer} ID 
 */
export const searchEditLinksCardClicked = (ID) => {
    const dropDownMenuOpt = document.querySelectorAll('.dropdown-opt-card');
    dropDownMenuOpt.forEach( item => {
        if (item.getAttribute('data-id') == ID) {
            return renderOptionsCard(ID);
        }   
    })     
}

export const renderTransactionsInDOM = (
    { idTransaction, natureOfTransaction, typeTransaction, descriptionTransaction, valueTransaction }, CSSClass) => {
    
    const transactionsList = document.querySelector(".transactions-list");    
    let transactionHtml = document.createElement("div");

    transactionHtml.innerHTML = `
        <button class="btn-options">
            <img id="options-btn-img" src="assets/img/grip-vertical.svg"></img>
        </button>
        <div class="dropdown-opt-card hideOptCard">
            <ul class="dropdown-menu">
                <li class="edit">Edit</li>
                <li class="delete">Delete</li>
            </ul>
        </div>   
        <div class="body-text-transaction">
            <p class="type-transaction">${typeTransaction}</p>
            <p class="description-transaction">${descriptionTransaction}</p>
        </div>
        <div class="value-transact">
            <span class="meaning-transaction"></span>              
            <span>${formatMonetaryValues(Number(valueTransaction))}</span>
        </div>
        <div class="tag-nature-transaction"><div>
    `;

    transactionHtml.classList.add("card-transaction");
    transactionHtml.children[4].classList.add(CSSClass);
    transactionHtml.children[1].setAttribute('data-id', idTransaction)
    transactionHtml.children[0].addEventListener("click", function(){ 
        searchEditLinksCardClicked(idTransaction) 
    });
    transactionsList.prepend(transactionHtml);

    const deleteTransactionClick = document.querySelector('.delete');
    const editTransactionClick = document.querySelector('.edit');

    deleteTransactionClick.addEventListener("click", function() { removeTransaction(idTransaction) });
    editTransactionClick.addEventListener("click", function(){
        editTransaction({ 
            idTransaction, 
            natureOfTransaction, 
            typeTransaction, 
            descriptionTransaction, 
            valueTransaction 
        })
    });
}

export const createTextValuesFinances = (idField, sumTransactions) => {
    let spanContent = document.getElementById(idField);
    const nodeTextValue = sumTransactions;
    spanContent.textContent = nodeTextValue;
}

/**
 * 
 * @param {string} natureTransaction 
 * @returns {number} soma total das transações.
 */
export const getTotal = (natureTransaction) => {
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

export const updateInfoFinanceValues = () => {
    const incomes = getTotal("receive");
    const expenses = getTotal("pay");
    const incomesFormated = formatMonetaryValues(incomes);
    const expensesFormated = formatMonetaryValues(expenses);
    const amountValues = incomes - expenses
    const amount = formatMonetaryValues(amountValues > 0 ? amountValues : 0.00);


    createTextValuesFinances("amount", amount);
    createTextValuesFinances("incomes", incomesFormated);
    createTextValuesFinances("expenses", expensesFormated);
}

/**
 * 
 * @param {number} value 
 * @returns {string} 
 */
export const formatMonetaryValues = (value) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}


export function showTransactionsInDOM() {
    if (allTransactions()) {
        const arrAllTransactions = JSON
            .parse(allTransactions());
        showArrowScroll();
        arrAllTransactions.forEach(obj => {
            renderTransactionsInDOM(obj, natureTransactionCssClass(obj));
            addTransactionMeaning();
        });
    }
}

export const showArrowScroll = () => {
    const lenthArrTransactions = JSON.parse(allTransactions()).length;
    const arrowDown = document.getElementById("arrow-down-transactions-list");
    lenthArrTransactions > 4 ? arrowDown.style.visibility = 'visible' : arrowDown.style.visibility = 'hidden';
}

export const refreshListTransactions = () => {
    const transactionsList = document.querySelector(".transactions-list");
    transactionsList.innerText = '';
    showTransactionsInDOM();
}