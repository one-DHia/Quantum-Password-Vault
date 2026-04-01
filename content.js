/**
 * content.js
 * Ce script est injecté dans toutes les pages web visitées.
 * Il scanne les champs avec le type "password" et ajoute une pastille 'Q' pour l'auto-remplissage.
 */

function injectQuantumButton(input) {
    // Évite d'injecter plusieurs fois
    if (input.dataset.quantumVaultInjected) return;
    input.dataset.quantumVaultInjected = "true";

    // Assure que le parent direct est en position 'relative' ou 'absolute'
    // C'est vital pour que notre bouton absolu se positionne à côté du champ !
    const parentPos = window.getComputedStyle(input.parentNode).position;
    if (parentPos === 'static') {
        input.parentNode.style.position = 'relative';
    }

    // Création du bouton Q
    const qBtn = document.createElement('button');
    qBtn.textContent = 'Q';
    qBtn.title = "Générer un mot de passe Quantique";
    
    // Style du petit bouton néon
    qBtn.style.cssText = `
        position: absolute;
        z-index: 2147483647; /* Typiquement pour être au dessus de tout */
        background: linear-gradient(135deg, #8a2be2, #00f0ff);
        border: none;
        color: white;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        font-weight: 800;
        cursor: pointer;
        font-family: sans-serif;
        font-size: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0;
        box-shadow: 0 0 8px rgba(0, 240, 255, 0.6);
        transition: transform 0.2s, box-shadow 0.2s;
        /* Position sur le côté droit, à l'intérieur de l'input */
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
    `;

    // Hover Effet (avec écouteurs JS car c'est du style inline)
    qBtn.addEventListener('mouseenter', () => { qBtn.style.transform = 'translateY(-50%) scale(1.1)'; });
    qBtn.addEventListener('mouseleave', () => { qBtn.style.transform = 'translateY(-50%) scale(1)'; });

    // Insertion juste après l'input
    input.parentNode.insertBefore(qBtn, input.nextSibling);

    // Click => Génération + Remplissage automatique
    // Click => Demande au background script
    qBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation(); // Évite tout submit du formulaire accidentel
        
        qBtn.textContent = "⏳"; 

        // On demande au background.js d'aller chercher le mot de passe
        chrome.runtime.sendMessage({ action: "demander_mot_de_passe" }, (response) => {
            if (response && response.success) {
                // Remplissage du champ (en utilisant nos variables qBtn et input existantes)
                input.value = response.password;
                qBtn.textContent = "✓"; 
                
                // On notifie les frameworks React/Vue du changement
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                
                // Remise à l'état initial
                setTimeout(() => { qBtn.textContent = 'Q'; }, 2000);
            } else {
                qBtn.textContent = "❌"; 
                setTimeout(() => { qBtn.textContent = 'Q'; }, 2000);
            }
        });
    });
}

// Fonction globale d'inspection de la page
function scanForPasswords() {
    const inputs = document.querySelectorAll('input[type="password"]');
    inputs.forEach(input => injectQuantumButton(input));
}

// Scanne dès le chargement
scanForPasswords();

// Puisque de nos jours les sites sont dynamiques (SPA React/Vue), 
// on utilise un MutationObserver pour surveiller si de nouveaux champs de mot de passe apparaissent.
const observer = new MutationObserver((mutations) => {
    let shouldScan = false;
    for (let mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
            shouldScan = true;
            break;
        }
    }
    if (shouldScan) {
        scanForPasswords();
    }
});

// Observation sur tout le corps du site
observer.observe(document.body, { childList: true, subtree: true });
