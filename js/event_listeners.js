// js/event_listeners.js
/**
 * Attache tous les écouteurs d'événements aux éléments du DOM.
 */
function attachEventListeners() {
    // Écouteurs pour les champs de la société
    DOM.companyCsvUpload.addEventListener('change', importCompanyDataFromCsv);
    DOM.companyLogoInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                companyLogoData = e.target.result; // companyLogoData est une variable globale dans main.js
                localStorage.setItem(COMPANY_LOGO_KEY, companyLogoData);
            };
            reader.readAsDataURL(file);
        }
    });

    // Écouteurs pour les champs client
    DOM.clientCsvUpload.addEventListener('change', importClientsFromCsv);
    DOM.isCompanyCheckbox.addEventListener('change', toggleClientFields);
    DOM.clientNameSelect.addEventListener('change', updateClientFields);
    DOM.clientNameInput.addEventListener('input', saveClientTypeSettingsToLocalStorage); // Pour les particuliers
    DOM.clientAddressInput.addEventListener('input', saveClientTypeSettingsToLocalStorage);
    DOM.clientPhoneInput.addEventListener('input', saveClientTypeSettingsToLocalStorage);
    DOM.clientEmailInput.addEventListener('input', saveClientTypeSettingsToLocalStorage);

    // Écouteurs pour les détails de la facture
    DOM.autoIncrementInvoiceNumberCheckbox.addEventListener('change', saveAutoIncrementInvoiceSettingToLocalStorage); // Nouvel écouteur
    DOM.isCorrectionInvoiceCheckbox.addEventListener('change', () => {
        toggleOriginalInvoiceNumberField();
        validateOriginalInvoiceNumberField(); // Nouvelle validation lors du changement de la checkbox
    });
    DOM.originalInvoiceNumberInput.addEventListener('input', () => {
        saveCorrectionInvoiceSettingToLocalStorage();
        validateOriginalInvoiceNumberField(); // Valider à chaque saisie
    });

    // Écouteurs pour les articles (la ligne unique est déjà créée par createItemRow)
    // Les écouteurs pour la ligne d'article unique sont attachés dans createItemRow()
    // et mis à jour via updateItemRowTotal()

    // Écouteurs pour les obligations légales / TVA
    DOM.tvaInput.addEventListener('change', calculateTotals);
    DOM.showExonerationTvaCheckbox.addEventListener('change', saveExonerationSettingsToLocalStorage);
    DOM.exonerationTvaTextarea.addEventListener('input', saveExonerationSettingsToLocalStorage);

    // Écouteurs pour les boutons d'action
    DOM.generatePdfBtn.addEventListener('click', () => {
        if (!validateForm()) { // Appel à une fonction de validation globale
            return;
        }
        const doc = createInvoicePdf();
        if (doc) {
            doc.save(`facture_${DOM.invoiceNumberInput.value || 'nouvelle'}.pdf`);
            alert('Le téléchargement du PDF a été initié. Veuillez vérifier vos téléchargements.');
            if (DOM.autoIncrementInvoiceNumberCheckbox.checked) {
                incrementInvoiceNumber(); // Incrémenter le numéro de facture si la checkbox est cochée
            }
        }
    });

    DOM.previewPdfBtn.addEventListener('click', () => {
        if (!validateForm()) { // Appel à une fonction de validation globale
            return;
        }
        const doc = createInvoicePdf();
        if (doc) {
            const pdfBlob = doc.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);

            DOM.pdfFrame.src = pdfUrl;
            DOM.pdfPreviewDiv.style.display = 'block';
        }
    });

    DOM.exportCsvBtn.addEventListener('click', exportInvoiceToCsv);
    DOM.invoiceCsvUpload.addEventListener('change', importInvoiceFromCsv);
}

/**
 * Valide si le champ "N° Facture Originale" est obligatoire et rempli.
 * @returns {boolean} True si valide, false sinon.
 */
function validateOriginalInvoiceNumberField() {
    if (DOM.isCorrectionInvoiceCheckbox.checked && DOM.originalInvoiceNumberInput.value.trim() === '') {
        DOM.originalInvoiceNumberInput.setCustomValidity("Le numéro de facture originale est obligatoire pour une facture corrective.");
        DOM.originalInvoiceNumberInput.reportValidity();
        return false;
    } else {
        DOM.originalInvoiceNumberInput.setCustomValidity(""); // Réinitialise le message de validation
        return true;
    }
}

/**
 * Effectue toutes les validations du formulaire.
 * @returns {boolean} True si toutes les validations passent, false sinon.
 */
function validateForm() {
    let isValid = true;

    // Validation des emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailInputs = document.querySelectorAll('input[type="email"]');
    for (const input of emailInputs) {
        // On ne valide que si le champ n'est pas désactivé et a une valeur non vide
        if (!input.disabled && input.value.trim() !== '' && !emailRegex.test(input.value)) {
            alert(`Veuillez entrer une adresse email valide pour le champ "${input.labels[0]?.textContent || input.placeholder || input.id}".`);
            input.focus();
            isValid = false;
            break;
        } else if (input.disabled && input.value.trim() !== '' && !emailRegex.test(input.value)) {
            // Permettre la validation même si désactivé si une valeur est présente
            alert(`Veuillez entrer une adresse email valide pour le champ "${input.labels[0]?.textContent || input.placeholder || input.id}".`);
            input.focus();
            isValid = false;
            break;
        }
    }
    if (!isValid) return false;


    // Validation du champ de facture originale
    if (!validateOriginalInvoiceNumberField()) {
        isValid = false;
    }

    return isValid;
}

/**
 * Incrémente le numéro de facture.
 * Supposons que le format est "FA-YYYY-XXX" ou "PREFIX-XXX"
 */
function incrementInvoiceNumber() {
    let currentNumber = DOM.invoiceNumberInput.value;
    const parts = currentNumber.split('-');
    if (parts.length > 1) {
        const lastPart = parts[parts.length - 1];
        const numberMatch = lastPart.match(/^(\d+)$/); // Vérifie si la dernière partie est un nombre pur
        if (numberMatch) {
            let number = parseInt(numberMatch[1], 10);
            number++;
            const newNumberStr = String(number).padStart(lastPart.length, '0');
            parts[parts.length - 1] = newNumberStr;
            DOM.invoiceNumberInput.value = parts.join('-');
        } else {
            console.warn("Le format du numéro de facture ne permet pas une incrémentation automatique simple.");
            alert("Le numéro de facture ne peut pas être incrémenté automatiquement. Format attendu : FA-YYYY-XXX ou PREFIX-XXX.");
        }
    } else {
        // Gérer le cas où il n'y a pas de tiret, ex: "001" devient "002"
        const numberMatch = currentNumber.match(/^(\d+)$/);
        if (numberMatch) {
            let number = parseInt(numberMatch[1], 10);
            number++;
            DOM.invoiceNumberInput.value = String(number).padStart(currentNumber.length, '0');
        } else {
            console.warn("Le format du numéro de facture ne permet pas une incrémentation automatique simple (pas de tiret).");
            alert("Le numéro de facture ne peut pas être incrémenté automatiquement. Format attendu : FA-YYYY-XXX ou XXX.");
        }
    }
}