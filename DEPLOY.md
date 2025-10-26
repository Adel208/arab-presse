# Guide de Déploiement

## 🚀 Le site est prêt pour le déploiement !

Tous les fichiers ont été préparés et committés localement. Il ne reste plus qu'à pousser vers GitHub.

## 📦 Fichiers de configuration créés

✅ **netlify.toml** - Configuration Netlify
✅ **public/_redirects** - Gestion du routing React
✅ **Git initialisé** avec tous les fichiers
✅ **Commit créé** : "Initial commit: Arabic news portal with Gabès article and optimized images"

## 🔐 Étape 1 : Pousser vers GitHub

Le repository Git est configuré mais nécessite vos credentials. Exécutez cette commande :

```bash
cd /Users/admin/Desktop/arab
git push -u origin main
```

Vous serez invité à entrer vos identifiants GitHub :
- **Username** : Adel208
- **Password** : Utilisez un **Personal Access Token** (pas votre mot de passe)

### Créer un Personal Access Token

1. Allez sur GitHub : https://github.com/settings/tokens
2. Cliquez sur "Generate new token" → "Generate new token (classic)"
3. Donnez un nom : "Arab Presse Deploy"
4. Cochez : `repo` (accès complet)
5. Cliquez sur "Generate token"
6. **Copiez le token** (vous ne le verrez qu'une fois)
7. Utilisez-le comme mot de passe lors du push

## 🌐 Étape 2 : Déployer sur Netlify

### Option A : Via l'interface web (Recommandé)

1. Allez sur [https://app.netlify.com](https://app.netlify.com)
2. Connectez-vous ou créez un compte
3. Cliquez sur **"Add new site"** → **"Import an existing project"**
4. Choisissez **GitHub** et autorisez Netlify
5. Sélectionnez le repository **Adel208/arab-presse**
6. Configuration automatique (Netlify détectera `netlify.toml`)
7. Cliquez sur **"Deploy site"**

### Option B : Via Netlify CLI

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter
netlify login

# Déployer
netlify deploy --prod
```

## 📝 Configuration Netlify

Les paramètres sont déjà configurés dans `netlify.toml` :
- **Build command** : `npm run build`
- **Publish directory** : `dist`
- **Redirects** : Configurés pour React Router

## ✅ Vérification après déploiement

Une fois déployé, votre site sera accessible sur une URL type :
```
https://votre-site.netlify.app
```

Testez :
- ✅ Page d'accueil : `/`
- ✅ Article Gabès : `/article/7`
- ✅ Filtres par catégorie
- ✅ Recherche d'articles
- ✅ Images optimisées WebP

## 🔧 Mises à jour futures

Pour mettre à jour le site :

```bash
# Faire vos modifications
git add .
git commit -m "Description des changements"
git push origin main
```

Netlify redéploiera automatiquement !

## 📊 Contenu du site

- **7 articles** dont l'article complet sur Gabès
- **Image optimisée** (WebP, 49KB)
- **6 catégories** : سياسة, اقتصاد, رياضة, تكنولوجيا, ثقافة, بيئة
- **Responsive** : Desktop, Tablette, Mobile
- **SEO optimisé** : Meta tags, descriptions, keywords

## 🎯 URLs du projet

- **Repository GitHub** : https://github.com/Adel208/arab-presse
- **Site Netlify** : (sera généré après déploiement)
- **Local** : http://localhost:5173

## 💡 Domaine personnalisé (Optionnel)

Pour ajouter un domaine personnalisé sur Netlify :
1. Allez dans les paramètres du site
2. "Domain management" → "Add custom domain"
3. Suivez les instructions pour configurer le DNS

---

**Besoin d'aide ?** Consultez la [documentation Netlify](https://docs.netlify.com/)

