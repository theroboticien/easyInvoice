// js/local_storage.js
// Clés pour le localStorage
const COMPANY_DATA_KEY = 'influencerEasyInvoiceCompanyData';
const COMPANY_LOGO_KEY = 'influencerEasyInvoiceCompanyLogo';
const EXONERATION_SETTINGS_KEY = 'influencerEasyInvoiceExonerationSettings';
const CLIENT_TYPE_SETTINGS_KEY = 'influencerEasyInvoiceClientTypeSettings';
const CORRECTION_INVOICE_KEY = 'influencerEasyInvoiceCorrectionInvoice';
const ORIGINAL_INVOICE_NUMBER_KEY = 'influencerEasyInvoiceOriginalInvoiceNumber';
const AUTO_INCREMENT_INVOICE_KEY = 'influencerEasyInvoiceAutoIncrementInvoice'; // Nouvelle clé

/**
 * Sauvegarde les données textuelles de la société dans le localStorage.
 */
function saveCompanyTextDataToLocalStorage() {
    const companyData = {
        name: DOM.companyNameInput.value,
        address: DOM.companyAddressInput.value,
        tvaIntra: DOM.companyTvaIntraInput.value,
        siret: DOM.companySiretInput.value,
        email: DOM.companyEmailInput.value
    };
    localStorage.setItem(COMPANY_DATA_KEY, JSON.stringify(companyData));
}

/**
 * Charge les données de la société (texte et logo) depuis le localStorage.
 */
function loadCompanyDataFromLocalStorage() {
    const storedData = localStorage.getItem(COMPANY_DATA_KEY);
    if (storedData) {
        try {
            const companyData = JSON.parse(storedData);
            DOM.companyNameInput.value = companyData.name || '';
            DOM.companyAddressInput.value = companyData.address || '';
            DOM.companyTvaIntraInput.value = companyData.tvaIntra || '';
            DOM.companySiretInput.value = companyData.siret || '';
            DOM.companyEmailInput.value = companyData.email || '';
        } catch (e) {
            console.error("Erreur de parsing des données société depuis localStorage:", e);
            localStorage.removeItem(COMPANY_DATA_KEY);
        }
    }

    const storedLogo = localStorage.getItem(COMPANY_LOGO_KEY);
    if (storedLogo) {
        companyLogoData = storedLogo; // companyLogoData est une variable globale dans main.js
    }
}

/**
 * Sauvegarde les paramètres d'exonération de TVA dans le localStorage.
 */
function saveExonerationSettingsToLocalStorage() {
    const settings = {
        show: DOM.showExonerationTvaCheckbox.checked,
        text: DOM.exonerationTvaTextarea.value
    };
    localStorage.setItem(EXONERATION_SETTINGS_KEY, JSON.stringify(settings));
}

/**
 * Charge les paramètres d'exonération de TVA depuis le localStorage.
 */
function loadExonerationSettingsFromLocalStorage() {
    const storedSettings = localStorage.getItem(EXONERATION_SETTINGS_KEY);
    if (storedSettings) {
        try {
            const settings = JSON.parse(storedSettings);
            DOM.showExonerationTvaCheckbox.checked = settings.show ?? true; // Default to true if not found
            DOM.exonerationTvaTextarea.value = settings.text || "Exonération de TVA, article 283-2 du Code général des impôts";
        } catch (e) {
            console.error("Erreur de parsing des paramètres d'exonération depuis localStorage:", e);
            localStorage.removeItem(EXONERATION_SETTINGS_KEY);
        }
    }
}

/**
 * Sauvegarde les paramètres du type de client (société/particulier) et ses infos dans le localStorage.
 */
function saveClientTypeSettingsToLocalStorage() {
    const settings = {
        isCompany: DOM.isCompanyCheckbox.checked,
        clientName: DOM.isCompanyCheckbox.checked ? DOM.clientNameSelect.value : DOM.clientNameInput.value,
        clientAddress: DOM.clientAddressInput.value,
        clientPhone: DOM.clientPhoneInput.value,
        clientEmail: DOM.clientEmailInput.value
    };
    localStorage.setItem(CLIENT_TYPE_SETTINGS_KEY, JSON.stringify(settings));
}

/**
 * Charge les paramètres du type de client et ses infos depuis le localStorage.
 * Appelle `toggleClientFields` après le chargement.
 */
function loadClientTypeSettingsFromLocalStorage() {
    const storedSettings = localStorage.getItem(CLIENT_TYPE_SETTINGS_KEY);
    if (storedSettings) {
        try {
            const settings = JSON.parse(storedSettings);
            DOM.isCompanyCheckbox.checked = settings.isCompany ?? true; // Default to true
            if (DOM.isCompanyCheckbox.checked) {
                DOM.clientNameSelect.value = settings.clientName || '';
            } else {
                DOM.clientNameInput.value = settings.clientName || '';
            }
            DOM.clientAddressInput.value = settings.clientAddress || '';
            DOM.clientPhoneInput.value = settings.clientPhone || '';
            DOM.clientEmailInput.value = settings.clientEmail || '';
            toggleClientFields(); // S'assurer que les champs sont corrects après le chargement
        } catch (e) {
            console.error("Erreur de parsing des paramètres de type client depuis localStorage:", e);
            localStorage.removeItem(CLIENT_TYPE_SETTINGS_KEY);
        }
    } else {
        toggleClientFields(); // Appliquer l'état par défaut si rien n'est stocké
    }
}

/**
 * Sauvegarde l'état de la checkbox "Facture corrective" et le numéro de facture originale.
 */
function saveCorrectionInvoiceSettingToLocalStorage() {
    localStorage.setItem(CORRECTION_INVOICE_KEY, DOM.isCorrectionInvoiceCheckbox.checked.toString());
    localStorage.setItem(ORIGINAL_INVOICE_NUMBER_KEY, DOM.originalInvoiceNumberInput.value);
}

/**
 * Charge l'état de la checkbox "Facture corrective" et le numéro de facture originale.
 * Appelle `toggleOriginalInvoiceNumberField` après le chargement.
 */
function loadCorrectionInvoiceSettingFromLocalStorage() {
    const storedSetting = localStorage.getItem(CORRECTION_INVOICE_KEY);
    if (storedSetting !== null) {
        DOM.isCorrectionInvoiceCheckbox.checked = (storedSetting === 'true');
    }
    const storedOriginalNumber = localStorage.getItem(ORIGINAL_INVOICE_NUMBER_KEY);
    DOM.originalInvoiceNumberInput.value = storedOriginalNumber || '';
    toggleOriginalInvoiceNumberField(); // S'assurer que la visibilité est correcte au chargement
}

/**
 * Sauvegarde l'état de la checkbox d'incrémentation automatique du numéro de facture.
 */
function saveAutoIncrementInvoiceSettingToLocalStorage() {
    localStorage.setItem(AUTO_INCREMENT_INVOICE_KEY, DOM.autoIncrementInvoiceNumberCheckbox.checked.toString());
}

/**
 * Charge l'état de la checkbox d'incrémentation automatique du numéro de facture.
 */
function loadAutoIncrementInvoiceSettingFromLocalStorage() {
    const storedSetting = localStorage.getItem(AUTO_INCREMENT_INVOICE_KEY);
    // Par défaut, la checkbox est désactivée si rien n'est stocké ou si la valeur est 'false'
    DOM.autoIncrementInvoiceNumberCheckbox.checked = (storedSetting === 'true');
}