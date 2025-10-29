#!/usr/bin/env node

/**
 * Script de relecture humaine pour les articles générés
 * Affiche les articles et demande confirmation avant publication
 */

const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

class ArticleReviewer {
  constructor() {
    this.articlesFile = path.join(__dirname, 'logs/generated-articles.json');
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  /**
   * Question avec réponse
   */
  question(query) {
    return new Promise(resolve => this.rl.question(query, resolve));
  }

  /**
   * Ferme l'interface readline
   */
  close() {
    this.rl.close();
  }

  /**
   * Affiche un article de manière lisible
   */
  displayArticle(article, index, total) {
    console.log('\n' + '='.repeat(80));
    console.log(`\n📰 ARTICLE ${index + 1}/${total}`);
    console.log('='.repeat(80));
    console.log(`\n📌 TITRE: ${article.title}`);
    console.log(`📂 CATÉGORIE: ${article.category}`);
    console.log(`✍️  AUTEUR: ${article.author || 'N/A'}`);
    console.log(`🔗 SLUG: ${article.slug}`);
    console.log(`📅 DATE: ${article.date}`);
    console.log(`\n📝 RÉSUMÉ:\n${article.summary}`);
    console.log(`\n🔍 META DESCRIPTION:\n${article.metaDescription}`);
    console.log(`\n🏷️  MOTS-CLÉS: ${article.keywords}`);
    console.log(`\n📊 LONGUEUR: ${article.content.length} caractères`);
    console.log(`\n🌐 SOURCE: ${article.sourceName} - ${article.sourceUrl}`);
    
    // Afficher le contenu (tronqué pour ne pas surcharger)
    const contentPreview = article.content.substring(0, 500) + '...';
    console.log(`\n📄 CONTENU (aperçu):\n${contentPreview}`);
    
    console.log('\n' + '='.repeat(80));
  }

  /**
   * Vérifie la qualité d'un article
   */
  checkQuality(article) {
    const issues = [];
    const warnings = [];

    // Vérifications strictes
    if (!article.title || article.title.length < 10) {
      issues.push('❌ Titre trop court ou manquant');
    }

    if (!article.content || article.content.length < 1000) {
      issues.push('⚠️  Contenu trop court (moins de 1000 caractères)');
    }

    if (!article.summary || article.summary.length < 50) {
      issues.push('⚠️  Résumé trop court');
    }

    if (!article.metaDescription || article.metaDescription.length < 100) {
      warnings.push('⚠️  Meta description pourrait être plus longue');
    }

    // Vérifier si l'article contient la mention IA
    if (!article.content.includes('intelligence artificielle') && !article.content.includes('ذكاء اصطناعي')) {
      warnings.push('⚠️  Mention IA manquante dans le contenu');
    }

    // Vérifier si l'article contient des sources
    if (!article.content.includes('Sources :') && !article.content.includes('المصادر')) {
      warnings.push('⚠️  Sources non mentionnées dans le contenu');
    }

    return { issues, warnings };
  }

  /**
   * Charge les articles générés
   */
  async loadArticles() {
    try {
      const data = await fs.readFile(this.articlesFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des articles:', error.message);
      console.log('\n💡 Assurez-vous d\'avoir exécuté la génération d\'articles d\'abord :');
      console.log('   node main.js --skip-publication --skip-social --skip-build --skip-git\n');
      process.exit(1);
    }
  }

  /**
   * Processus de relecture
   */
  async reviewArticles() {
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║          👨‍💼 MODE REVUE HUMAINE DES ARTICLES          ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

    const articles = await this.loadArticles();
    
    if (articles.length === 0) {
      console.log('ℹ️  Aucun article à revoir.\n');
      this.close();
      return;
    }

    console.log(`📚 ${articles.length} article(s) à examiner\n`);

    const approvedArticles = [];
    const rejectedArticles = [];

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      
      // Afficher l'article
      this.displayArticle(article, i, articles.length);

      // Vérifier la qualité
      const quality = this.checkQuality(article);
      
      if (quality.issues.length > 0) {
        console.log('\n⚠️  PROBLÈMES DÉTECTÉS:');
        quality.issues.forEach(issue => console.log(issue));
      }

      if (quality.warnings.length > 0) {
        console.log('\n💡 AVERTISSEMENTS:');
        quality.warnings.forEach(warning => console.log(warning));
      }

      // Demander confirmation
      const answer = await this.question('\n✅ Voulez-vous approuver cet article pour publication ? (o/n/s) [o=oui, n=non, s=sauter le reste] : ');
      
      const response = answer.trim().toLowerCase();

      if (response === 's' || response === 'skip') {
        console.log('\n⏭️  Articles restants ignorés.');
        break;
      } else if (response === 'o' || response === 'oui' || response === 'y' || response === 'yes' || response === '') {
        console.log('✅ Article approuvé !');
        approvedArticles.push(article);
      } else {
        console.log('❌ Article rejeté.');
        rejectedArticles.push({
          article,
          reason: 'Rejeté manuellement'
        });
      }
    }

    // Résumé
    console.log('\n\n' + '='.repeat(80));
    console.log('📊 RÉSUMÉ DE LA REVUE');
    console.log('='.repeat(80));
    console.log(`\n✅ Articles approuvés: ${approvedArticles.length}`);
    console.log(`❌ Articles rejetés: ${rejectedArticles.length}`);
    console.log(`📚 Total examinés: ${articles.length}\n`);

    // Sauvegarder les résultats
    if (approvedArticles.length > 0) {
      const outputFile = path.join(__dirname, 'logs/approved-articles.json');
      await fs.writeFile(outputFile, JSON.stringify(approvedArticles, null, 2), 'utf-8');
      console.log(`\n✅ Articles approuvés sauvegardés dans: ${outputFile}`);
      console.log('\n💡 Vous pouvez maintenant publier avec:');
      console.log('   node automation/publish-approved.js');
      console.log('   node automation/publish-approved.js --build  (avec build du site)');
      console.log('   node automation/publish-approved.js --build --git  (avec build + commit Git)');
    }

    if (rejectedArticles.length > 0) {
      const outputFile = path.join(__dirname, 'logs/rejected-articles.json');
      await fs.writeFile(outputFile, JSON.stringify(rejectedArticles, null, 2), 'utf-8');
      console.log(`\n❌ Articles rejetés sauvegardés dans: ${outputFile}`);
    }

    this.close();
  }
}

// CLI
if (require.main === module) {
  const reviewer = new ArticleReviewer();
  reviewer.reviewArticles().catch(error => {
    console.error('\n❌ Erreur:', error.message);
    reviewer.close();
    process.exit(1);
  });
}

module.exports = ArticleReviewer;

