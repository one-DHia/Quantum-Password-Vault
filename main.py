import string
import secrets
import httpx
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

# 1. Initialisation de l'API
app = FastAPI(
    title="Quantum Password Vault",
    description="API de génération de mots de passe utilisant le hasard quantique.",
    version="1.0.0"
)

# 2. Sécurité - CORS (Cross-Origin Resource Sharing)
# Autorise votre futur frontend à communiquer avec cette API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # /!\ En production, remplacez "*" par ["https://mon-site-web.com"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Dictionnaire de caractères disponible
# Majuscules, minuscules, nombres et une sélection robuste de symboles.
CARACTERES = string.ascii_letters + string.digits + "!@#$%^&*()-_=+[]{}|;:,.<>?"
NB_CARACTERES = len(CARACTERES)


async def obtenir_nombres_quantiques(quantite: int) -> list[int]:
    """
    Interroge l'API publique de l'ANU (Australian National University) 
    pour récupérer de vrais nombres aléatoires générés via les fluctuations quantiques du vide.
    """
    url = f"https://qrng.anu.edu.au/API/jsonI.php?length={quantite}&type=uint8"
    async with httpx.AsyncClient() as client:
        try:
            # Timeout très court (3 secondes) pour éviter de bloquer le serveur
            # si l'API australienne est lente ou hors ligne.
            response = await client.get(url, timeout=3.0)
            response.raise_for_status()
            data = response.json()
            if data and data.get("success"):
                return data.get("data", [])
            else:
                return []
        except Exception as e:
            # En cas de problème (timeout, erreur 500), on retourne une liste vide 
            # pour enclencher automatiquement le Fallback de sécurité.
            print(f"[Attention] L'API Quantique est indisponible : {e}")
            return []


@app.get("/generer-mot-de-passe")
async def generer_mot_de_passe(
    longueur: int = Query(16, ge=12, description="Longueur du mot de passe (min 12 pour contrer la force brute)")
):
    """
    Génère le mot de passe incassable à l'aide de nombres quantiques purs.
    """
    
    # SÉCURITÉ AVANCÉE : Prévention du "Biais Modulo" (Modulo Bias)
    limite_sans_biais = (256 // NB_CARACTERES) * NB_CARACTERES 

    mot_de_passe = ""
    source_entropie = "Quantique (ANU QRNG)"
    
    # On demande le double de nombres quantiques à l'API afin de palier 
    # aux nombres jetés par la protection du biais modulo.
    quantite_demandee = longueur * 2
    nombres_quantiques = await obtenir_nombres_quantiques(quantite_demandee)
    
    if nombres_quantiques:
        # Phase Quantique
        for n in nombres_quantiques:
            if len(mot_de_passe) == longueur:
                break  # Taille requise atteinte
            
            # Application de la technique du rejet pour contourner le biais
            if n < limite_sans_biais:
                index = n % NB_CARACTERES
                mot_de_passe += CARACTERES[index]
                
        # Si après la distribution on a eu trop de rejets et qu'il manque des caractères...
        while len(mot_de_passe) < longueur:
            source_entropie = "Hybride (Quantique + Fallback CSPRNG)"
            mot_de_passe += secrets.choice(CARACTERES)
            
    else:
        # Phase Fallback : L'API Quantique n'a pas répondu.
        source_entropie = "Pseudo-aléatoire cryptographique (CSPRNG natif Fallback)"
        mot_de_passe = "".join(secrets.choice(CARACTERES) for _ in range(longueur))

    return {
        "mot_de_passe": mot_de_passe,
        "longueur": longueur,
        "niveau_securite": "Résistant aux attaques quantiques",
        "source": source_entropie
    }
