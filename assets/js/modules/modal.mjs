import { hideMessageErrorInDOM } from "../index.js";
/* active modal */
const btnAddTransact = document.querySelector(".new-transaction-btn");
const btnCancelModal = document.querySelector(".btn-cancel")

const modal = document.querySelector(".modal");
export const openModal = () => {
    if (modal.classList.contains("hide")) {
        modal.classList.remove("hide");
        document.getElementById("type-transact").value = '';
        document.getElementById("description").value = '';
        document.getElementById("value").value = '';
        modal.classList.add("show");
    }
}

export const closeModal = () => {
    if (modal.classList.contains("show")) {
        modal.classList.remove("show");
        modal.classList.add("hide");
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