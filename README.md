# بوابة الأخبار العربية

Portail d'actualités en langue arabe avec interface moderne et responsive.

## 🚀 Démarrage rapide

### Installation des dépendances

```bash
npm install
```

### Lancement en mode développement

```bash
npm run dev
```

Le site sera accessible à l'adresse : `http://localhost:5173`

### Construction pour la production

```bash
npm run build
```

### Prévisualisation de la version de production

```bash
npm run preview
```

## 📋 Fonctionnalités

- Interface en arabe avec support RTL
- Recherche en temps réel dans les articles
- Filtrage par catégories (سياسة, اقتصاد, رياضة, تكنولوجيا, ثقافة, بيئة)
- Navigation vers les articles complets
- Design responsive avec Tailwind CSS
- Animation et transitions fluides
- Articles complets avec formatage markdown
- SEO optimisé avec meta tags

## 🛠️ Technologies utilisées

- React 18
- React Router DOM
- TypeScript
- Vite
- Tailwind CSS
- PostCSS

## 📁 Structure du projet

```
arab/
├── index.html
├── src/
│   ├── App.tsx              # Router principal
│   ├── Home.tsx             # Page d'accueil
│   ├── ArticleDetail.tsx    # Page de détail article
│   ├── data.ts              # Données des articles
│   ├── types.ts             # Types TypeScript
│   ├── main.tsx             # Point d'entrée
│   └── index.css            # Styles Tailwind
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── vercel.json              # Config Vercel
```

## 🌐 Déploiement

### Option 1 : Déploiement sur Vercel (Recommandé)

Le projet est configuré pour un déploiement automatique sur Vercel.

#### Méthode 1 : Déploiement via GitHub

1. Créez un repository GitHub et poussez votre code :
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/votre-username/arabic-news-portal.git
git push -u origin main
```

2. Allez sur [Vercel](https://vercel.com) et connectez votre compte GitHub
3. Cliquez sur "New Project" et importez votre repository
4. Vercel détectera automatiquement la configuration et déploiera le projet
5. Votre site sera disponible à l'adresse : `https://votre-projet.vercel.app`

#### Méthode 2 : Déploiement via CLI Vercel

```bash
npm install -g vercel
vercel
```

### Option 2 : Déploiement sur Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Option 3 : Déploiement sur GitHub Pages

Ajoutez ce script dans `package.json` :
```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

Puis exécutez :
```bash
npm run deploy
```

## 📝 Articles

Le site contient plusieurs articles, notamment :
- Article spécial : **قابس تختنق** - Crise environnementale en Tunisie
- Articles de démonstration dans différentes catégories

### Ajouter un nouvel article

Modifiez le fichier `src/data.ts` et ajoutez une entrée dans le tableau `newsData` :

```typescript
{
  id: 8,
  title: 'Titre de l\'article',
  summary: 'Résumé court...',
  category: 'بيئة',
  date: '2025-01-16',
  metaDescription: 'Description meta...',
  keywords: 'mots clés',
  content: `## Contenu de l'article...
### Sous-section
Texte de l'article...`
}
```

## 🔧 Configuration

- **Framework** : React 18 avec TypeScript
- **Build tool** : Vite
- **Styling** : Tailwind CSS
- **Routing** : React Router DOM
- **Direction** : RTL pour l'arabe

## 📄 Licence

Tous droits réservés © 2023 بوابة الأخبار العربية

