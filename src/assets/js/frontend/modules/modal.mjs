import { hideMessageErrorInDOM, renderOptionsCard } from "./index.mjs";
/* active modal */
const btnAddTransact = document.querySelector(".new-transaction-btn");
const btnCancelModal = document.querySelector(".btn-cancel");
const btnCancelModalEdit = document.querySelector(".btn-cancel-edit");


const modal = document.querySelector(".modal");
const modalEdit = document.querySelector(".edit-modal");

export const openModal = () => {
    if (modal.classList.contains("hide")) {
        modal.classList.remove("hide");
        document.getElementById("type-transact").value = '';
        document.getElementById("description").value = '';
        document.getElementById("value").value = '';
        modal.classList.add("show");
    }
}

export const editModal = (transactObj) => { 
    renderOptionsCard(transactObj['idTransaction']); 
    if (modalEdit.classList.contains("hide")) {
        modalEdit.classList.remove("hide");
        const valueIptRadioPay = document.querySelector('#pay-edit');
        const valueIptRadioReceive = document.querySelector('#receive-edit');
        
        if (transactObj['natureOfTransaction'] === 'pay') {
            valueIptRadioPay.setAttribute('checked', 'true');
            valueIptRadioReceive.removeAttribute('checked');
        }else if (transactObj['natureOfTransaction'] === 'receive') {
            valueIptRadioPay.removeAttribute('checked');
            valueIptRadioReceive.setAttribute('checked', 'true');           
        }

        document.getElementById("type-transact-edit").value = transactObj['typeTransaction'];
        document.getElementById("description-edit").value = transactObj['descriptionTransaction'];
        document.getElementById("value-edit").value = transactObj['valueTransaction'];

        modalEdit.classList.add("show");
    }
}

export const closeModal = () => {
    if (modal.classList.contains("show")) {
        modal.classList.remove("show");
        modal.classList.add("hide");
        hideMessageErrorInDOM();
    }
};
export const closeModalEdit = () => {
    if (modalEdit.classList.contains("show")) {
        modalEdit.classList.remove("show");
        modalEdit.classList.add("hide");
        hideMessageErrorInDOM();
    }
};

// Bloqueia dados que nao sejam numeros no input
const inputValue = document.getElementById("value");
inputValue.addEventListener("input", event => {
    const valueInputEntered = event.target.value.trim().replace(/[^0-9\\.]+/g, '');
    inputValue.value = valueInputEntered;
})

btnAddTransact.addEventListener("click", openModal);
btnCancelModal.addEventListener("click", closeModal);
btnCancelModalEdit.addEventListener("click", closeModalEdit);
