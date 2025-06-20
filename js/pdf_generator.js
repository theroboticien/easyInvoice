// js/pdf_generator.js
/**
 * Crée dynamiquement la ligne d'article unique dans le DOM.
 */
function createItemRow() {
    const selectedClient = DOM.clientNameSelect.value;
    let defaultDescriptionValue;
    if (selectedClient === "Google Ireland Inc") {
        defaultDescriptionValue = "Service : Création de videos";
    } else if (selectedClient.toLowerCase().includes("udemy inc")) {
        defaultDescriptionValue = "Service : Création de cours";
    } else {
        defaultDescriptionValue = "Service : Création de cours";
    }

    const itemRow = document.createElement('div');
    itemRow.classList.add('item-row');
    itemRow.innerHTML = `
        <div>
            <label>Description</label>
            <select class="item-description">
                <option value="Service : Création de cours" ${defaultDescriptionValue === "Service : Création de cours" ? 'selected' : ''}>Service : Création de cours</option>
                <option value="Service : Création de videos" ${defaultDescriptionValue === "Service : Création de videos" ? 'selected' : ''}>Service : Création de videos</option>
            </select>
        </div>
        <div>
            <label>Quantité</label>
            <input type="number" class="item-quantity" placeholder="Qté" min="1" value="1" disabled>
        </div>
        <div class="item-price-container">
            <label>Prix Unitaire</label>
            <input type="number" class="item-price" placeholder="Prix" min="0" step="0.01" value="50">
            <span class="item-price-symbol">€</span>
        </div>
        <div>
            <label>Rabais (%)</label>
            <input type="number" class="item-discount-percentage" placeholder="%" min="0" max="100" value="0" step="1">
        </div>
        <div class="item-price-container">
            <label>Rabais (€)</label>
            <input type="text" class="item-discount-amount-euro" value="0.00" disabled>
            <span class="item-price-symbol">€</span>
        </div>
        <div class="item-total-display">
            <label>Total</label>
            <span class="item-total">0.00 €</span>
        </div>
    `;
    DOM.itemsContainer.appendChild(itemRow);
    singleItemRow = itemRow; // Mettre à jour la référence globale

    // Ajouter les écouteurs pour la nouvelle ligne
    const descriptionSelect = singleItemRow.querySelector('.item-description');
    const priceInput = singleItemRow.querySelector('.item-price');
    const discountInput = singleItemRow.querySelector('.item-discount-percentage');

    if (descriptionSelect) descriptionSelect.addEventListener('change', () => updateItemRowTotal(singleItemRow));
    if (priceInput) priceInput.addEventListener('input', () => updateItemRowTotal(singleItemRow));
    if (discountInput) discountInput.addEventListener('input', () => updateItemRowTotal(singleItemRow));

    updateItemRowTotal(singleItemRow);
}

/**
 * Peuple le sélecteur de client avec les données disponibles.
 */
function populateClientSelect() {
    DOM.clientNameSelect.innerHTML = '<option value="">-- Sélectionner un client --</option>';

    for (const clientName in clientsData) {
        const option = document.createElement('option');
        option.value = clientName;
        option.textContent = clientName;
        DOM.clientNameSelect.appendChild(option);
    }
}

/**
 * Met à jour les champs d'information du client en fonction de la sélection du client ou du type.
 */
function updateClientFields() {
    if (!DOM.isCompanyCheckbox.checked) {
        return;
    }

    const selectedClient = DOM.clientNameSelect.value;
    const data = clientsData[selectedClient]; // clientsData est une variable globale dans main.js

    if (data) {
        DOM.clientAddressInput.value = data.address;
        DOM.clientSiretInput.value = data.siret;
        DOM.clientTvaIntraInput.value = data.tvaIntra;
        DOM.clientPhoneInput.value = ""; // Clear if switching to company that might have had these
        DOM.clientEmailInput.value = "";
    } else {
        // Clear fields if no data found for selected client
        DOM.clientAddressInput.value = "";
        DOM.clientSiretInput.value = "";
        DOM.clientTvaIntraInput.value = "";
        DOM.clientPhoneInput.value = "";
        DOM.clientEmailInput.value = "";
    }

    // Update item description based on client
    if (singleItemRow) { // singleItemRow est une variable globale dans main.js
        const itemDescriptionSelect = singleItemRow.querySelector('.item-description');
        let newDescriptionValue;
        if (selectedClient === "Google Ireland Inc") {
            newDescriptionValue = "Service : Création de videos";
        } else if (selectedClient.toLowerCase().includes("udemy inc")) {
            newDescriptionValue = "Service : Création de cours";
        } else {
            newDescriptionValue = "Service : Création de cours";
        }

        if (itemDescriptionSelect && itemDescriptionSelect.value !== newDescriptionValue) {
            itemDescriptionSelect.value = newDescriptionValue;
            updateItemRowTotal(singleItemRow);
        }
    }
}

