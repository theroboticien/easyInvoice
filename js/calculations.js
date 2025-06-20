/**
 * Met à jour le total d'une ligne d'article unique.
 * @param {HTMLElement} row - L'élément DOM de la ligne d'article.
 */
function updateItemRowTotal(row) {
    const quantityInput = row.querySelector('.item-quantity');
    const priceInput = row.querySelector('.item-price');
    const discountInput = row.querySelector('.item-discount-percentage');
    const discountAmountEuroInput = row.querySelector('.item-discount-amount-euro');
    const itemTotalSpan = row.querySelector('.item-total');

    const quantity = parseFloat(quantityInput?.value) || 0;
    const price = parseFloat(priceInput?.value) || 0;
    let discountPercentage = parseFloat(discountInput?.value) || 0;

    if (discountPercentage < 0) {
        discountPercentage = 0;
        if (discountInput) discountInput.value = 0;
    } else if (discountPercentage > 100) {
        discountPercentage = 100;
        if (discountInput) discountInput.value = 100;
    }

    const discountAmountEuro = price * (discountPercentage / 100);
    if (discountAmountEuroInput) {
        discountAmountEuroInput.value = discountAmountEuro.toFixed(2);
    }

    const effectivePrice = price - discountAmountEuro;
    const total = quantity * effectivePrice;

    if (itemTotalSpan) {
        itemTotalSpan.textContent = `${total.toFixed(2)} €`;
    }
    calculateTotals();
}

/**
 * Calcule et affiche les totaux (HT, TVA, TTC) de la facture.
 */
function calculateTotals() {
    let subTotal = 0;
    if (singleItemRow) { // singleItemRow est une variable globale définie dans main.js
        const itemTotalText = singleItemRow.querySelector('.item-total')?.textContent;
        const itemTotalValue = parseFloat(itemTotalText?.replace(' €', '').replace(',', '.')) || 0;
        subTotal += itemTotalValue;
    }

    const taxRate = (parseFloat(DOM.tvaInput.value) || 0) / 100;
    const taxAmount = subTotal * taxRate;
    const grandTotal = subTotal + taxAmount;

    DOM.subTotalSpan.textContent = `${subTotal.toFixed(2)} €`;
    DOM.taxAmountSpan.textContent = `${taxAmount.toFixed(2)} €`;
    DOM.grandTotalSpan.textContent = `${grandTotal.toFixed(2)} €`;
}