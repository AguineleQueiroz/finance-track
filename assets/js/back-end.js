import { closeModal, closeModalEdit, editModal } from './modules/modal.mjs'
import { 
    showTransactionsInDOM, updateInfoFinanceValues, refreshListTransactions, showMessageErrorInDOM
} from './modules/front-end.mjs'

const keyOfDataLocalStorage = 'transactions';

/**
 * 
 * @returns {Object} - objeto 'stringnificado'.
 */
export const allTransactions = () => localStorage.getItem(keyOfDataLocalStorage);
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
 * @param {Integer} transactionID 
 * @returns Boolean
 */
const uniqueTransaction = (transactionID) => {
    if(allTransactions()){
        const exist = JSON.parse(allTransactions()).filter( item => item.idTransaction == transactionID);
        if(exist.length === 0){
            return false
        }
        return true            
    }
}

/**
 * 
 * @param {Object} obj 
 */
function sendDataToLocalStorage(obj) {
    if (allTransactions() === null) {
        addTransactionInLocalStorage(JSON.stringify([obj]));
    } else {
        if(!uniqueTransaction(obj['idTransaction'])){            
            addTransactionInLocalStorage(
                JSON.stringify(
                    [...JSON.parse(allTransactions()), obj]
                )
            );
        }
        return
    }
}

/**
 * 
 * @param {Integer} ID 
 * @returns Array
 */
const searchTransaction = (ID) => {
    let transactionArr = [];
    let indexTransaction = 0;
    if(allTransactions()){
        const arrTransaction = JSON.parse(allTransactions());
        transactionArr = arrTransaction.filter(item => item.idTransaction == ID)
        for (let index = 0; index < arrTransaction.length; index++) {
            if (ID == arrTransaction[index]['idTransaction']) {
                indexTransaction = index;          
                break;
            }
        }
        if(transactionArr){
            return [transactionArr, indexTransaction];
        }
        return false;
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
    }else{
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
 * @returns {number} Integer
 */
const generateID = () => Math.round(Math.random() * 1000);

/**
 * 
 */
export const getDataForm = () => {

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
 * @param {Integer} idTransaction 
 * @returns Array
 */
export const getDataFormEdited = (idTransaction) => {
    const id = idTransaction;
    const natureOfTransaction = document
        .querySelector("input[name=naturetransactionedit]:checked").value;
    const typeTransaction = document
        .getElementById("type-transact-edit").value;
    const descriptionTransaction = document
        .getElementById("description-edit").value;
    const valueTransaction = document
        .getElementById("value-edit").value.replace(/[^0-9\\.]+/g, '');

    const arrEdited = [
        id,
        natureOfTransaction,
        typeTransaction,
        descriptionTransaction,
        valueTransaction
    ];
    return arrEdited;
}

/**
 * 
 * @param {object} transactions 
 */
const updateLocalStorage = (transactions) => {
    localStorage.clear();
    if(transactions.length === 0) return;
    addTransactionInLocalStorage(JSON.stringify(transactions));
    updateInfoFinanceValues();
}

/**
 * 
 * @param {number} ID 
 */
export const removeTransaction = (ID) => {
    const arrAllTransactions = JSON.parse(allTransactions());
    const transactionsCannotBeRemoved = arrAllTransactions
        .filter(item => item.idTransaction !== ID);
    updateLocalStorage(transactionsCannotBeRemoved);
    refreshListTransactions();
}            

/**
 * 
 * @param {Object} transactionObj 
 */
export const editTransaction = (transactionObj) => {  
    editModal(transactionObj);
    const btnSaveEditModal = document.querySelector(".btn-save");
    btnSaveEditModal.addEventListener("click", function(){ 
        saveEditedTransaction(transactionObj);
    });   
}

/**
 * 
 * @param {event} event 
 */
const addNewTransaction = (event) => {
    event.preventDefault();
    getDataForm();
    refreshListTransactions();
    updateInfoFinanceValues();
}

/**
 * 
 * @param {Array} dataTransactionEdited 
 * @returns Object
 */
const replaceValuesInLocalStorage = (dataTransactionEdited) => {
    if (searchTransaction(dataTransactionEdited[0])) {

        const transactions = JSON.parse(allTransactions());
        const index = transactions.findIndex(item => item.idTransaction == dataTransactionEdited[0])

        const transactionObjEdited = {
            idTransaction: dataTransactionEdited[0],
            natureOfTransaction: dataTransactionEdited[1],
            typeTransaction: dataTransactionEdited[2],
            descriptionTransaction: dataTransactionEdited[3],
            valueTransaction: dataTransactionEdited[4],
        }
        transactions.splice(index, 1, transactionObjEdited)
        return transactions
    }
}
/**
 * 
 * @param {object} transaction 
 */
const saveEditedTransaction = (transaction) => {
    const parseTransactions = replaceValuesInLocalStorage( 
        getDataFormEdited(transaction['idTransaction'])
    );
    updateLocalStorage(parseTransactions)

    closeModalEdit();

    refreshListTransactions();
    updateInfoFinanceValues();
}

showTransactionsInDOM();
updateInfoFinanceValues();

btnRegisterTransaction.addEventListener('click', addNewTransaction);

