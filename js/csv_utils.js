/**
 * Parse une ligne CSV en tenant compte des guillemets et des virgules.
 * @param {string} line - La ligne CSV à parser.
 * @returns {Array<string>} Un tableau des valeurs parsées.
 */
function parseCsvLine(line) {
    const values = [];
    const csvRegex = /\s*(?:\"((?:[^"]|\"\")*)\"|([^,]*))\s*(?:,|$)/g;

    let match;
    while ((match = csvRegex.exec(line)) !== null) {
        let value;
        if (match[1] !== undefined) {
            value = match[1].replace(/""/g, '"');
        } else {
            value = match[2];
        }
        values.push(value);

        // Cette condition gère les cas où la dernière colonne est vide
        // ou si la ligne se termine par une virgule.
        if (csvRegex.lastIndex === line.length && line[line.length-1] !== ',') {
            break;
        }
    }
    return values;
}

/**
 * Échappe une valeur pour l'inclusion dans un fichier CSV.
 * Ajoute des guillemets si la valeur contient des virgules, des guillemets ou des retours à la ligne.
 * Les guillemets internes sont doublés.
 * @param {string} value - La valeur à échapper.
 * @returns {string} La valeur échappée.
 */
function escapeCsvValue(value) {
    if (value === null || value === undefined) {
        return '';
    }
    let stringValue = String(value);
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
}

/**
 * Importe les données de la société à partir d'un fichier CSV.
 * @param {Event} event - L'événement de changement de fichier.
 */
function importCompanyDataFromCsv(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const csvContent = e.target.result;
            const lines = csvContent.split('\n').filter(line => line.trim() !== '');

            if (lines.length < 2) {
                alert("Le fichier CSV société doit contenir au moins une ligne d'en-tête et une ligne de données.");
                return;
            }

            const headers = parseCsvLine(lines[0]);
            const data = parseCsvLine(lines[1]);

            const fieldMap = {
                "NomSociete": DOM.companyNameInput,
                "AdresseSociete": DOM.companyAddressInput,
                "TVASociete": DOM.companyTvaIntraInput,
                "SIRETSociete": DOM.companySiretInput,
                "EmailSociete": DOM.companyEmailInput
            };

            if (data.length === headers.length) {
                headers.forEach((header, index) => {
                    const targetInput = fieldMap[header];
                    if (targetInput && data[index] !== undefined) {
                        targetInput.value = data[index];
                    }
                });
                saveCompanyTextDataToLocalStorage();
            } else {
                alert(`Le fichier CSV société est mal formé. La ligne de données n'a pas le même nombre de colonnes que l'en-tête. (Attendu: ${headers.length}, Trouvé: ${data.length})`);
            }
        };
        reader.readAsText(file);
    }
}

/**
 * Importe les données des clients à partir d'un fichier CSV.
 * @param {Event} event - L'événement de changement de fichier.
 */
function importClientsFromCsv(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const csvContent = e.target.result;
            const lines = csvContent.split('\n').filter(line => line.trim() !== '');

            if (lines.length < 2) {
                alert("Le fichier CSV des clients doit contenir au moins une ligne d'en-tête et une ligne de données.");
                return;
            }

            const headers = parseCsvLine(lines[0]);
            if (!headers.includes("NomClient") || !headers.includes("AdresseClient") ||
                !headers.includes("SiretClient") || !headers.includes("TvaIntraClient")) {
                alert("Les en-têtes du fichier CSV des clients doivent inclure 'NomClient', 'AdresseClient', 'SiretClient', 'TvaIntraClient'.");
                return;
            }

            const newClientsData = {};
            for (let i = 1; i < lines.length; i++) {
                const data = parseCsvLine(lines[i]);
                if (data.length === headers.length) {
                    const clientName = data[headers.indexOf("NomClient")];
                    newClientsData[clientName] = {
                        address: data[headers.indexOf("AdresseClient")] || "",
                        siret: data[headers.indexOf("SiretClient")] || "",
                        tvaIntra: data[headers.indexOf("TvaIntraClient")] || ""
                    };
                } else {
                    console.warn(`Ligne CSV client ignorée car mal formée: ${lines[i]}`);
                }
            }
            clientsData = { ...clientsData, ...newClientsData }; // clientsData est une variable globale dans main.js
            populateClientSelect();
            alert("Clients importés avec succès.");
        };
        reader.readAsText(file);
    }
}

/**
 * Exporte les données de la facture actuelle vers un fichier CSV.
 */
