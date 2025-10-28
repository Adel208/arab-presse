/**
 * Module pour récupérer des images depuis Pexels
 * Gratuit, fiable, et compatible avec l'automatisation
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

class ImageFetcher {
  constructor(config) {
    this.config = config;
    // Access Key Pexels (optionnel mais recommandé)
    this.apiKey = config.pexels?.apiKey || '';
    this.logFile = path.join(__dirname, '../logs/image.log');
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
   * Récupère les mots-clés de recherche d'image depuis l'article
   */
  getSearchKeywords(article) {
    // Si Claude a généré des imageSearchTerms, les utiliser
    if (article.imageSearchTerms && article.imageSearchTerms.trim()) {
      const terms = article.imageSearchTerms.split(',').map(t => t.trim()).filter(t => t);
      if (terms.length > 0) {
        this.log(`✓ Utilisation des mots-clés de Claude: ${terms.join(', ')}`);
        return terms;
      }
    }

    // Sinon, utiliser les mots-clés par catégorie
    return this.getCategoryKeywords(article.category);
  }

  /**
   * Mappe la catégorie à des mots-clés de recherche
   */
  getCategoryKeywords(category) {
    const categoryMap = {
      'سياسة': ['arabic politics', 'middle east', 'people', 'government'],
      'اقتصاد': ['economy', 'business', 'financial', 'money', 'trade'],
      'رياضة': ['sports', 'football', 'soccer', 'athletes', 'competition'],
      'تكنولوجيا': ['technology', 'computer', 'digital', 'tech', 'innovation'],
      'ثقافة': ['culture', 'art', 'arabic culture', 'heritage', 'tradition'],
      'بيئة': ['environment', 'nature', 'climate', 'green', 'earth']
    };

    return categoryMap[category] || ['middle east', 'arabic', 'news'];
  }

  /**
   * Récupère une image depuis Pexels
   */
  async fetchPexelsImage(keywords) {
    try {
      // Utiliser le premier mot-clé ou combiner
      const query = keywords[0] || 'arabic news';
      
      await this.log(`Recherche d'image Pexels avec mots-clés: ${query}`);

      let imageUrl;

      if (this.apiKey) {
        // Méthode avec API officielle Pexels
        try {
          const response = await axios.get('https://api.pexels.com/v1/search', {
            params: {
              query: query,
              per_page: 15,
              orientation: 'landscape',
              size: 'large'
            },
            headers: {
              'Authorization': this.apiKey
            }
          });

          if (response.data.photos && response.data.photos.length > 0) {
            const randomImage = response.data.photos[Math.floor(Math.random() * response.data.photos.length)];
            imageUrl = randomImage.src.large2x; // Image haute résolution
            await this.log(`✓ Image trouvée via API Pexels (${response.data.photos.length} résultats)`);
          } else {
            await this.log(`⚠️ Aucune image trouvée pour "${query}"`);
          }
        } catch (apiError) {
          await this.log(`⚠️ Erreur API Pexels: ${apiError.message}, utilisation du fallback`);
        }
      }

      // Fallback si pas de clé API ou erreur API
      if (!imageUrl) {
        const randomId = Math.floor(Math.random() * 1000);
        imageUrl = `https://picsum.photos/1200/630?random=${randomId}`;
        await this.log(`✓ Utilisation de Picsum Photos (fallback)`);
      }

      return imageUrl;
    } catch (error) {
      await this.log(`✗ Erreur lors de la récupération: ${error.message}`);
      return null;
    }
  }

  /**
   * Télécharge et sauvegarde une image
   */
  async downloadImage(url, articleId) {
    try {
      if (!url) return null;

      await this.log(`Téléchargement de l'image depuis: ${url.substring(0, 50)}...`);

      const response = await axios({
        url: url,
        method: 'GET',
        responseType: 'arraybuffer',
        timeout: 10000
      });

      // Créer le dossier s'il n'existe pas
      const imgDir = path.join(__dirname, '../../public/img');
      await fs.mkdir(imgDir, { recursive: true });

      // Nom du fichier
      const filename = `article-${articleId}.jpg`;
      const filepath = path.join(imgDir, filename);

      // Sauvegarder l'image
      await fs.writeFile(filepath, response.data);
      await this.log(`✓ Image sauvegardée: ${filename}`);

      return `/img/${filename}`;
    } catch (error) {
      await this.log(`✗ Erreur lors du téléchargement: ${error.message}`);
      return null;
    }
  }

  /**
   * Génère une image pour un article
   */
  async generateImageForArticle(article) {
    await this.log(`=== Génération d'image pour: ${article.title.substring(0, 50)} ===`);

    // Obtenir les mots-clés (priorité aux mots-clés de Claude)
    const keywords = this.getSearchKeywords(article);

    // Récupérer l'image depuis Pexels
    const imageUrl = await this.fetchPexelsImage(keywords);

    if (!imageUrl) {
      await this.log('✗ Aucune image récupérée pour cet article');
      return null;
    }

    // Télécharger et sauvegarder l'image
    const localPath = await this.downloadImage(imageUrl, article.id || Date.now());

    if (localPath) {
      await this.log(`✓ Image générée avec succès: ${localPath}`);
      return localPath;
    }

    return null;
  }
}

module.exports = ImageFetcher;
