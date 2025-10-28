/**
 * Module de veille automatique des actualités du monde arabe
 * Récupère les dernières news depuis plusieurs sources RSS
 */

const Parser = require('rss-parser');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

class NewsScraper {
  constructor(config) {
    this.config = config;
    this.parser = new Parser({
      headers: {
        'User-Agent': 'ArabPress-NewsBot/1.0'
      }
    });
    this.logFile = path.join(__dirname, '../logs/scraper.log');
  }

  /**
   * Log les messages dans un fichier
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
   * Récupère les articles depuis une source RSS
   */
  async fetchFromRSS(source) {
    try {
      await this.log(`Récupération des articles depuis ${source.name}...`);
      const feed = await this.parser.parseURL(source.url);

      const articles = feed.items.slice(0, 10).map(item => ({
        title: item.title,
        summary: item.contentSnippet || item.description || '',
        link: item.link,
        pubDate: item.pubDate || item.isoDate,
        source: source.name,
        categories: item.categories || []
      }));

      await this.log(`✓ ${articles.length} articles récupérés depuis ${source.name}`);
      return articles;
    } catch (error) {
      await this.log(`✗ Erreur lors de la récupération depuis ${source.name}: ${error.message}`);
      return [];
    }
  }

  /**
   * Catégorise automatiquement un article
   */
  categorizeArticle(article) {
    const keywords = {
      'سياسة': ['سياس', 'حكوم', 'رئيس', 'وزير', 'برلمان', 'انتخاب', 'دبلوماس'],
      'اقتصاد': ['اقتصاد', 'مال', 'بنك', 'تجار', 'استثمار', 'بورص', 'شرك'],
      'رياضة': ['رياض', 'كرة', 'مبارا', 'بطول', 'فريق', 'لاعب', 'نادي'],
      'تكنولوجيا': ['تكنولوجي', 'تقني', 'ذكاء اصطناع', 'إنترنت', 'برمج', 'هاتف', 'حاسوب'],
      'ثقافة': ['ثقاف', 'فن', 'سينما', 'موسيق', 'مسرح', 'أدب', 'كتاب'],
      'بيئة': ['بيئ', 'مناخ', 'طقس', 'تلوث', 'طاق', 'مياه']
    };

    const text = `${article.title} ${article.summary}`.toLowerCase();

    for (const [category, terms] of Object.entries(keywords)) {
      for (const term of terms) {
        if (text.includes(term)) {
          return category;
        }
      }
    }

    return 'سياسة'; // Catégorie par défaut
  }

  /**
   * Filtre les articles pertinents pour le monde arabe
   */
  filterArabNews(articles) {
    const arabKeywords = [
      'مصر', 'السعودية', 'الإمارات', 'المغرب', 'الجزائر', 'تونس', 'ليبيا',
      'السودان', 'لبنان', 'سوريا', 'العراق', 'الأردن', 'فلسطين', 'اليمن',
      'قطر', 'الكويت', 'البحرين', 'عمان', 'موريتانيا', 'جيبوتي', 'الصومال',
      'العرب', 'عربي', 'عربية', 'الوطن العربي', 'الشرق الأوسط'
    ];

    return articles.filter(article => {
      const text = `${article.title} ${article.summary}`.toLowerCase();
      return arabKeywords.some(keyword => text.includes(keyword.toLowerCase()));
    });
  }

  /**
   * Score les articles par pertinence et fraîcheur
   */
  scoreArticles(articles) {
    const now = new Date();

    return articles.map(article => {
      let score = 0;

      // Fraîcheur (0-50 points)
      const pubDate = new Date(article.pubDate);
      const hoursOld = (now - pubDate) / (1000 * 60 * 60);
      score += Math.max(0, 50 - hoursOld);

      // Longueur du résumé (0-20 points)
      score += Math.min(20, article.summary.length / 50);

      // Présence de mots-clés importants (0-30 points)
      const importantKeywords = ['عاجل', 'حصري', 'خاص', 'جديد', 'هام'];
      const text = `${article.title} ${article.summary}`.toLowerCase();
      importantKeywords.forEach(keyword => {
        if (text.includes(keyword)) score += 6;
      });

      return { ...article, score };
    });
  }

  /**
   * Récupère et traite les actualités de toutes les sources
   */
  async fetchLatestNews() {
    await this.log('=== Début de la veille automatique ===');

    const allArticles = [];

    // Récupération depuis toutes les sources
    for (const source of this.config.newsources || this.config.newsSources) {
      if (source.type === 'rss') {
        const articles = await this.fetchFromRSS(source);
        allArticles.push(...articles);
      }
    }

    await this.log(`Total d'articles récupérés: ${allArticles.length}`);

    // Filtrage des articles pertinents
    const arabNews = this.filterArabNews(allArticles);
    await this.log(`Articles pertinents pour le monde arabe: ${arabNews.length}`);

    // Catégorisation
    const categorizedNews = arabNews.map(article => ({
      ...article,
      suggestedCategory: this.categorizeArticle(article)
    }));

    // Scoring et tri
    const scoredNews = this.scoreArticles(categorizedNews);
    scoredNews.sort((a, b) => b.score - a.score);

    // Limite selon la config
    const limit = this.config.automation?.dailyLimit || 3;
    const topNews = scoredNews.slice(0, limit);

    await this.log(`Top ${topNews.length} articles sélectionnés pour génération`);
    await this.log('=== Fin de la veille automatique ===\n');

    return topNews;
  }

  /**
   * Sauvegarde les résultats dans un fichier JSON
   */
  async saveResults(articles) {
    const outputPath = path.join(__dirname, '../logs/latest-news.json');
    await fs.writeFile(outputPath, JSON.stringify(articles, null, 2));
    await this.log(`Résultats sauvegardés dans ${outputPath}`);
  }
}

module.exports = NewsScraper;