function exportInvoiceToCsv() {
    const headers = [
        "FactureNumero", "FactureDate", "IsCorrectionInvoice", "OriginalInvoiceNumber",
        "ClientType", "ClientNom", "ClientAdresse", "ClientSiret", "ClientTvaIntra", "ClientTelephone", "ClientEmail",
        "ArticleDescription", "ArticleQuantite", "ArticlePrixUnitaire", "ArticleRabaisPourcentage", "ArticleRabaisEuro", "ArticleTotal",
        "TVA", "TotalHT", "TotalTTC", "MentionsLegales", "AfficherExonerationTVA", "TexteExonerationTVA"
    ];

    const row = [];
    row.push(DOM.invoiceNumberInput.value);
    row.push(DOM.invoiceDateInput.value);
    row.push(DOM.isCorrectionInvoiceCheckbox.checked ? 'Oui' : 'Non');
    row.push(DOM.originalInvoiceNumberInput.value);

    row.push(DOM.isCompanyCheckbox.checked ? "Societe" : "Particulier");
    row.push(DOM.isCompanyCheckbox.checked ? DOM.clientNameSelect.value : DOM.clientNameInput.value);
    row.push(DOM.clientAddressInput.value);
    row.push(DOM.clientSiretInput.value);
    row.push(DOM.clientTvaIntraInput.value);
    row.push(DOM.clientPhoneInput.value);
    row.push(DOM.clientEmailInput.value);

    if (singleItemRow) { // singleItemRow est une variable globale dans main.js
        row.push(singleItemRow.querySelector('.item-description')?.value || '');
        row.push(singleItemRow.querySelector('.item-quantity')?.value || '');
        row.push(parseFloat(singleItemRow.querySelector('.item-price')?.value || 0).toFixed(2));
        row.push(parseFloat(singleItemRow.querySelector('.item-discount-percentage')?.value || 0));
        row.push(parseFloat(singleItemRow.querySelector('.item-discount-amount-euro')?.value || 0).toFixed(2));
        row.push(parseFloat(singleItemRow.querySelector('.item-total')?.textContent?.replace(' €', '').replace(',', '.') || 0).toFixed(2));
    } else {
        row.push('', '', '', '', '', '');
    }

    row.push(DOM.tvaInput.value);
    row.push(DOM.subTotalSpan.textContent.replace(' €', ''));
    row.push(DOM.grandTotalSpan.textContent.replace(' €', ''));
    row.push(DOM.mentionsLegalesTextarea.value);
    row.push(DOM.showExonerationTvaCheckbox.checked ? 'Oui' : 'Non');
    row.push(DOM.exonerationTvaTextarea.value);

    const csvContent = headers.map(escapeCsvValue).join(',') + '\n' + row.map(escapeCsvValue).join(',');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `facture_${DOM.invoiceNumberInput.value || 'nouvelle'}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('La facture a été exportée au format CSV.');
}

/**
 * Importe les données d'une facture depuis un fichier CSV et met à jour le formulaire.
 * @param {Event} event - L'événement de changement de fichier.
 */
function importInvoiceFromCsv(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const csvContent = e.target.result;
            const lines = csvContent.split('\n').filter(line => line.trim() !== '');

            if (lines.length < 2) {
                alert("Le fichier CSV de la facture doit contenir au moins une ligne d'en-tête et une ligne de données.");
                return;
            }

            const headers = parseCsvLine(lines[0]);
            const data = parseCsvLine(lines[1]);

            if (data.length !== headers.length) {
                 alert(`Le fichier CSV de la facture est mal formé. La ligne de données n'a pas le même nombre de colonnes que l'en-tête. (Attendu: ${headers.length}, Trouvé: ${data.length})`);
                 return;
             }

            const dataMap = {};
            headers.forEach((header, index) => {
                dataMap[header] = data[index];
            });

            DOM.invoiceNumberInput.value = dataMap.FactureNumero || '';
            DOM.invoiceDateInput.value = dataMap.FactureDate || '';

            DOM.isCorrectionInvoiceCheckbox.checked = (dataMap.IsCorrectionInvoice === 'Oui');
            toggleOriginalInvoiceNumberField(); // Call toggle function to update visibility
            DOM.originalInvoiceNumberInput.value = dataMap.OriginalInvoiceNumber || ''; // Load original invoice number


            const isCompany = dataMap.ClientType === "Societe";
            DOM.isCompanyCheckbox.checked = isCompany;
            toggleClientFields();

            if (isCompany) {
                const clientName = dataMap.ClientNom || '';
                const option = Array.from(DOM.clientNameSelect.options).find(opt => opt.value === clientName);
                if (option) {
                    DOM.clientNameSelect.value = clientName;
                } else {
                    console.warn(`Client "${clientName}" non trouvé dans la liste existante.`);
                }
            } else {
                DOM.clientNameInput.value = dataMap.ClientNom || '';
            }

            DOM.clientAddressInput.value = dataMap.ClientAdresse || '';
            DOM.clientSiretInput.value = dataMap.ClientSiret || '';
            DOM.clientTvaIntraInput.value = dataMap.ClientTvaIntra || '';
            DOM.clientPhoneInput.value = dataMap.ClientTelephone || '';
            DOM.clientEmailInput.value = dataMap.ClientEmail || '';

            if (singleItemRow) { // singleItemRow est une variable globale dans main.js
                const descriptionSelect = singleItemRow.querySelector('.item-description');
                const quantityInput = singleItemRow.querySelector('.item-quantity');
                const priceInput = singleItemRow.querySelector('.item-price');
                const discountPercentageInput = singleItemRow.querySelector('.item-discount-percentage');

                const importedDescription = dataMap.ArticleDescription || '';
                const descriptionOption = Array.from(descriptionSelect.options).find(opt => opt.value === importedDescription);
                if (descriptionOption) {
                    descriptionSelect.value = importedDescription;
                } else {
                    let newOption = document.createElement('option');
                    newOption.value = importedDescription;
                    newOption.textContent = importedDescription;
                    descriptionSelect.appendChild(newOption);
                    descriptionSelect.value = importedDescription;
                }

                quantityInput.value = dataMap.ArticleQuantite || '1';
                priceInput.value = dataMap.ArticlePrixUnitaire || '0';
                discountPercentageInput.value = dataMap.ArticleRabaisPourcentage || '0';
                updateItemRowTotal(singleItemRow);
            }

            DOM.tvaInput.value = dataMap.TVA || '0';
            DOM.mentionsLegalesTextarea.value = dataMap.MentionsLegales || '';
            DOM.showExonerationTvaCheckbox.checked = (dataMap.AfficherExonerationTVA === 'Oui');
            DOM.exonerationTvaTextarea.value = dataMap.TexteExonerationTVA || '';

            calculateTotals();

            alert('La facture a été importée avec succès.');
        };
        reader.readAsText(file);
    }
}