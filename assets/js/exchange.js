import {
    allTransactions,
    renderTransactionsInDOM,
    natureTransactionCssClass,
    addTransactionMeaning
} from "./index.js";


const currency = "BRL";
let convertyToCurrency = "BRL";

const selectCurrencyEl = document.querySelector("#currency");
const optionsOfSelectEl = document.getElementsByTagName("option");

const addAttributeSelectedInCurrency = (item, attributeStr, valueAttribute) => {
    item.setAttribute(attributeStr, valueAttribute);
}

const removeSelectedAttributeOfCurrencies = (htmlCollection) => {
    for (const option of htmlCollection) {
        option.removeAttribute("selected");
    }
}

const displayCurrenciesAcronymInSelect = data => {
    const currencies = Object.entries(data);
    for (const acronym of currencies) {
        selectCurrencyEl.innerHTML += `
        <option class="options-currencies" value="${acronym[0]}">${acronym[0]}</option>
        `;
    }
}

const host = 'api.frankfurter.app';
fetch(`https://${host}/currencies`)
    .then(data => data.json())
    .then((data) => {
        displayCurrenciesAcronymInSelect(data);
        addAttributeSelectedInCurrency(optionsOfSelectEl.item(2), "selected", "selected");
    });

export async function convertCoin(currency, convertyToCurrency, valueTransactionForConvertion) {
    let request, resultRequest, convertionResult;
    if (currency != convertyToCurrency) {
        request = await fetch(`https://${host}/latest?amount=${valueTransactionForConvertion}&form=${currency}&to=${convertyToCurrency}`)
        resultRequest = await request.json();
        const rateCoin = Object.values(resultRequest.rates);
        convertionResult = Number(valueTransactionForConvertion) * rateCoin;
        return convertionResult;

    } return valueTransactionForConvertion;
}


selectCurrencyEl.addEventListener("change", async () => {
    removeSelectedAttributeOfCurrencies(optionsOfSelectEl);
    const optionSelected = selectCurrencyEl.options[selectCurrencyEl.selectedIndex];
    addAttributeSelectedInCurrency(optionSelected, "selected", "selected");
    convertyToCurrency = optionSelected.value;
    showValuesTransactionsConverted();
});

const showValuesTransactionsConverted = () => {

    if (allTransactions()) {
        const arrAllTransactions = JSON.parse(allTransactions());
        arrAllTransactions.forEach(async obj => {
            const valueTransactionForConvertion = obj["valueTransaction"];

            console.log("valores = ", currency, convertyToCurrency, valueTransactionForConvertion);

            console.log(await convertCoin(currency, convertyToCurrency, valueTransactionForConvertion));

            obj["valueTransaction"] = await convertCoin(currency, convertyToCurrency, valueTransactionForConvertion);

            renderTransactionsInDOM(obj, natureTransactionCssClass(obj));
            addTransactionMeaning();
        });
    }
}