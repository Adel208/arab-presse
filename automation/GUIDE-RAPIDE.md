# 🚀 Guide de Démarrage Rapide

Guide ultra-rapide pour démarrer avec le système d'automatisation.

## ⚡ Installation en 5 Minutes

### 1️⃣ Installer les dépendances

```bash
cd automation
npm install
```

### 2️⃣ Configurer la clé API Claude

```bash
# Copier le template
cp config/config.template.json config/config.json

# Éditer et remplacer VOTRE_CLE_API_ANTHROPIC par votre vraie clé
nano config/config.json
```

**Obtenir votre clé API** : https://console.anthropic.com/

### 3️⃣ Test

```bash
# Test sans modifications réelles
node main.js --dry-run
```

### 4️⃣ Première exécution

```bash
# Exécution complète
node main.js
```

## 🎯 Commandes Essentielles

### Exécution Manuelle

```bash
# Une seule fois, tout le processus
node main.js

# Test sans rien modifier
node main.js --dry-run

# Sans les réseaux sociaux
node main.js --skip-social

# Sans commit Git automatique
node main.js --skip-git
```

### Automatisation Continue

```bash
# 3 fois par jour (8h, 14h, 20h)
node scheduler.js start

# Personnalisé
node scheduler.js start --morning --evening
node scheduler.js start --interval 6

# Test immédiat
node scheduler.js test
```

### En Production (PM2)

```bash
# Installer PM2
npm install -g pm2

# Lancer
pm2 start scheduler.js --name journal

# Gérer
pm2 logs journal      # Voir les logs
pm2 restart journal   # Redémarrer
pm2 stop journal      # Arrêter
pm2 delete journal    # Supprimer

# Auto-démarrage au reboot
pm2 save
pm2 startup
```

## 📊 Ce qui se passe lors d'une exécution

```
1. 🔍 Veille automatique
   → Récupère les news depuis Al Jazeera, BBC Arabic, France 24

2. ✍️ Génération d'articles
   → Claude AI crée 3 articles complets en arabe

3. 📰 Publication
   → Ajoute les articles à src/data.ts

4. 🔨 Build
   → npm run build (génère les pages HTML)

5. 📱 Réseaux sociaux
   → Publie sur Twitter, Facebook, LinkedIn (si configuré)

6. 📤 Déploiement
   → git commit + push → Netlify déploie automatiquement
```

## ⚙️ Configuration Minimale

Fichier `automation/config/config.json` :

```json
{
  "anthropic": {
    "apiKey": "sk-ant-api03-VOTRE_CLE_ICI"
  }
}
```

C'est tout ! Le reste a des valeurs par défaut.

## 🎛️ Options Avancées

### Limiter le nombre d'articles

Dans `config.json` :

```json
{
  "automation": {
    "dailyLimit": 3
  }
}
```

### Activer Twitter

Dans `config.json` :

```json
{
  "social": {
    "twitter": {
      "enabled": true,
      "apiKey": "...",
      "apiSecret": "...",
      "accessToken": "...",
      "accessTokenSecret": "..."
    }
  }
}
```

Obtenir les clés : https://developer.twitter.com/

### Ajouter des sources RSS

Dans `config.json` :

```json
{
  "newsSources": [
    {
      "name": "Ma Source",
      "url": "https://example.com/feed.xml",
      "type": "rss"
    }
  ]
}
```

## 📂 Structure Créée

```
automation/
├── config/
│   ├── config.json          ← Votre configuration (ne pas commiter)
│   └── config.template.json ← Template pour partage
├── modules/                 ← Code source
├── logs/                    ← Logs et résultats
├── main.js                  ← Script principal
├── scheduler.js             ← Automatisation
└── package.json             ← Dépendances
```

## 🔍 Voir les Résultats

```bash
# Logs principal
tail -f automation/logs/main.log

# Dernières news récupérées
cat automation/logs/latest-news.json

# Articles générés
cat automation/logs/generated-articles.json
```

## ⚠️ Problèmes Courants

**"API Key invalide"**
→ Vérifiez votre clé dans `config/config.json`

**"Module not found"**
→ Lancez `npm install` dans le dossier automation

**Le build échoue**
→ Lancez `npm install` dans la racine du projet (pas automation)

**Rien ne se passe**
→ Vérifiez les logs dans `automation/logs/main.log`

## 💰 Coûts Estimés

Avec Claude 3.5 Sonnet :
- ~8000 tokens par article généré
- ~$0.10-0.20 par article
- 3 articles par jour = ~$0.30-0.60/jour = ~$9-18/mois

## 📞 Aide

Documentation complète : [README.md](./README.md)

Logs détaillés : `automation/logs/`

Test sans risque : `node main.js --dry-run`

---

**Prêt ? Lancez votre première automatisation !**

```bash
cd automation
npm install
cp config/config.template.json config/config.json
# Éditez config.json pour ajouter votre clé API
node main.js --dry-run
node main.js
```