/**
 * Bascule la visibilité et l'état des champs client en fonction de si c'est une société ou un particulier.
 */
function toggleClientFields() {
    if (DOM.isCompanyCheckbox.checked) {
        DOM.clientImportCsvWrapper.style.display = 'block';

        DOM.clientNameSelect.style.display = 'block';
        DOM.clientNameInput.style.display = 'none';
        if(DOM.clientNameInput.value && DOM.clientNameSelect.value === "") { // Transfer value if input had one and select is empty
             const option = Array.from(DOM.clientNameSelect.options).find(opt => opt.value === DOM.clientNameInput.value);
             if(option) DOM.clientNameSelect.value = DOM.clientNameInput.value;
             else DOM.clientNameSelect.value = ""; // Clear if no match
        }
        DOM.clientNameInput.value = ""; // Clear the input field

        DOM.clientAddressInput.disabled = true;
        DOM.companyClientFieldsDiv.style.display = 'block';
        DOM.clientSiretInput.disabled = true;
        DOM.clientTvaIntraInput.disabled = true;

        DOM.individualClientFieldsDiv.style.display = 'none';
        DOM.clientPhoneInput.value = ""; // Clear individual fields
        DOM.clientEmailInput.value = "";

        updateClientFields(); // Update fields based on selected company
    } else {
        DOM.clientImportCsvWrapper.style.display = 'none';

        DOM.clientNameSelect.style.display = 'none';
        DOM.clientNameInput.style.display = 'block';
        if(DOM.clientNameSelect.value && DOM.clientNameSelect.value !== "-- Sélectionner un client --") { // Transfer value if select had one
             DOM.clientNameInput.value = DOM.clientNameSelect.value;
        }
        DOM.clientNameSelect.value = ""; // Clear the select field

        DOM.clientAddressInput.disabled = false;
        DOM.companyClientFieldsDiv.style.display = 'none';
        DOM.clientSiretInput.value = ""; // Clear company fields
        DOM.clientTvaIntraInput.value = "";

        DOM.individualClientFieldsDiv.style.display = 'block';
        DOM.clientPhoneInput.disabled = false;
        DOM.clientEmailInput.disabled = false;
    }
    saveClientTypeSettingsToLocalStorage();
}

/**
 * Bascule la visibilité du champ "N° Facture Originale" en fonction de la checkbox "Facture corrective".
 */
function toggleOriginalInvoiceNumberField() {
    if (DOM.isCorrectionInvoiceCheckbox.checked) {
        DOM.originalInvoiceNumberGroup.style.display = 'block';
        DOM.originalInvoiceNumberInput.setAttribute('required', 'required'); // Rendre le champ obligatoire
    } else {
        DOM.originalInvoiceNumberGroup.style.display = 'none';
        DOM.originalInvoiceNumberInput.value = ''; // Clear the field when hidden
        DOM.originalInvoiceNumberInput.removeAttribute('required'); // Supprimer l'attribut obligatoire
        DOM.originalInvoiceNumberInput.setCustomValidity(""); // Réinitialiser tout message de validation
    }
    saveCorrectionInvoiceSettingToLocalStorage(); // Save current state
}


/**
 * Crée le document PDF de la facture.
 * @returns {jsPDF} L'objet jsPDF créé, ou null si la validation échoue.
 */
