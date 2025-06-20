// js/dom_elements.js
// Cette structure permet un accès facile aux éléments du DOM
// et aide à éviter les fautes de frappe et la duplication de sélecteurs.
const DOM = {
    // Boutons
    generatePdfBtn: document.getElementById('generatePdfBtn'),
    previewPdfBtn: document.getElementById('previewPdfBtn'),
    exportCsvBtn: document.getElementById('exportCsvBtn'),

    // Spans pour les totaux
    subTotalSpan: document.getElementById('subTotal'),
    taxAmountSpan: document.getElementById('taxAmount'),
    grandTotalSpan: document.getElementById('grandTotal'),

    // Prévisualisation PDF
    pdfPreviewDiv: document.getElementById('pdfPreview'),
    pdfFrame: document.getElementById('pdfFrame'),

    // Input de TVA
    tvaInput: document.getElementById('tva'),

    // Informations Société
    companyCsvUpload: document.getElementById('companyCsvUpload'),
    companyLogoInput: document.getElementById('companyLogo'),
    companyNameInput: document.getElementById('companyName'),
    companyAddressInput: document.getElementById('companyAddress'),
    companyTvaIntraInput: document.getElementById('companyTvaIntra'),
    companySiretInput: document.getElementById('companySiret'),
    companyEmailInput: document.getElementById('companyEmail'),

    // Informations Client
    clientCsvUpload: document.getElementById('clientCsvUpload'),
    clientImportCsvWrapper: document.getElementById('clientImportCsvWrapper'),
    isCompanyCheckbox: document.getElementById('isCompanyCheckbox'),
    clientNameSelect: document.getElementById('clientNameSelect'),
    clientNameInput: document.getElementById('clientNameInput'),
    clientNameWrapper: document.getElementById('clientNameWrapper'), // Conteneur du select/input
    clientAddressInput: document.getElementById('clientAddress'),
    companyClientFieldsDiv: document.getElementById('companyClientFields'),
    clientSiretInput: document.getElementById('clientSiret'),
    clientTvaIntraInput: document.getElementById('clientTvaIntra'),
    individualClientFieldsDiv: document.getElementById('individualClientFields'),
    clientPhoneInput: document.getElementById('clientPhone'),
    clientEmailInput: document.getElementById('clientEmail'),

    // Détails de la Facture
    invoiceNumberInput: document.getElementById('invoiceNumber'),
    invoiceDateInput: document.getElementById('invoiceDate'),
    autoIncrementInvoiceNumberCheckbox: document.getElementById('autoIncrementInvoiceNumber'), // Nouvelle checkbox
    isCorrectionInvoiceCheckbox: document.getElementById('isCorrectionInvoice'),
    originalInvoiceNumberGroup: document.getElementById('originalInvoiceNumberGroup'),
    originalInvoiceNumberInput: document.getElementById('originalInvoiceNumber'),

    // Articles (conteneur)
    itemsContainer: document.getElementById('itemsContainer'),

    // Obligations légales / TVA
    mentionsLegalesTextarea: document.getElementById('mentionsLegales'),
    showExonerationTvaCheckbox: document.getElementById('showExonerationTva'),
    exonerationTvaTextarea: document.getElementById('exonerationTvaText'),

    // Import/Export Facture
    invoiceCsvUpload: document.getElementById('invoiceCsvUpload')
};