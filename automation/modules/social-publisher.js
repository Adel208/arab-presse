/**
 * Module de partage automatique sur les réseaux sociaux
 * Supporte Twitter, Facebook et LinkedIn
 */

const fs = require('fs').promises;
const path = require('path');

class SocialPublisher {
  constructor(config) {
    this.config = config;
    this.logFile = path.join(__dirname, '../logs/social.log');
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
   * Génère le texte du post pour les réseaux sociaux
   */
  generatePostText(article, platform) {
    const baseUrl = this.config.site.baseUrl;
    const articleUrl = `${baseUrl}/article/${article.slug}`;

    let text = '';

    switch (platform) {
      case 'twitter':
        // Twitter: 280 caractères max
        text = `${article.title}\n\n${article.summary.substring(0, 120)}...\n\n`;
        // Ajouter des hashtags
        const hashtags = this.extractHashtags(article.category);
        text += hashtags + '\n';
        text += articleUrl;
        break;

      case 'facebook':
        // Facebook: plus permissif sur la longueur
        text = `📰 ${article.title}\n\n`;
        text += `${article.summary}\n\n`;
        text += `📖 Lire l'article complet: ${articleUrl}\n\n`;
        text += `#عربي #أخبار #${article.category}`;
        break;

      case 'linkedin':
        // LinkedIn: format professionnel
        text = `${article.title}\n\n`;
        text += `${article.summary}\n\n`;
        text += `📌 Catégorie: ${article.category}\n`;
        text += `📅 ${article.date}\n\n`;
        text += `Lire l'article: ${articleUrl}`;
        break;

      default:
        text = `${article.title}\n\n${article.summary}\n\n${articleUrl}`;
    }

    return text;
  }

  /**
   * Extrait des hashtags de la catégorie
   */
  extractHashtags(category) {
    const hashtagMap = {
      'سياسة': '#سياسة #العالم_العربي #أخبار',
      'اقتصاد': '#اقتصاد #أعمال #تجارة',
      'رياضة': '#رياضة #كرة_القدم #ألعاب',
      'تكنولوجيا': '#تكنولوجيا #تقنية #ابتكار',
      'ثقافة': '#ثقافة #فن #أدب',
      'بيئة': '#بيئة #مناخ #استدامة'
    };

    return hashtagMap[category] || '#عربي #أخبار';
  }

  /**
   * Publie sur Twitter (X)
   */
  async publishToTwitter(article) {
    if (!this.config.social.twitter.enabled) {
      await this.log('Twitter: désactivé dans la configuration');
      return { success: false, reason: 'disabled' };
    }

    try {
      // Note: Nécessite l'installation de twitter-api-v2
      // npm install twitter-api-v2
      const { TwitterApi } = require('twitter-api-v2');

      const client = new TwitterApi({
        appKey: this.config.social.twitter.apiKey,
        appSecret: this.config.social.twitter.apiSecret,
        accessToken: this.config.social.twitter.accessToken,
        accessSecret: this.config.social.twitter.accessTokenSecret,
      });

      const text = this.generatePostText(article, 'twitter');

      const tweet = await client.v2.tweet(text);

      await this.log(`✓ Twitter: tweet publié (ID: ${tweet.data.id})`);

      return {
        success: true,
        platform: 'twitter',
        postId: tweet.data.id,
        url: `https://twitter.com/user/status/${tweet.data.id}`
      };

    } catch (error) {
      await this.log(`✗ Twitter: erreur - ${error.message}`);
      return { success: false, platform: 'twitter', error: error.message };
    }
  }

  /**
   * Publie sur Facebook
   */
  async publishToFacebook(article) {
    if (!this.config.social.facebook.enabled) {
      await this.log('Facebook: désactivé dans la configuration');
      return { success: false, reason: 'disabled' };
    }

    try {
      const axios = require('axios');

      const text = this.generatePostText(article, 'facebook');
      const pageId = this.config.social.facebook.pageId;
      const accessToken = this.config.social.facebook.accessToken;

      const response = await axios.post(
        `https://graph.facebook.com/v18.0/${pageId}/feed`,
        {
          message: text,
          access_token: accessToken
        }
      );

      await this.log(`✓ Facebook: post publié (ID: ${response.data.id})`);

      return {
        success: true,
        platform: 'facebook',
        postId: response.data.id
      };

    } catch (error) {
      await this.log(`✗ Facebook: erreur - ${error.message}`);
      return { success: false, platform: 'facebook', error: error.message };
    }
  }

  /**
   * Publie sur LinkedIn
   */
  async publishToLinkedIn(article) {
    if (!this.config.social.linkedin.enabled) {
      await this.log('LinkedIn: désactivé dans la configuration');
      return { success: false, reason: 'disabled' };
    }

    try {
      const axios = require('axios');

      const text = this.generatePostText(article, 'linkedin');
      const accessToken = this.config.social.linkedin.accessToken;
      const articleUrl = `${this.config.site.baseUrl}/article/${article.slug}`;

      // Récupération du profil utilisateur
      const profileResponse = await axios.get(
        'https://api.linkedin.com/v2/me',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      const userId = profileResponse.data.id;

      // Publication du post
      const postResponse = await axios.post(
        'https://api.linkedin.com/v2/ugcPosts',
        {
          author: `urn:li:person:${userId}`,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: {
                text: text
              },
              shareMediaCategory: 'ARTICLE',
              media: [
                {
                  status: 'READY',
                  originalUrl: articleUrl,
                  title: {
                    text: article.title
                  }
                }
              ]
            }
          },
          visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0'
          }
        }
      );

      await this.log(`✓ LinkedIn: post publié`);

      return {
        success: true,
        platform: 'linkedin',
        postId: postResponse.data.id
      };

    } catch (error) {
      await this.log(`✗ LinkedIn: erreur - ${error.message}`);
      return { success: false, platform: 'linkedin', error: error.message };
    }
  }

  /**
   * Publie sur tous les réseaux sociaux configurés
   */
  async publishArticle(article) {
    await this.log(`=== Publication sociale pour: ${article.title} ===`);

    const results = [];

    // Twitter
    if (this.config.social.twitter.enabled) {
      const result = await this.publishToTwitter(article);
      results.push(result);
    }

    // Facebook
    if (this.config.social.facebook.enabled) {
      const result = await this.publishToFacebook(article);
      results.push(result);
    }

    // LinkedIn
    if (this.config.social.linkedin.enabled) {
      const result = await this.publishToLinkedIn(article);
      results.push(result);
    }

    const successCount = results.filter(r => r.success).length;
    await this.log(`=== Publication terminée: ${successCount}/${results.length} réussies ===\n`);

    return results;
  }

  /**
   * Publie plusieurs articles
   */
  async publishArticles(articles) {
    await this.log(`=== Début de publication sociale pour ${articles.length} articles ===`);

    const allResults = [];

    for (const article of articles) {
      const results = await this.publishArticle(article);
      allResults.push({
        article: article.title,
        results
      });

      // Pause entre les articles
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    return allResults;
  }

  /**
   * Génère un rapport de publication sociale
   */
  generateReport(results) {
    let report = `
╔════════════════════════════════════════════════════════╗
║      RAPPORT DE PUBLICATION SUR RÉSEAUX SOCIAUX         ║
╚════════════════════════════════════════════════════════╝

📅 Date: ${new Date().toLocaleString('fr-FR')}

`;

    results.forEach((item, index) => {
      report += `\n${index + 1}. ${item.article}\n`;
      report += `   ${'-'.repeat(50)}\n`;

      item.results.forEach(result => {
        const icon = result.success ? '✓' : '✗';
        const status = result.success ? 'SUCCÈS' : 'ÉCHEC';
        report += `   ${icon} ${result.platform.toUpperCase()}: ${status}\n`;

        if (result.success && result.url) {
          report += `      URL: ${result.url}\n`;
        }
        if (!result.success && result.error) {
          report += `      Erreur: ${result.error}\n`;
        }
      });
    });

    report += `\n════════════════════════════════════════════════════════\n`;

    return report;
  }
}

module.exports = SocialPublisher;
