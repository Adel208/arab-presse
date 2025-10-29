# 💰 Guide : Mode Test Économique

## 🎯 Objectif

Tester l'automatisation sans dépenser beaucoup de tokens en utilisant :
- **Claude Haiku** au lieu de Claude Sonnet (10x moins cher)
- **1 seul article** au lieu de 3
- **Coût estimé** : ~$0.02-0.05 par test (au lieu de $0.30-0.60)

## 🚀 Utilisation

### Commande simple

```bash
# Mode test économique
node automation/main.js --test-mode --dry-run
```

### Ce qui se passe

1. **Chargement de `config.test.json`** :
   - Modèle : `claude-3-haiku-20240307` (au lieu de Sonnet 4.5)
   - Articles : 1 seul (au lieu de 3)
   - Sources : BBC + France 24 uniquement (plus rapide)

2. **Génération d'un article** avec Haiku (~50 secondes)

3. **Scoring automatique** et affichage des résultats

## 📊 Comparaison des Coûts

| Mode | Modèle | Articles | Coût/test | Coût/mois* |
|------|--------|----------|-----------|------------|
| **Production** | Claude Sonnet 4.5 | 3 | $0.30-0.60 | $9-18 |
| **Test** | Claude Haiku | 1 | **$0.02就知道5** | - |

*Basé sur 30 tests/mois

## ⚙️ Configuration

Le fichier `automation/config/config.test.json` est pré-configuré avec :

```json
{
  "anthropic": {
    "model": "claude-3-haiku-20240307"  // Modèle économique
  },
  "automation": {
    "dailyLimit": 1  // 1 seul article
  },
  "newsSources": [
    // Seulement BBC et France 24 (plus rapide)
  ]
}
```

## 🔄 Workflow Recommandé

### 1. Tester d'abord (économique)

```bash
# Test avec Haiku - ~$0.02
node automation/main.js --test-mode --dry-run
```

### 2. Si tout fonctionne, passer en production

```bash
# Production avec Sonnet - ~$0.30-0.60
node automation/main.js --dry-run
```

### 3. Publier les articles approuvés

```bash
# Revue humaine
node automation/review.js

# Puis publication
node automation/main.js --skip-generation
```

## ⚠️ Différences entre Haiku et Sonnet

### Claude Haiku (Test)
- ✅ **Avantages** : Rapide, très économique (~$0.02)
- ⚠️ **Limites** : Qualité légèrement inférieure, moins d'analyse approfondie
- 🎯 **Usage** : Tests de fonctionnement, vérification du pipeline

### Claude Sonnet (Production)
- ✅ **Avantages** : Qualité supérieure, analyse approfondie, meilleur SEO
- ⚠️ **Coût** : ~10x plus cher (~$0.10-0.20/article)
- 🎯 **Usage** : Production réelle, articles finaux

## 💡 Astuces

### Tester uniquement la veille (gratuit)

```bash
# Pas de génération = 0 token consommé
node automation/main.js --test-mode --skip-generation --dry-run
```

### Tester avec articles existants

```bash
# Utiliser les articles déjà générés
node automation/review.js  # Gratuit, lit juste les JSON
```

### Voir les résultats du dernier test

```bash
cat automation/logs/generated-articles.json | head -100
```

## 📝 Exemple de Sortie

```
🧪 MODE TEST ACTIVÉ - Utilisation de config.test.json (Claude Haiku)
💰 Coût estimé: ~$0.02-0.05 par article

📋 Étape 1/7: Chargement de la configuration
✓ Configuration chargée et validée

🔍 Étape 2/7: Veille automatique des actualités
✓ 1 article sélectionné pour génération

✍️  Étape 3/7: Génération des articles avec Claude AI
[1/1] Génération en cours...
✓ Article généré avec succès

📊 Score qualité: 85/100
```

## 🎓 Résumé

- **Pour tester** : `--test-mode` → ~$0.02-0.05
- **Pour produire** : Sans option → ~$0.30-0.60
- **Économie** : ~96% lors des tests !

---

**Dernière mise à jour** : 2025-10-29

