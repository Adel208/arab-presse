#!/usr/bin/env node

/**
 * Script principal d'automatisation du journal
 * Orchestre tout le processus: veille -> génération -> publication -> partage social
 */

const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Modules
const NewsScraper = require('./modules/news-scraper');
const ArticleGenerator = require('./modules/article-generator');
const Publisher = require('./modules/publisher');
const SocialPublisher = require('./modules/social-publisher');
const ImageFetcher = require('./modules/image-fetcher');

class AutomationOrchestrator {
  constructor(configPath = null) {
    this.configPath = configPath || path.join(__dirname, 'config/config.json');
    this.logFile = path.join(__dirname, 'logs/main.log');
  }

  /**
   * Log les messages
   */
  async log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    console.log(logMessage.trim());

    try {
      await fs.appendFile(this.logFile, logMessage);
    } catch (error) {
      console.error('Erreur lors de l\'écriture du log:', error);
    }
  }

  /**
   * Charge la configuration
   */
  async loadConfig() {
    try {
      await this.log(`Chargement de la configuration: ${this.configPath}`);
      let configData = await fs.readFile(this.configPath, 'utf-8');
      let config = JSON.parse(configData);
      
      // Si mode test et apiKey = "USE_FROM_CONFIG_JSON", utiliser celle de config.json
      if (config.anthropic?.apiKey === "USE_FROM_CONFIG_JSON") {
        const defaultConfigPath = path.join(__dirname, 'config/config.json');
        const defaultConfigData = await fs.readFile(defaultConfigPath, 'utf-8');
        const defaultConfig = JSON.parse(defaultConfigData);
        config.anthropic.apiKey = defaultConfig.anthropic.apiKey;
      }
      
      return config;
    } catch (error) {
      throw new Error(`Impossible de charger la configuration: ${error.message}`);
    }
  }

  /**
   * Valide la configuration
   */
  validateConfig(config) {
    const errors = [];

    if (!config.anthropic?.apiKey || config.anthropic.apiKey === 'VOTRE_CLE_API_ANTHROPIC') {
      errors.push('⚠️  Clé API Anthropic non configurée');
    }

    if (!config.newsSources || config.newsSources.length === 0) {
      errors.push('⚠️  Aucune source de news configurée');
    }

    // Vérifier les réseaux sociaux (warning seulement)
    const socialEnabled = Object.values(config.social).some(s => s.enabled);
    if (!socialEnabled) {
      console.log('ℹ️  Aucun réseau social activé - le partage sera ignoré');
    }

    if (errors.length > 0) {
      throw new Error('Configuration invalide:\n' + errors.join('\n'));
    }
  }

  /**
   * Affiche le header
   */
  displayHeader() {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║              🤖 AUTOMATISATION JOURNAL ARABE 🤖              ║
║                                                              ║
║                     Powered by Claude AI                     ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`);
  }

  /**
   * Pipeline complet d'automatisation
   */
  async run(options = {}) {
    const {
      skipScraping = false,
      skipGeneration = false,
      skipPublication = false,
      skipSocial = false,
      skipBuild = false,
      skipGit = false,
      dryRun = false
    } = options;

    try {
      this.displayHeader();
      await this.log('═══════════════════════════════════════════════════════');
      await this.log('DÉBUT DU PROCESSUS D\'AUTOMATISATION');
      await this.log('═══════════════════════════════════════════════════════');

      // 1. Chargement de la configuration
      await this.log('\n📋 Étape 1/7: Chargement de la configuration');
      const config = await this.loadConfig();
      this.validateConfig(config);
      await this.log('✓ Configuration chargée et validée');

      let newsItems = [];
      let generatedArticles = [];
      let publishResult = null;
      let socialResults = [];

      // 2. Veille automatique
      if (!skipScraping) {
        await this.log('\n🔍 Étape 2/7: Veille automatique des actualités');
        const scraper = new NewsScraper(config);
        newsItems = await scraper.fetchLatestNews();
        await scraper.saveResults(newsItems);

        if (newsItems.length === 0) {
          await this.log('⚠️  Aucune actualité pertinente trouvée - arrêt du processus');
          return;
        }
      } else {
        await this.log('\n⏭️  Étape 2/7: Veille automatique (ignorée)');
      }

      // 3. Génération des articles
      if (!skipGeneration && newsItems.length > 0) {
        await this.log('\n✍️  Étape 3/7: Génération des articles avec Claude AI');
        const generator = new ArticleGenerator(config);
        // Charger preset si demandé via options
        let presetText = '';
        if (options.preset) {
          try {
            const presetsPath = path.join(__dirname, 'config/prompt-presets.json');
            const presetsData = await fs.readFile(presetsPath, 'utf-8');
            const presets = JSON.parse(presetsData);
            const p = presets[options.preset];
            if (p?.instructions?.length) {
              presetText = p.instructions.map(i => `- ${i}`).join('\n');
            }
          } catch (e) {
            await this.log(`⚠️  Impossible de charger le preset: ${e.message}`);
          }
        }

        const effectiveCountry = options.country || (options.preset === 'pays' ? 'Tunisie' : undefined);

        const { articles, errors } = await generator.generateArticles(
          newsItems,
          { preset: options.preset, country: effectiveCountry, __presetText: presetText }
        );
        generatedArticles = articles;

        if (generatedArticles.length > 0) {
          await generator.saveArticles(generatedArticles);

          // Affichage des aperçus
          generatedArticles.forEach(article => {
            console.log(generator.getArticlePreview(article));
          });
        }

        if (errors.length > 0) {
          await this.log(`⚠️  ${errors.length} articles n'ont pas pu être générés`);
        }

        if (generatedArticles.length === 0) {
          await this.log('⚠️  Aucun article généré - arrêt du processus');
          return;
        }

        // Génération des images pour chaque article
        if (config.automation?.imageGeneration !== false) {
          await this.log('\n🖼️  Génération des images depuis Unsplash');
          const imageFetcher = new ImageFetcher(config);
          
          for (const article of generatedArticles) {
            const imagePath = await imageFetcher.generateImageForArticle(article);
            if (imagePath) {
              article.image = imagePath;
              article.imageAlt = article.imageAlt || article.title;
            }
          }
          
          await this.log(`✓ Images générées pour ${generatedArticles.filter(a => a.image).length} articles`);
        }
      } else {
        await this.log('\n⏭️  Étape 3/7: Génération des articles (ignorée)');
      }

      // 4. Publication sur le site
      if (!skipPublication && generatedArticles.length > 0) {
        await this.log('\n📰 Étape 4/7: Publication sur le site');

        if (dryRun) {
          await this.log('🔸 MODE DRY RUN: Les articles ne seront pas publiés');
        } else {
          const publisher = new Publisher(config);
          publishResult = await publisher.publishArticles(generatedArticles);

          const report = publisher.generateReport(generatedArticles, publishResult);
          console.log(report);
        }
      } else {
        await this.log('\n⏭️  Étape 4/7: Publication sur le site (ignorée)');
      }

      // 5. Build du site
      if (!skipBuild && publishResult && !dryRun) {
        await this.log('\n🔨 Étape 5/7: Build du site');
        try {
          await this.log('Exécution de npm run build...');
          execSync('npm run build', {
            cwd: path.join(__dirname, '..'),
            stdio: 'inherit'
          });
          await this.log('✓ Build réussi');
        } catch (error) {
          await this.log(`✗ Erreur lors du build: ${error.message}`);
          throw error;
        }
      } else {
        await this.log('\n⏭️  Étape 5/7: Build du site (ignoré)');
      }

      // 6. Partage sur les réseaux sociaux
      if (!skipSocial && generatedArticles.length > 0) {
        await this.log('\n📱 Étape 6/7: Partage sur les réseaux sociaux');

        if (dryRun) {
          await this.log('🔸 MODE DRY RUN: Les posts ne seront pas publiés');
        } else {
          const socialPublisher = new SocialPublisher(config);
          socialResults = await socialPublisher.publishArticles(generatedArticles);

          const report = socialPublisher.generateReport(socialResults);
          console.log(report);
        }
      } else {
        await this.log('\n⏭️  Étape 6/7: Partage sur les réseaux sociaux (ignoré)');
      }

      // 7. Commit et push Git
      if (!skipGit && publishResult && !dryRun) {
        await this.log('\n📤 Étape 7/7: Commit et push Git');

        try {
          const projectRoot = path.join(__dirname, '..');
          
          // Vérifier si on est dans un repo git
          execSync('git status', { cwd: projectRoot, stdio: 'pipe' });

          // Ajouter les changements
          await this.log('git add src/data.ts public/...');
          execSync('git add src/data.ts public/', {
            cwd: projectRoot,
            stdio: 'pipe'
          });

          // Commit - utiliser un fichier temporaire pour éviter les problèmes d'échappement
          const commitMessage = `🤖 Publication automatique: ${generatedArticles.length} nouveaux articles

Articles:
${generatedArticles.map(a => `- ${a.title.replace(/"/g, '\\"')}`).join('\n')}

Généré automatiquement par le système d'automatisation`;

          // Écrire le message dans un fichier temporaire pour éviter les problèmes avec les guillemets
          const tempFile = path.join(projectRoot, '.git-commit-msg.txt');
          fsSync.writeFileSync(tempFile, commitMessage, 'utf-8');

          await this.log('git commit...');
          execSync(`git commit -F "${tempFile}"`, {
            cwd: projectRoot,
            stdio: 'pipe'
          });
          
          // Supprimer le fichier temporaire
          fsSync.unlinkSync(tempFile);

          // Push
          await this.log('git push...');
          execSync('git push', {
            cwd: projectRoot,
            stdio: 'inherit'
          });

          await this.log('✓ Changements commitées et pushés vers GitHub');
          await this.log('✓ Netlify déploiera automatiquement les changements');

        } catch (error) {
          await this.log(`⚠️  Erreur Git: ${error.message}`);
          await this.log('Vous devrez commiter et pusher manuellement');
        }
      } else {
        await this.log('\n⏭️  Étape 7/7: Commit et push Git (ignoré)');
      }

      // Résumé final
      await this.log('\n═══════════════════════════════════════════════════════');
      await this.log('PROCESSUS TERMINÉ AVEC SUCCÈS');
      await this.log('═══════════════════════════════════════════════════════');

      console.log(`
╔══════════════════════════════════════════════════════════════╗
║                     ✓ SUCCÈS                                 ║
╚══════════════════════════════════════════════════════════════╝

📊 Résumé:
   • ${newsItems.length} actualités trouvées
   • ${generatedArticles.length} articles générés
   • ${publishResult ? publishResult.articlesAdded : 0} articles publiés
   • ${socialResults.length} publications sur les réseaux sociaux

🌐 Votre site sera mis à jour sous peu via Netlify!

`);

    } catch (error) {
      await this.log(`\n✗✗✗ ERREUR FATALE: ${error.message}`);
      console.error('\n❌ Une erreur est survenue:', error.message);
      console.error('\n📋 Consultez les logs pour plus de détails:');
      console.error(`   ${this.logFile}`);
      throw error;
    }
  }
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);

  // Détection du mode test
  let configPath = null;
  if (args.includes('--test-mode')) {
    configPath = path.join(__dirname, 'config/config.test.json');
    console.log('🧪 MODE TEST ACTIVÉ - Utilisation de config.test.json (Claude Haiku)');
    console.log('💰 Coût estimé: ~$0.02-0.05 par article\n');
  }

  const options = {
    skipScraping: args.includes('--skip-scraping'),
    skipGeneration: args.includes('--skip-generation'),
    skipPublication: args.includes('--skip-publication'),
    skipSocial: args.includes('--skip-social'),
    skipBuild: args.includes('--skip-build'),
    skipGit: args.includes('--skip-git'),
    dryRun: args.includes('--dry-run'),
    preset: (args.find(a => a.startsWith('--preset=')) || '').split('=')[1],
    country: (args.find(a => a.startsWith('--country=')) || '').split('=')[1]
  };

  if (args.includes('--help')) {
    console.log(`
Usage: node automation/main.js [options]

Options:
  --test-mode          Mode test économique (utilise Claude Haiku + 1 article)
  --skip-scraping      Ignore la veille automatique
  --skip-generation    Ignore la génération d'articles
  --skip-publication   Ignore la publication sur le site
  --skip-social        Ignore le partage sur les réseaux sociaux
  --skip-build         Ignore le build du site
  --skip-git           Ignore le commit et push Git
  --dry-run            Mode test sans modifications réelles
  --preset=<pays>      Utiliser un preset de prompt (actuel: pays)
  --country=<nom>      Pays ciblé (par défaut: Tunisie si preset=pays)
  --help               Affiche cette aide

Exemples:
  node automation/main.js                    # Exécution complète (Sonnet, 3 articles)
  node automation/main.js --test-mode        # Mode test (Haiku, 1 article) - ~$0.02
  node automation/main.js --test-mode --dry-run  # Test sans modifications
  node automation/main.js --skip-social      # Sans partage social
  node automation/main.js --skip-git         # Sans commit Git

💡 Mode Test:
   - Modèle: Claude Haiku (10x moins cher)
   - Articles: 1 seul article
   - Coût: ~$0.02-0.05 par test
   - Parfait pour tester sans dépenser trop
`);
    process.exit(0);
  }

  const orchestrator = new AutomationOrchestrator(configPath);
  orchestrator.run(options).catch(error => {
    console.error('Échec du processus d\'automatisation');
    process.exit(1);
  });
}

module.exports = AutomationOrchestrator;
