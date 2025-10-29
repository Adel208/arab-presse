#!/usr/bin/env node

/**
 * Script pour publier les articles approuvés après la revue
 * Lit automation/logs/approved-articles.json et les ajoute à src/data.ts
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// Modules
const Publisher = require('./modules/publisher');

async function loadConfig() {
  const configPath = path.join(__dirname, 'config/config.json');
  const configData = await fs.readFile(configPath, 'utf-8');
  return JSON.parse(configData);
}

async function main() {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║         📰 PUBLICATION DES ARTICLES APPROUVÉS 📰              ║
╚══════════════════════════════════════════════════════════════╝
  `);

  try {
    // 1. Charger la configuration
    console.log('📋 Chargement de la configuration...');
    const config = await loadConfig();
    console.log('✅ Configuration chargée\n');

    // 2. Lire les articles approuvés
    const approvedArticlesPath = path.join(__dirname, 'logs/approved-articles.json');
    console.log(`📂 Lecture des articles approuvés: ${approvedArticlesPath}`);
    
    try {
      const approvedData = await fs.readFile(approvedArticlesPath, 'utf-8');
      const approvedArticles = JSON.parse(approvedData);
      
      if (!Array.isArray(approvedArticles) || approvedArticles.length === 0) {
        console.log('ℹ️  Aucun article approuvé à publier');
        console.log('💡 Lancez d\'abord la revue avec: node automation/review.js\n');
        process.exit(0);
      }

      console.log(`✅ ${approvedArticles.length} article(s) approuvé(s) trouvé(s)\n`);

      // 3. Publier les articles
      console.log('📰 Publication des articles dans src/data.ts...');
      const publisher = new Publisher(config);
      const result = await publisher.publishArticles(approvedArticles);

      if (result.success) {
        console.log(`\n✅ ${result.articlesAdded} article(s) publié(s) avec succès !`);
        console.log(`📝 IDs assignés: ${result.newIds.join(', ')}\n`);

        // 4. Générer le sitemap
        console.log('🗺️  Génération du sitemap...');
        try {
          execSync('node generate-sitemap.js', {
            cwd: path.join(__dirname, '..'),
            stdio: 'inherit'
          });
          console.log('✅ Sitemap mis à jour\n');
        } catch (error) {
          console.log('⚠️  Erreur lors de la génération du sitemap:', error.message);
          console.log('💡 Vous pouvez le générer manuellement: node generate-sitemap.js\n');
        }

        // 5. Optionnel: Build du site
        const args = process.argv.slice(2);
        if (args.includes('--build')) {
          console.log('🔨 Build du site...');
          try {
            execSync('npm run build', {
              cwd: path.join(__dirname, '..'),
              stdio: 'inherit'
            });
            console.log('✅ Build réussi\n');
          } catch (error) {
            console.log('⚠️  Erreur lors du build:', error.message);
          }
        } else {
          console.log('💡 Pour builder le site, utilisez: node automation/publish-approved.js --build\n');
        }

        // 6. Optionnel: Commit Git
        if (args.includes('--git')) {
          console.log('📤 Commit Git...');
          try {
            const projectRoot = path.join(__dirname, '..');
            execSync('git add src/data.ts public/sitemap.xml', {
              cwd: projectRoot,
              stdio: 'pipe'
            });

            const commitMessage = `📰 Publication: ${approvedArticles.length} nouveaux articles

Articles publiés:
${approvedArticles.map(a => `- ${a.title}`).join('\n')}`;

            execSync(`git commit -m "${commitMessage}"`, {
              cwd: projectRoot,
              stdio: 'pipe'
            });

            console.log('✅ Changements commitées\n');
          } catch (error) {
            console.log('⚠️  Erreur Git:', error.message);
            console.log('💡 Vous devrez commiter manuellement\n');
          }
        }

        // 7. Supprimer les articles approuvés (optionnel, pour éviter les doublons)
        if (args.includes('--clean')) {
          console.log('🧹 Suppression du fichier approved-articles.json...');
          try {
            await fs.unlink(approvedArticlesPath);
            console.log('✅ Fichier nettoyé\n');
          } catch (error) {
            console.log('⚠️  Impossible de supprimer le fichier:', error.message);
          }
        }

        console.log('╔══════════════════════════════════════════════════════════════╗');
        console.log('║                    ✅ PUBLICATION TERMINÉE                    ║');
        console.log('╚══════════════════════════════════════════════════════════════╝\n');

        console.log('📊 Résumé:');
        console.log(`   • ${result.articlesAdded} article(s) ajouté(s) à src/data.ts`);
        console.log(`   • Sitemap mis à jour`);
        console.log(`\n💡 Prochaines étapes:`);
        console.log(`   1. Vérifiez les articles dans src/data.ts`);
        console.log(`   2. Si tout est correct, lancez: npm run build`);
        console.log(`   3. Déployez sur votre plateforme (Netlify, etc.)\n`);

      } else {
        throw new Error('La publication a échoué');
      }

    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('❌ Fichier approved-articles.json introuvable');
        console.log('💡 Lancez d\'abord la revue avec: node automation/review.js\n');
        process.exit(1);
      } else {
        throw error;
      }
    }

  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    console.error('\n📋 Détails:', error.stack);
    process.exit(1);
  }
}

// Aide
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Usage: node automation/publish-approved.js [options]

Options:
  --build    Build le site après publication
  --git      Commit et push les changements Git
  --clean    Supprime le fichier approved-articles.json après publication
  --help     Affiche cette aide

Exemples:
  node automation/publish-approved.js
  node automation/publish-approved.js --build
  node automation/publish-approved.js --build --git --clean
  `);
  process.exit(0);
}

main();

