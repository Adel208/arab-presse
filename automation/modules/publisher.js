/**
 * Module de publication automatique des articles sur le site
 * Met à jour src/data.ts et déclenche le rebuild
 */

const fs = require('fs').promises;
const path = require('path');

class Publisher {
  constructor(config) {
    this.config = config;
    this.dataPath = path.join(__dirname, '../..', config.site.dataPath);
    this.logFile = path.join(__dirname, '../logs/publisher.log');
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
   * Lit le fichier data.ts actuel
   */
  async readDataFile() {
    try {
      const content = await fs.readFile(this.dataPath, 'utf-8');
      return content;
    } catch (error) {
      throw new Error(`Impossible de lire ${this.dataPath}: ${error.message}`);
    }
  }

  /**
   * Extrait le dernier ID utilisé
   */
  extractLastId(dataContent) {
    const idMatches = dataContent.match(/id:\s*(\d+)/g);
    if (!idMatches || idMatches.length === 0) {
      return 0;
    }

    const ids = idMatches.map(match => {
      const num = match.match(/\d+/);
      return num ? parseInt(num[0]) : 0;
    });

    return Math.max(...ids);
  }

  /**
   * Échappe les caractères spéciaux pour TypeScript
   */
  escapeForTypeScript(text) {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\$/g, '\\$');
  }

  /**
   * Génère le code TypeScript pour un article
   */
  generateArticleCode(article, id) {
    const escaped = {
      title: this.escapeForTypeScript(article.title),
      summary: this.escapeForTypeScript(article.summary),
      category: this.escapeForTypeScript(article.category),
      content: this.escapeForTypeScript(article.content),
      metaDescription: this.escapeForTypeScript(article.metaDescription || article.summary),
      keywords: this.escapeForTypeScript(article.keywords || ''),
      author: this.escapeForTypeScript(article.author || 'فريق تحرير عرب برس')
    };

    let code = `  {
    id: ${id},
    slug: "${article.slug}",
    title: \`${escaped.title}\`,
    summary: \`${escaped.summary}\`,
    category: "${escaped.category}",
    date: "${article.date}",
    metaDescription: \`${escaped.metaDescription}\`,
    keywords: "${escaped.keywords}",
    author: "${escaped.author}"`;

    if (article.image) {
      code += `,\n    image: "${article.image}"`;
    }
    
    if (article.imageAlt) {
      code += `,\n    imageAlt: "${this.escapeForTypeScript(article.imageAlt)}"`;
    }

    code += `,\n    content: \`${escaped.content}\`
  }`;

    return code;
  }

  /**
   * Ajoute les articles au fichier data.ts
   */
  async publishArticles(articles) {
    await this.log(`=== Début de publication de ${articles.length} articles ===`);

    try {
      // Lecture du fichier actuel
      let dataContent = await this.readDataFile();
      await this.log('✓ Fichier data.ts lu avec succès');

      // Backup du fichier original
      const backupPath = this.dataPath + '.backup';
      await fs.writeFile(backupPath, dataContent);
      await this.log(`✓ Backup créé: ${backupPath}`);

      // Extraction du dernier ID
      const lastId = this.extractLastId(dataContent);
      await this.log(`Dernier ID trouvé: ${lastId}`);

      // Génération du code pour chaque article
      const articleCodes = articles.map((article, index) => {
        const newId = lastId + index + 1;
        return this.generateArticleCode(article, newId);
      });

      // Recherche du point d'insertion (avant la fermeture du tableau newsData)
      // Chercher la fermeture qui précède "export const categories"
      const insertionPattern = /(\s*)\];?\s*\n\s*export const categories/;
      const match = dataContent.match(insertionPattern);

      if (!match) {
        throw new Error('Impossible de trouver le point d\'insertion dans data.ts');
      }

      // Insertion des nouveaux articles
      const newArticlesCode = ',\n' + articleCodes.join(',\n');
      const updatedContent = dataContent.replace(
        insertionPattern,
        `${newArticlesCode}\n];\n\nexport const categories`
      );

      // Écriture du fichier mis à jour
      await fs.writeFile(this.dataPath, updatedContent, 'utf-8');
      await this.log('✓ Fichier data.ts mis à jour avec succès');

      // Vérification
      const verifyContent = await this.readDataFile();
      const newLastId = this.extractLastId(verifyContent);
      await this.log(`Vérification: nouveau dernier ID = ${newLastId}`);

      if (newLastId !== lastId + articles.length) {
        throw new Error('La vérification a échoué: les IDs ne correspondent pas');
      }

      await this.log(`=== Publication terminée: ${articles.length} articles ajoutés ===\n`);

      return {
        success: true,
        articlesAdded: articles.length,
        newIds: articles.map((_, i) => lastId + i + 1)
      };

    } catch (error) {
      await this.log(`✗ Erreur lors de la publication: ${error.message}`);
      throw error;
    }
  }

  /**
   * Télécharge une image depuis une URL (pour les images d'articles)
   */
  async downloadImage(url, filename) {
    try {
      const axios = require('axios');
      const imagePath = path.join(process.cwd(), 'public', 'img', filename);

      const response = await axios({
        url,
        method: 'GET',
        responseType: 'arraybuffer'
      });

      await fs.writeFile(imagePath, response.data);
      await this.log(`✓ Image téléchargée: ${filename}`);

      return `/img/${filename}`;
    } catch (error) {
      await this.log(`✗ Erreur lors du téléchargement de l'image: ${error.message}`);
      return null;
    }
  }

  /**
   * Génère un rapport de publication
   */
  generateReport(articles, result) {
    const report = `
╔════════════════════════════════════════════════════════╗
║          RAPPORT DE PUBLICATION                         ║
╚════════════════════════════════════════════════════════╝

📅 Date: ${new Date().toLocaleString('fr-FR')}
📊 Statut: ${result.success ? '✓ SUCCÈS' : '✗ ÉCHEC'}
📝 Articles publiés: ${result.articlesAdded}

Articles ajoutés:
${articles.map((article, i) => `
  ${i + 1}. ID ${result.newIds[i]}
     Titre: ${article.title}
     Slug: ${article.slug}
     Catégorie: ${article.category}
     Date: ${article.date}
`).join('\n')}

════════════════════════════════════════════════════════

⚡ Prochaines étapes:
1. Exécuter: npm run build
2. Commit et push vers GitHub
3. Netlify déploiera automatiquement

════════════════════════════════════════════════════════
`;

    return report;
  }
}

module.exports = Publisher;
