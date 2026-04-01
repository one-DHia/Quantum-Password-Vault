# 🌌 Quantum Password Vault

Quantum Password Vault est un générateur de mots de passe incassables qui utilise le hasard quantique véritable (via l'API publique QRNG de l'Australian National University) plutôt que la génération pseudo-aléatoire classique.

## 🚀 Fonctionnalités

- **Hasard Quantique** : Utilise les fluctuations quantiques du vide pour obtenir une entropie parfaite.
- **Sécurité Anti-Biais** : Implémentation mathématique (technique du rejet) empêchant le "biais modulo" lors de la sélection des caractères.
- **Fallback Sécurisé** : En cas de non-réponse de l'API quantique de l'ANU, le système bascule sur un générateur pseudo-aléatoire cryptographiquement sûr (`secrets` du CSPRNG de l'OS).
- **Interface Premium** : Un front-end "Glassmorphism" élégant (HTML, CSS, JS pannel).

## 📂 Structure du projet

- `main.py` : Serveur Backend (Python, FastAPI) gérant la logique cryptographique.
- `index.html` : Interface Utilisateur Web (HTML, CSS, JavaScript).
- `requirements.txt` : Liste des dépendances Python requises.

## ⚙️ Installation

1. Assurez-vous d'avoir [Python 3.8+](https://www.python.org/) installé sur votre machine.
2. Installez les dépendances nécessaires via `pip` en vous plaçant dans le dossier du projet :

```bash
pip install -r requirements.txt
```

## 🖥 Démarrage et Utilisation

1. **Lancez l'API (Backend)** à l'aide de Uvicorn :

```bash
uvicorn main:app --reload
```
(*Le serveur devrait vous indiquer : `Uvicorn running on http://127.0.0.1:8000`*)

2. **Ouvrez le Coffre-fort (Frontend)** :
Double-cliquez directement sur le fichier **`index.html`** pour l'ouvrir dans n'importe quel navigateur web récent (Chrome, Firefox, Safari).

3. **Générez votre clé** :
Ajustez la longueur voulue via le slider et cliquez sur le bouton pour déclencher l'entrelacement. Le mot de passe vous sera servi, ainsi que l'origine exacte de l'entropie utilisée pour créer votre mot de passe.

## 🧬 Pourquoi le Quantique ?

La plupart des mots de passe générés par les logiciels et OS classiques utilisent du "hasard algorithmique" (PRNG/CSPRNG). Bien que très sûr, cela reste une suite mathématique en théorie prédictible si on possède les paramètres initiaux (seed).
Cette application utilise les pings de l'API de l'ANU qui s'appuie sur le bruit quantique fondamental, offrant pour le coup une **entropie physique et mesurée, purement imprévisible**.

---
*Développé dans un but de cyber-résilience et de démonstration cryptographique.*
