chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "demander_mot_de_passe") {

        // Le lien exact inclut l'endpoint et la longueur par défaut
        const urlNetlify = "https://quantum-password.netlify.app/generer-mot-de-passe?longueur=16";

        fetch(urlNetlify)
            .then(response => {
                if (!response.ok) throw new Error("Erreur réseau API");
                return response.json();
            })
            .then(data => {
                sendResponse({ success: true, password: data.mot_de_passe });
            })
            .catch(error => {
                console.error("Erreur API Background:", error);
                sendResponse({ success: false });
            });

        // Cette ligne est cruciale car elle permet d'utiliser sendResponse de manière asynchrone (après le fetch)
        return true; 
    }
});