// js/main.js
// Initialisation de jsPDF globalement (nécessaire car il est chargé via <script> tags)
window.jsPDF = window.jspdf.jsPDF;

// Données globales (pouvant être modifiées par l'import CSV client)
let clientsData = {
    "Udemy Inc": {
        address: "600 Harrison Street 3rd Floor San Francisco, CA 94107 United States",
        siret: "",
        tvaIntra: ""
    },
    "Google Ireland Inc": {
        address: "4 Barrow Street, 99132 Dublin, Irlande",
        siret: "",
        tvaIntra: "IE6388047V"
    }
};

let companyLogoData = null; // Variable pour stocker le Data URL du logo

// Référence directe à l'unique ligne d'article (gérée dans createItemRow)
let singleItemRow = null;

document.addEventListener('DOMContentLoaded', () => {
    // Charger les données depuis localStorage
    loadCompanyDataFromLocalStorage();
    loadExonerationSettingsFromLocalStorage();
    populateClientSelect(); // Peuple le sélecteur de client avec les données initiales/chargées
    loadClientTypeSettingsFromLocalStorage();
    loadCorrectionInvoiceSettingFromLocalStorage();
    loadAutoIncrementInvoiceSettingFromLocalStorage(); // Charger l'état de la nouvelle checkbox

    // Créer la ligne d'article unique
    createItemRow();

    // Attacher tous les écouteurs d'événements
    attachEventListeners();

    // Calculer les totaux initiaux
    calculateTotals();
});