function createInvoicePdf() {
    // La validation des emails est maintenant gérée par validateForm() avant d'appeler cette fonction.
    // Cette fonction ne devrait être appelée que si toutes les validations du formulaire sont passées.

    calculateTotals(); // S'assurer que les totaux sont à jour

    const doc = new jsPDF();
    let currentY = 20;

    if (companyLogoData) { // companyLogoData est une variable globale dans main.js
        const logoX = 15;
        const logoY = 10;
        const maxLogoWidth = 35;
        const maxLogoHeight = 20;
        doc.addImage(companyLogoData, 'AUTO', logoX, logoY, maxLogoWidth, maxLogoHeight, null, 'FAST');
    }

    doc.setFontSize(22);
    doc.text("FACTURE", 105, currentY, { align: "center" });

    let textOffset = 0; // Offset for subsequent text under "FACTURE"

    // AJOUT DE LA LOGIQUE DE FACTURE CORRECTIVE
    if (DOM.isCorrectionInvoiceCheckbox.checked) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("ANNULE ET REMPLACE", 105, currentY + 7, { align: "center" });
        textOffset += 5; // Add space for "ANNULE ET REMPLACE"

        // AJOUT DU NUMÉRO DE FACTURE ORIGINALE SI PRÉSENT
        if (DOM.originalInvoiceNumberInput.value.trim()) {
            doc.setFontSize(9); // Smaller font for original invoice number
            doc.setFont("helvetica", "normal"); // Not bold
            doc.text(`(Facture n° ${DOM.originalInvoiceNumberInput.value.trim()})`, 105, currentY + 7 + textOffset + 2, { align: "center" });
            textOffset += 5; // Add space for original invoice number
        }
        doc.setFont("helvetica", "normal"); // Reset font
    }
    // FIN DE LA LOGIQUE DE FACTURE CORRECTIVE

    currentY += 15 + textOffset; // Adjust currentY based on added text

    doc.setFontSize(10);
    let companyInfoY = currentY;
    doc.text(DOM.companyNameInput.value, 20, companyInfoY); companyInfoY += 5;
    doc.text(`Siège Social: ${DOM.companyAddressInput.value}`, 20, companyInfoY); companyInfoY += 5;
    if (DOM.companyTvaIntraInput.value.trim()) {
        doc.text(`N° TVA intracommunautaire: ${DOM.companyTvaIntraInput.value}`, 20, companyInfoY); companyInfoY += 5;
    }
    if (DOM.companySiretInput.value.trim()) {
        doc.text(`SIRET: ${DOM.companySiretInput.value}`, 20, companyInfoY); companyInfoY += 5;
    }
    if (DOM.companyEmailInput.value.trim()) {
        doc.text(`Email: ${DOM.companyEmailInput.value}`, 20, companyInfoY); companyInfoY += 5;
    }

    const clientXPos = 125;
    doc.text("Facturé à:", clientXPos, currentY);

    let currentClientYPos = currentY + 5;

    const clientNameForPdf = DOM.isCompanyCheckbox.checked ? DOM.clientNameSelect.value : DOM.clientNameInput.value;
    doc.text(clientNameForPdf, clientXPos, currentClientYPos);
    currentClientYPos += 5;

    if (DOM.isCompanyCheckbox.checked) {
        const clientAddress = DOM.clientAddressInput.value;
        if (clientAddress.trim()) {
            const splitClientAddress = doc.splitTextToSize(clientAddress, 70);
            doc.text(splitClientAddress, clientXPos, currentClientYPos);
            currentClientYPos += (splitClientAddress.length * 5);
        }

        const clientSiret = DOM.clientSiretInput.value;
        if (clientSiret.trim()) {
            doc.text(`SIRET: ${clientSiret}`, clientXPos, currentClientYPos);
            currentClientYPos += 5;
        }
        const clientTvaIntra = DOM.clientTvaIntraInput.value;
        if (clientTvaIntra.trim()) {
            doc.text(`N° TVA intracommunautaire: ${clientTvaIntra}`, clientXPos, currentClientYPos);
            currentClientYPos += 5;
        }
    } else {
        const clientAddress = DOM.clientAddressInput.value;
        if (clientAddress.trim()) {
            const splitClientAddress = doc.splitTextToSize(clientAddress, 70);
            doc.text(splitClientAddress, clientXPos, currentClientYPos);
            currentClientYPos += (splitClientAddress.length * 5);
        }

        const clientPhone = DOM.clientPhoneInput.value;
        if (clientPhone.trim()) {
            doc.text(`Tél: ${clientPhone}`, clientXPos, currentClientYPos);
            currentClientYPos += 5;
        }
        const clientEmail = DOM.clientEmailInput.value;
        if (clientEmail.trim()) {
            doc.text(`Email: ${clientEmail}`, clientXPos, currentClientYPos);
            currentClientYPos += 5;
        }
    }

    currentY = Math.max(companyInfoY + 10, currentClientYPos + 5);

    const invoiceNumber = DOM.invoiceNumberInput.value;
    let formattedInvoiceDate = DOM.invoiceDateInput.value;
    try {
        const dateObj = new Date(DOM.invoiceDateInput.value);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        formattedInvoiceDate = dateObj.toLocaleDateString('fr-FR', options);
    } catch (e) {
        console.error("Erreur de formatage de la date:", e);
    }
    doc.text(`N° Facture: ${invoiceNumber}`, 20, currentY);
    doc.text(`Date: ${formattedInvoiceDate}`, 20, currentY + 5);
    currentY += 15;

    const tableColumn = ["Description", "Qté", "Prix Unit.", "Rabais (%)", "Rabais (€)", "Total"];
    const tableRows = [];

    if (singleItemRow) { // singleItemRow est une variable globale dans main.js
        tableRows.push([
            singleItemRow.querySelector('.item-description')?.value || '',
            singleItemRow.querySelector('.item-quantity')?.value || '',
            `${parseFloat(singleItemRow.querySelector('.item-price')?.value || 0).toFixed(2)} €`,
            `${parseFloat(singleItemRow.querySelector('.item-discount-percentage')?.value || 0)}%`,
            `${parseFloat(singleItemRow.querySelector('.item-discount-amount-euro')?.value || 0).toFixed(2)} €`,
            singleItemRow.querySelector('.item-total')?.textContent || ''
        ]);
    }

    doc.autoTable({
        startY: currentY,
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [240, 240, 240] }
    });

    currentY = doc.autoTable.previous.finalY + 10;

    const clientNameForAutoliquidationCheck = DOM.isCompanyCheckbox.checked ? DOM.clientNameSelect.value : '';
    const autoliquidationText = "Autoliquidation par le preneur, article 262 ter I, 1° du CGI et article 138 de la directive TVA 2006/112/CE";

    if (DOM.isCompanyCheckbox.checked && clientNameForAutoliquidationCheck.toLowerCase() !== "udemy inc") {
        doc.setFontSize(9);
        doc.setFont("helvetica", "italic");
        doc.text(autoliquidationText, 20, currentY);
        currentY += 5;
    }

    if (DOM.showExonerationTvaCheckbox.checked) {
        const exonerationText = DOM.exonerationTvaTextarea.value;
        if (exonerationText.trim()) {
            doc.setFontSize(9);
            doc.setFont("helvetica", "italic");
            const splitExoneration = doc.splitTextToSize(exonerationText, 170);
            doc.text(splitExoneration, 20, currentY);
            currentY += (splitExoneration.length * 5);
        }
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Total HT: ${DOM.subTotalSpan.textContent}`, 180, currentY, { align: "right" });
    doc.text(`TVA: ${DOM.taxAmountSpan.textContent}`, 180, currentY + 7, { align: "right" });
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL TTC: ${DOM.grandTotalSpan.textContent}`, 180, currentY + 17, { align: "right" });

    currentY += 27;
    const mentionsLegales = DOM.mentionsLegalesTextarea.value;
    if (mentionsLegales.trim()) {
        doc.setFontSize(9);
        doc.setFont("helvetica", "italic");
        const splitMentions = doc.splitTextToSize(mentionsLegales, 170);
        doc.text(splitMentions, 20, currentY);
        currentY += (splitMentions.length * 5);
    }

    const pageHeight = doc.internal.pageSize.height;
    let footerY = pageHeight - 30;

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setDrawColor(200);
    doc.setLineWidth(0.2);

    doc.line(20, footerY, 190, footerY);

    footerY += 5;

    const footerParts = [];
    footerParts.push(DOM.companyNameInput.value);
    footerParts.push(DOM.companyAddressInput.value);
    if (DOM.companyEmailInput.value.trim()) {
        footerParts.push(`Email: ${DOM.companyEmailInput.value}`);
    }
    if (DOM.companySiretInput.value.trim()) {
        footerParts.push(`SIRET: ${DOM.companySiretInput.value}`);
    }
    footerParts.push("siteweb");

    const footerText = footerParts.join(' | ');

    const textWidth = doc.getStringUnitWidth(footerText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    const footerX = (doc.internal.pageSize.width - textWidth) / 2;

    doc.text(footerText, footerX, footerY);

    console.log("PDF Document created successfully!");
    return doc;
}