#!/usr/bin/env node

/**
 * Script wrapper pour générer et revoir automatiquement les articles
 * Combine: génération d'articles + revue humaine interactive
 */

const { spawn } = require('child_process');
const path = require('path');

async function runCommand(command, args, cwd) {
  return new Promise((resolve, reject) => {
    console.log(`\n▶️  Exécution: ${command} ${args.join(' ')}`);
    
    const process = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: true
    });
    
    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
    
    process.on('error', (error) => {
      reject(error);
    });
  });
}

async function main() {
  const projectRoot = path.join(__dirname, '..');
  
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║         🤖 GÉNÉRATION + REVUE AUTOMATISÉE 🤖                 ║
║                                                              ║
║  Ce script va:                                              ║
║  1. Générer les articles automatiquement                    ║
║  2. Lancer la revue interactive pour validation             ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
  `);
  
  try {
    // Étape 1: Génération des articles
    console.log('📝 ÉTAPE 1/2: Génération des articles...\n');
    await runCommand('node', [
      'automation/main.js', 
      '--skip-publication', 
      '--skip-social', 
      '--skip-build', 
      '--skip-git'
    ], projectRoot);
    
    console.log('\n✅ Génération terminée avec succès !\n');
    
    // Étape 2: Revue interactive
    console.log('👨‍💼 ÉTAPE 2/2: Lancement de la revue interactive...\n');
    console.log('💡 Vous allez devoir examiner et valider chaque article');
    console.log('   Répondez: o=oui, n=non, s=sauter le reste\n');
    
    await runCommand('node', ['automation/review.js'], projectRoot);
    
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║                    ✅ PROCESSUS TERMINÉ                        ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');
    console.log('💡 Les articles approuvés sont sauvegardés dans:');
    console.log('   automation/logs/approved-articles.json\n');
    
  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    console.error('\n💡 Vous pouvez relancer le script ou executer les commandes séparément:');
    console.error('   node automation/main.js --skip-publication');
    console.error('   node automation/review.js\n');
    process.exit(1);
  }
}

main();

