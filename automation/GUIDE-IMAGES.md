# 🖼️ Guide : Configuration des Images Automatiques

## Vue d'ensemble

Le système récupère automatiquement des images cohérentes avec vos articles en utilisant les **mots-clés générés par Claude AI** pour rechercher des images pertinentes.

## ✨ Fonctionnalité

Le système fonctionne en deux modes :

### Mode 1 : Avec clé API Pexels (RECOMMANDÉ) 🌟

- **Images pertinentes** : Recherche basée sur les mots-clés générés par Claude
- **Qualité** : Images haute résolution adaptées au contenu
- **Coût** : GRATUIT avec limitation de 200 requêtes/heure

### Mode 2 : Sans clé API (Fallback)

- **Images génériques** : Images aléatoires, pas de cohérence avec le contenu
- **Fonctionne** : Oui, mais images non pertinentes

## 🚀 Configuration Pexels (15 minutes)

### Étape 1 : Créer un compte Pexels

Allez sur : **https://www.pexels.com/api/**

Cliquez sur **"Get Started"** ou **"Sign Up"**

### Étape 2 : Remplir le formulaire

- Email
- Mot de passe
- Nom (optionnel)

### Étape 3 : Créer une application

Une fois connecté :
1. Allez sur **https://www.pexels.com/api/new/**
2. Remplissez :
   - **Application Name** : `Arab Press Automation`
   - **Application Description** : `Automatic image generation for Arabic news articles`
   - **Website URL** : `https://arabpress.netlify.app`
   - Acceptez les conditions
3. Cliquez sur **"Create Application"**

### Étape 4 : Récupérer votre clé API

Vous verrez votre **API Key** affichée (commence par plusieurs lettres/chiffres).

Copiez-la immédiatement, vous ne pourrez plus la voir après !

### Étape 5 : Ajouter la clé dans la configuration

Éditez le fichier `automation/config/config.json` :

```json
{
  "pexels": {
    "apiKey": "VOTRE_CLE_PEXELS_ICI",
    "enabled": true
  }
}
```

Remplacez `VOTRE_CLE_PEXELS_ICI` par votre vraie clé API.

## 🎯 Comment ça marche ?

### 1. Claude génère des mots-clés pertinents

Quand Claude crée un article, il génère aussi des mots-clés pour l'image :

```json
{
  "title": "تونس تعلق نشاط المنظمة",
  "imageSearchTerms": "Tunisia government, arab people, middle east politics"
}
```

### 2. Le système recherche des images

Le module `image-fetcher.js` utilise ces mots-clés pour rechercher des images sur Pexels :

```javascript
// Recherche avec les mots-clés de Claude
Recherche Pexels: "Tunisia government"
→ Résultats pertinents : Images de manifestations en Tunisie, gouvernement, etc.
```

### 3. Une image est téléchargée et sauvegardée

L'image est :
- Télé密集ée depuis Pexels
- Sauvegardée dans `public/img/article-{id}.jpg`
- Ajoutée au fichier `data.ts`

## 📝 Exemple concret

### Article sur la Tunisie

**Claude génère** :
```json
{
  "title": "تونس تعلق نشاط المنظمة",
  "imageSearchTerms": "Tunisia government, arab people, protest"
}
```

**Le système recherche** :
```
Pexels API → "Tunisia government"
→ 50 images trouvées de manifestations, bâtiments gouvernementaux, etc.
→ Sélection aléatoire parmi les résultats pertinents
```

**Résultat** :
- Image pertinente (manifestation en Tunisie, bâtiment gouvernemental, etc.)
- Cohérente avec le contenu de l'article
- Haute qualité (1200x630 pixels)

## ⚙️ Configuration avancée

### Changer le nombre d'images recherchées

Dans `automation/modules/image-fetcher.js` :

```javascript
// Ligne ~80
const response = await przy.get('https://api.pexels.com/v1/search', {
  params: {
    query: query,
    per_page: 15,  // ← Modifier ici (max 80)
    orientation: 'landscape',
    size: 'large'
  }
});
```

### Ajouter des mots-clés personnalisés par catégorie

Dans `automation/modules/image-fetcher.js` :

```javascript
const categoryMap = {
  'سياسة': ['arabic politics', 'middle east', 'people', 'government'],
  'اقتصاد': ['economy', 'business', 'financial', 'money', 'trade'],
  // Ajoutez vos catégories ici
};
```

## 🎨 Attribution des images Pexels

Les images de Pexels sont :
- ✅ Gratuites à utiliser
- ✅ Libres de droits
- ✅ Attribution recommandée mais non obligatoire
- ✅ Utilisation commerciale autorisée

### Attribution optionnelle

Si vous voulez créditer les photographes (recommandé) :

Dans vos articles, vous pouvez ajouter :

```markdown
*Photo par [Nom du photographe](https://www.pexels.com/@photographer) sur Pexels*
```

## 📊 Limites Pexels

- **Gratuit** : 200 requêtes/heure
- **Montant mensuel** : ~14 400 requêtes/mois (3 articles/jour)
- **Suffisant** : Oui, largement pour votre usage

## 🔧 Dépannage

### Erreur : "Invalid API Key"

- Vérifiez que la clé est bien dans `config.json`
- Vérifiez qu'il n'y a pas d'espaces avant/après la clé
- Vérifiez que le compte Pexels est actif

### Images non pertinentes

- Vérifiez que `imageGeneration: true` dans `config.json`
- Vérifiez les logs dans `automation/logs/image.log`
- Les mots-clés sont-ils bons ? Claude les génère automatiquement

### Téléchargement échoue

- Vérifiez la connexion internet
- Vérifiez que le dossier `public/img/` existe
- Consultez les logs : `tail -f automation/logs/image.log`

## 💡 Conseils

1. **Testez d'abord en mode dry-run** :
   ```bash
   node automation/main.js --dry-run
   ```

2. **Vérifiez les images générées** :
   ```bash
   ls -lh public/img/
   ```

3. **Consultez les logs** :
   ```bash
   cat automation/logs/image.log
   ```

4. **Pour désactiver les images** :
   Dans `config.json` : `"imageGeneration": false`

## 🎉 Résultat final

Avec la configuration Pexels, chaque article aura :
- Une image pertinente et cohérente avec le contenu
- Haute qualité (1200x630 pixels)
- Optimisée pour le SEO et les réseaux sociaux
- Générée automatiquement sans intervention

**Tout est automatique !** 🚀

