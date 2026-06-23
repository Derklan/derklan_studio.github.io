# DERKLAN-STUDIO — Version HTML Pure

Ce projet est une version **100% HTML/CSS/JavaScript pur** qui fonctionne parfaitement sur GitHub Pages sans aucun problème de configuration.

## Structure du Projet

```
studio-html-pure/
├── index.html              # Page d'accueil
├── jeux.html               # Catalogue des jeux
├── jeu.html                # Détail d'un jeu
├── studio.html             # À propos du studio
├── fondateurs.html         # Les fondateurs
├── actualites.html         # Devlog / Actualités
├── article.html            # Détail d'un article
├── presse.html             # Presse et médias
├── contact.html            # Page de contact
├── components/
│   ├── header.html         # Composant de navigation (réutilisable)
│   └── footer.html         # Composant de pied de page (réutilisable)
├── assets/
│   ├── css/
│   │   └── styles.css      # Tous les styles
│   └── js/
│       └── components.js   # Script pour charger les composants
└── README.md               # Ce fichier
```

## Comment ça Fonctionne ?

### Composants Dynamiques

Le header et le footer sont des fichiers HTML séparés (`components/header.html` et `components/footer.html`) qui sont **chargés dynamiquement** via JavaScript dans chaque page.

**Avantages :**
- ✅ Pas de duplication de code
- ✅ Modification du header/footer une seule fois = mise à jour partout
- ✅ Fonctionne sur GitHub Pages sans Jekyll

### Comment Modifier le Header/Footer

1. Ouvrez `components/header.html` ou `components/footer.html`
2. Modifiez le contenu
3. Les modifications s'appliqueront automatiquement à **toutes les pages**

Exemple : Si tu veux ajouter un nouveau lien dans le header, ajoute-le dans `components/header.html` et il apparaîtra sur toutes les pages.

## Déploiement sur GitHub Pages

### Étape 1 : Préparer le Dépôt

1. Crée un dépôt GitHub nommé `Derklan-Studio.github.io`
2. Clone le dépôt sur ton ordinateur
3. Copie tous les fichiers de ce projet dans le dépôt

### Étape 2 : Pousser sur GitHub

```bash
git add .
git commit -m "Initial commit: DERKLAN-STUDIO website"
git push origin main
```

### Étape 3 : Vérifier le Déploiement

1. Va sur ton dépôt GitHub
2. Clique sur **Settings** → **Pages**
3. Assure-toi que la source est définie sur `main` (ou `gh-pages`)
4. Attends 2-3 minutes
5. Visite `https://derklan.github.io/Derklan-Studio.github.io/`

**Tout devrait fonctionner parfaitement !** ✅

## Personnalisation

### Modifier le Titre du Site

Ouvre chaque fichier `.html` et modifie la balise `<title>` :
```html
<title>Nouveau Titre — DERKLAN-STUDIO</title>
```

### Modifier les Couleurs

Ouvre `assets/css/styles.css` et cherche les variables de couleur :
```css
--primary: #a78bfa;  /* Violet */
--dark: #0a0a0a;     /* Noir */
```

### Ajouter des Images

Place tes images dans un dossier `assets/images/` et référence-les :
```html
<img src="./assets/images/mon-image.jpg" alt="Description">
```

## Avantages de cette Approche

| Aspect | Jekyll | HTML Pure |
|--------|--------|-----------|
| Configuration | Complexe | Simple ✅ |
| Chemins relatifs | Problématique | Fonctionne ✅ |
| Composants réutilisables | Oui | Oui ✅ |
| Compatibilité GitHub Pages | Oui | Oui ✅ |
| Temps de déploiement | 5-10 min | 2-3 min ✅ |
| Maintenance | Moyenne | Facile ✅ |

## Support

Si tu as des problèmes :

1. **Ouvre la console du navigateur** (F12) et cherche les erreurs
2. **Vérifie les chemins des fichiers** - Tous les chemins doivent commencer par `./`
3. **Vide le cache** (Ctrl+Shift+Suppr) et recharge la page

## Prochaines Étapes

- [ ] Remplacer les textes placeholder par ton contenu
- [ ] Ajouter des images et des assets
- [ ] Personnaliser les couleurs et les polices
- [ ] Ajouter des formulaires de contact
- [ ] Optimiser pour les moteurs de recherche (SEO)

---

**Créé avec ❤️ pour DERKLAN-STUDIO**
