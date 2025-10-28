# 🤖 Système d'Automatisation du Journal Arabe

Système complet d'automatisation pour votre journal en ligne, alimenté par Claude AI d'Anthropic.

## 🎯 Fonctionnalités

Ce système automatise entièrement la gestion de votre journal :

1. **Veille Automatique** - Récupère les dernières actualités du monde arabe depuis plusieurs sources RSS
2. **Génération d'Articles** - Crée des articles professionnels en arabe avec Claude AI
3. **Optimisation SEO** - Génère automatiquement les meta descriptions, mots-clés et slugs
4. **Publication Automatique** - Ajoute les articles à votre site et déclenche le build
5. **Partage Social** - Publie automatiquement sur Twitter, Facebook et LinkedIn
6. **Déploiement** - Commit et push vers GitHub pour déclenchement Netlify

## 📋 Prérequis

- Node.js 18+ installé
- Compte Anthropic avec clé API (https://console.anthropic.com/)
- Optionnel : Comptes API pour les réseaux sociaux (Twitter, Facebook, LinkedIn)
- Git configuré pour votre repository

## 🚀 Installation

### 1. Installer les dépendances

```bash
cd automation
npm install
```

Cela installera automatiquement :
- `@anthropic-ai/sdk` - SDK officiel Anthropic pour Claude
- `rss-parser` - Parseur RSS pour la veille automatique
- `axios` - Client HTTP pour les requêtes API
- `node-cron` - Scheduler pour l'automatisation
- `twitter-api-v2` - API Twitter (optionnel)

### 2. Configuration de base

Éditez le fichier [config/config.json](./config/config.json) :

```json
{
  "anthropic": {
    "apiKey": "VOTRE_CLE_API_ANTHROPIC",
    "model": "claude-3-5-sonnet-20241022"
  }
}
```

**Important** : Remplacez `VOTRE_CLE_API_ANTHROPIC` par votre vraie clé API obtenue sur https://console.anthropic.com/

### 3. Configuration avancée (optionnelle)

#### Sources de News

Par défaut, le système utilise :
- Al Jazeera Arabic
- BBC Arabic
- France 24 Arabic

Vous pouvez ajouter d'autres sources RSS dans `config.json` :

```json
{
  "newsSources": [
    {
      "name": "Nom de la source",
      "url": "https://example.com/feed.xml",
      "type": "rss"
    }
  ]
}
```

#### Réseaux Sociaux

Pour activer le partage automatique, configurez vos clés API :

**Twitter/X** :
```json
{
  "social": {
    "twitter": {
      "enabled": true,
      "apiKey": "votre_api_key",
      "apiSecret": "votre_api_secret",
      "accessToken": "votre_access_token",
      "accessTokenSecret": "votre_access_token_secret"
    }
  }
}
```

**Facebook** :
```json
{
  "facebook": {
    "enabled": true,
    "pageId": "votre_page_id",
    "accessToken": "votre_page_access_token"
  }
}
```

**LinkedIn** :
```json
{
  "linkedin": {
    "enabled": true,
    "accessToken": "votre_access_token"
  }
}
```

## 💻 Utilisation

### Mode Manuel - Exécution Unique

Pour tester le système ou lancer une publication ponctuelle :

```bash
# Exécution complète
node automation/main.js

# Mode test (sans modifications)
node automation/main.js --dry-run

# Sans partage social
node automation/main.js --skip-social

# Sans commit Git
node automation/main.js --skip-git

# Aide
node automation/main.js --help
```

### Mode Automatique - Scheduler

Pour une automatisation quotidienne continue :

```bash
# Planification par défaut (3 fois par jour: 8h, 14h, 20h)
node automation/scheduler.js start

# Personnalisé avec horaires spécifiques
node automation/scheduler.js start --morning --evening

# Toutes les 6 heures
node automation/scheduler.js start --interval 6

# Test immédiat
node automation/scheduler.js test

# Aide
node automation/scheduler.js --help
```

### Lancer en Arrière-Plan

Pour que le scheduler tourne en permanence :

```bash
# Linux/macOS
nohup node automation/scheduler.js start > /dev/null 2>&1 &

# Ou avec PM2 (recommandé)
npm install -g pm2
pm2 start automation/scheduler.js --name "journal-automation"
pm2 save
pm2 startup
```

## 📂 Structure des Fichiers

```
automation/
├── config/
│   └── config.json           # Configuration principale
├── modules/
│   ├── news-scraper.js       # Module de veille automatique
│   ├── article-generator.js  # Générateur d'articles IA
│   ├── publisher.js          # Système de publication
│   └── social-publisher.js   # Partage sur réseaux sociaux
├── logs/                     # Logs d'exécution
│   ├── main.log             # Log principal
│   ├── scraper.log          # Log du scraper
│   ├── generator.log        # Log du générateur
│   ├── publisher.log        # Log de publication
│   ├── social.log           # Log des réseaux sociaux
│   ├── latest-news.json     # Dernières news récupérées
│   └── generated-articles.json  # Articles générés
├── main.js                   # Script principal
├── scheduler.js              # Scheduler automatique
├── package.json             # Dépendances Node.js
└── README.md                # Cette documentation
```

## 🔄 Workflow Complet

Voici ce qui se passe lors d'une exécution :

```
1. 🔍 VEILLE AUTOMATIQUE
   ├─ Récupère les flux RSS de toutes les sources
   ├─ Filtre les actualités pertinentes pour le monde arabe
   ├─ Score et classe par pertinence
   └─ Sélectionne les top N articles (défini dans config)

2. ✍️ GÉNÉRATION D'ARTICLES
   ├─ Envoie chaque news à Claude AI
   ├─ Génère un article professionnel complet en arabe
   ├─ Optimise pour le SEO (meta, keywords, slug)
   └─ Sauvegarde les articles générés

3. 📰 PUBLICATION SUR LE SITE
   ├─ Lit le fichier src/data.ts
   ├─ Ajoute les nouveaux articles avec IDs auto-incrémentés
   ├─ Sauvegarde les modifications
   └─ Crée un backup de sécurité

4. 🔨 BUILD DU SITE
   ├─ Exécute npm run build
   ├─ Génère les pages HTML statiques
   └─ Met à jour le sitemap

5. 📱 PARTAGE SOCIAL
   ├─ Formate les posts pour chaque réseau
   ├─ Publie sur Twitter/X
   ├─ Publie sur Facebook
   └─ Publie sur LinkedIn

6. 📤 DÉPLOIEMENT
   ├─ git add src/data.ts public/
   ├─ git commit avec message descriptif
   ├─ git push vers GitHub
   └─ Netlify détecte et déploie automatiquement

7. ✅ TERMINÉ
   └─ Logs détaillés et rapports générés
```

## 📊 Monitoring et Logs

Tous les logs sont enregistrés dans le dossier `automation/logs/` :

```bash
# Voir le log principal
tail -f automation/logs/main.log

# Voir les dernières news récupérées
cat automation/logs/latest-news.json

# Voir les articles générés
cat automation/logs/generated-articles.json
```

## 🛠️ Personnalisation

### Limites Quotidiennes

Dans `config.json` :

```json
{
  "automation": {
    "dailyLimit": 3,        // Nombre max d'articles par exécution
    "minInterval": 8        // Intervalle minimum entre publications (heures)
  }
}
```

### Catégories

Modifiez les catégories disponibles :

```json
{
  "automation": {
    "categories": ["سياسة", "اقتصاد", "رياضة", "تكنولوجيا", "ثقافة", "بيئة"]
  }
}
```

### Modèle Claude

Changez le modèle utilisé :

```json
{
  "anthropic": {
    "model": "claude-3-5-sonnet-20241022"  // ou "claude-3-opus-20240229"
  }
}
```

## ⚡ Conseils et Bonnes Pratiques

### 1. Testez d'abord en mode Dry Run

```bash
node automation/main.js --dry-run
```

Cela vous permet de voir ce qui sera généré sans modifier votre site.

### 2. Commencez sans les réseaux sociaux

Lors des premiers tests, désactivez les réseaux sociaux dans la config :

```json
{
  "social": {
    "twitter": { "enabled": false },
    "facebook": { "enabled": false },
    "linkedin": { "enabled": false }
  }
}
```

### 3. Surveillez vos Quotas API

- **Anthropic Claude** : Surveillez votre usage sur https://console.anthropic.com/
- Chaque article généré consomme ~8000 tokens (~$0.10-0.20)
- Limitez `dailyLimit` pour contrôler les coûts

### 4. Sauvegardez Régulièrement

Le système crée des backups automatiques, mais pensez à :

```bash
# Backup manuel de data.ts
cp src/data.ts src/data.ts.backup-$(date +%Y%m%d)
```

### 5. Utilisez PM2 pour la Production

PM2 redémarre automatiquement le processus en cas de crash :

```bash
pm2 start automation/scheduler.js --name journal
pm2 logs journal        # Voir les logs
pm2 restart journal     # Redémarrer
pm2 stop journal        # Arrêter
```

## 🐛 Dépannage

### Erreur : "API Key invalide"

- Vérifiez que votre clé API Anthropic est correcte dans `config.json`
- Vérifiez sur https://console.anthropic.com/ que votre compte est actif

### Erreur : "Impossible de lire data.ts"

- Vérifiez que le chemin dans `config.json` est correct
- Le chemin doit être relatif à la racine du projet : `./src/data.ts`

### Le build échoue

- Assurez-vous que `npm install` a été exécuté dans le projet principal
- Vérifiez que le fichier `src/data.ts` est syntaxiquement correct

### Les posts sociaux ne sont pas publiés

- Vérifiez que `enabled: true` dans la config pour le réseau concerné
- Vérifiez les clés API et tokens
- Consultez `automation/logs/social.log` pour les erreurs détaillées

### Le scheduler ne démarre pas

- Vérifiez la syntaxe cron dans la configuration
- Utilisez `node automation/scheduler.js test` pour tester

## 📝 Exemple de Configuration Complète

Voici un exemple de `config.json` entièrement configuré :

```json
{
  "anthropic": {
    "apiKey": "sk-ant-api03-xxxxx",
    "model": "claude-3-5-sonnet-20241022"
  },
  "social": {
    "twitter": {
      "enabled": true,
      "apiKey": "xxxxx",
      "apiSecret": "xxxxx",
      "accessToken": "xxxxx",
      "accessTokenSecret": "xxxxx"
    },
    "facebook": {
      "enabled": true,
      "pageId": "123456789",
      "accessToken": "xxxxx"
    },
    "linkedin": {
      "enabled": false,
      "accessToken": ""
    }
  },
  "newsSources": [
    {
      "name": "Al Jazeera Arabic",
      "url": "https://www.aljazeera.net/rss/RssBreaking.xml",
      "type": "rss"
    },
    {
      "name": "BBC Arabic",
      "url": "https://feeds.bbci.co.uk/arabic/rss.xml",
      "type": "rss"
    },
    {
      "name": "France 24 Arabic",
      "url": "https://www.france24.com/ar/rss",
      "type": "rss"
    }
  ],
  "automation": {
    "dailyLimit": 3,
    "minInterval": 8,
    "categories": ["سياسة", "اقتصاد", "رياضة", "تكنولوجيا", "ثقافة", "بيئة"],
    "language": "ar",
    "seoOptimization": true,
    "imageGeneration": false
  },
  "site": {
    "baseUrl": "https://arabpress.netlify.app",
    "dataPath": "./src/data.ts"
  }
}
```

## 🚀 Démarrage Rapide - Résumé

```bash
# 1. Installation
cd automation
npm install

# 2. Configuration
# Éditez config/config.json et ajoutez votre clé API Anthropic

# 3. Test
node automation/main.js --dry-run

# 4. Première exécution réelle
node automation/main.js

# 5. Automatisation quotidienne
node automation/scheduler.js start --morning --afternoon --evening

# 6. En production avec PM2
pm2 start automation/scheduler.js --name journal-automation
pm2 save
```

## 📞 Support

Pour toute question ou problème :

1. Consultez les logs dans `automation/logs/`
2. Vérifiez la configuration dans `config/config.json`
3. Testez avec `--dry-run` pour isoler le problème

## 🔒 Sécurité

- **Ne committez jamais** le fichier `config.json` avec vos vraies clés API
- Ajoutez `config/config.json` à `.gitignore`
- Utilisez des variables d'environnement en production
- Limitez les permissions des tokens de réseaux sociaux

## 📈 Évolutions Futures

Améliorations possibles :
- Support des images automatiques avec DALL-E
- Base de données pour l'historique
- Interface web de monitoring
- Webhooks pour notifications
- Analytics et métriques
- Support multilingue

---

**Créé avec ❤️ et alimenté par Claude AI**
