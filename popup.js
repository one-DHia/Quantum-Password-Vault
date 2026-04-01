document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('slider');
    const sliderVal = document.getElementById('slider-val');
    const btnGenerate = document.getElementById('btn-generate');
    const resultInput = document.getElementById('result-input');
    const btnCopy = document.getElementById('btn-copy');
    const sourceInfo = document.getElementById('source-info');

    const copyIconSvg = '<svg viewBox="0 0 24 24"><path d="M16 1H4C2.9 1 2 1.9 2 3v14h2V3h12V1zm3 4H8C6.9 5 6 5.9 6 7v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>';

    slider.addEventListener('input', (e) => {
        sliderVal.textContent = e.target.value;
    });

    btnGenerate.addEventListener('click', async () => {
        const length = slider.value;
        
        btnGenerate.disabled = true;
        btnGenerate.textContent = "Connexion...";
        resultInput.value = "";
        sourceInfo.textContent = "...";
        sourceInfo.style.color = "var(--text-muted)";

        try {
            // Appel direct à votre API distante (Netlify via FastAPI)
            const response = await fetch(`https://quantum-password.netlify.app/generer-mot-de-passe?longueur=${length}`);
            
            if (!response.ok) throw new Error("Erreur réseau");
            
            const data = await response.json();
            
            resultInput.value = data.mot_de_passe;
            sourceInfo.textContent = data.source;
            
            if (data.source.includes('Quantique')) {
                sourceInfo.style.color = "var(--neon-blue)";
            } else if (data.source.includes('Hybride')) {
                sourceInfo.style.color = "var(--neon-purple)";
            } else {
                sourceInfo.style.color = "#ffaa00";
            }
            
        } catch (error) {
            console.error("Erreur Fetch:", error);
            resultInput.placeholder = "Erreur !";
            sourceInfo.textContent = "Serveur injoignable";
            sourceInfo.style.color = "#ff4444";
        } finally {
            btnGenerate.disabled = false;
            btnGenerate.textContent = "Générer (Quantique)";
        }
    });

    btnCopy.addEventListener('click', async () => {
        const pwd = resultInput.value;
        if (!pwd) return;

        try {
            await navigator.clipboard.writeText(pwd);
            btnCopy.innerHTML = "<span style='font-size:10px; font-weight:bold; color:var(--neon-blue);'>Copié</span>";
            
            setTimeout(() => {
                btnCopy.innerHTML = copyIconSvg;
            }, 1500);
        } catch (err) {
            console.error('Erreur Copie', err);
        }
    });
});
