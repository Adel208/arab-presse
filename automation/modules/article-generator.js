/**
 * Générateur d'articles professionnels avec l'API Claude d'Anthropic
 * Crée des articles complets, SEO-optimisés en arabe
 */

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs').promises;
const path = require('path');

class ArticleGenerator {
  constructor(config) {
    this.config = config;
    this.anthropic = new Anthropic({
      apiKey: config.anthropic.apiKey
    });
    this.logFile = path.join(__dirname, '../logs/generator.log');
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
   * Génère un slug SEO-friendly à partir du titre
   */
  generateSlug(title) {
    // Translittération basique arabe -> latin pour le slug
    const translitMap = {
      'ا': 'a', 'أ': 'a', 'إ': 'i', 'آ': 'a',
      'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j',
      'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'dh',
      'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh',
      'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z',
      'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
      'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
      'ه': 'h', 'و': 'w', 'ي': 'y', 'ى': 'a',
      'ة': 'a', 'ء': '', ' ': '-'
    };

    let slug = title.toLowerCase();

    // Translittération caractère par caractère
    slug = slug.split('').map(char => translitMap[char] || char).join('');

    // Nettoyage
    slug = slug
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
      .substring(0, 60);

    return slug;
  }

  /**
   * Génère un article complet avec Claude
   */
  async generateArticle(newsItem) {
    await this.log(`Génération d'article pour: ${newsItem.title}`);

    const prompt = `Tu es un journaliste professionnel spécialisé dans le monde arabe. Tu dois rédiger un article complet en arabe (langue arabe standard moderne) basé sur cette information :

TITRE: ${newsItem.title}
RÉSUMÉ: ${newsItem.summary}
CATÉGORIE SUGGÉRÉE: ${newsItem.suggestedCategory}
SOURCE: ${newsItem.source}
LIEN SOURCE: ${newsItem.link}

INSTRUCTIONS IMPORTANTES:

1. STRUCTURE DE L'ARTICLE:
   - Introduction captivante (2-3 paragraphes)
   - Corps de l'article avec plusieurs sections bien développées (minimum 5 sections)
   - Contexte et analyse approfondie
   - Témoignages ou citations (si pertinent)
   - Impact et implications
   - Conclusion

2. QUALITÉ RÉDACTIONNELLE:
   - Style journalistique professionnel
   - Ton neutre et objectif
   - Phrases claires et bien structurées
   - Minimum 1500 mots
   - Utilise l'arabe standard moderne (فصحى)

3. SEO ET MOTS-CLÉS:
   - Intègre naturellement des mots-clés pertinents
   - Utilise des sous-titres descriptifs (##)
   - Optimise pour le référencement

4. FORMAT DE SORTIE:
   Tu dois répondre UNIQUEMENT avec un objet JSON valide (pas de markdown, pas de texte avant ou après) ayant cette structure EXACTE:

{
  "title": "Titre optimisé en arabe",
  "summary": "Résumé accrocheur de 2-3 phrases (150-200 caractères)",
  "category": "catégorie parmi: سياسة, اقتصاد, رياضة, تكنولوجيا, ثقافة, بيئة",
  "content": "Article complet en markdown avec ## pour les sous-titres",
  "metaDescription": "Description SEO (150-160 caractères)",
  "keywords": "mot-clé1, mot-clé2, mot-clé3, mot-clé4, mot-clé5",
  "author": "فريق تحرير عرب برس",
  "imageSearchTerms": "mot clé anglais 1, mot clé anglais 2, mot clé anglais 3",
  "imageAlt": "Description de l'image en arabe"
}

IMPORTANT: Réponds UNIQUEMENT avec le JSON, rien d'autre. Assure-toi que le JSON est valide et complet.`;

    try {
      const message = await this.anthropic.messages.create({
        model: this.config.anthropic.model,
        max_tokens: 8000,
        temperature: 0.7,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const responseText = message.content[0].text.trim();

      // Extraction du JSON (au cas où Claude ajoute du texte autour)
      let jsonText = responseText;
      
      // Nettoyer le markdown (```json, ```, etc.)
      jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      // Extraire le JSON avec regex
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
  


      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }

      const articleData = JSON.parse(jsonText);

      // Validation des champs requis
      const requiredFields = ['title', 'summary', 'category', 'content'];
      for (const field of requiredFields) {
        if (!articleData[field]) {
          throw new Error(`Champ requis manquant: ${field}`);
        }
      }

      await this.log(`✓ Article généré avec succès: ${articleData.title.substring(0, 50)}...`);

      return articleData;

    } catch (error) {
      await this.log(`✗ Erreur lors de la génération: ${error.message}`);
      throw error;
    }
  }

  /**
   * Génère plusieurs articles depuis une liste de news
   */
  async generateArticles(newsItems) {
    await this.log(`=== Début de génération de ${newsItems.length} articles ===`);

    const articles = [];
    const errors = [];

    for (let i = 0; i < newsItems.length; i++) {
      const newsItem = newsItems[i];

      try {
        await this.log(`[${i + 1}/${newsItems.length}] Génération en cours...`);

        const article = await this.generateArticle(newsItem);

        // Ajout des métadonnées
        const now = new Date();
        const enrichedArticle = {
          ...article,
          slug: this.generateSlug(article.title),
          date: now.toISOString().split('T')[0],
          sourceUrl: newsItem.link,
          sourceName: newsItem.source,
          generatedAt: now.toISOString()
        };

        articles.push(enrichedArticle);

        // Pause entre les requêtes pour respecter les rate limits
        if (i < newsItems.length - 1) {
          await this.log('Pause de 2 secondes...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }

      } catch (error) {
        await this.log(`✗ Échec pour "${newsItem.title}": ${error.message}`);
        errors.push({
          newsItem,
          error: error.message
        });
      }
    }

    await this.log(`=== Génération terminée: ${articles.length} réussis, ${errors.length} échecs ===\n`);

    return { articles, errors };
  }

  /**
   * Sauvegarde les articles générés
   */
  async saveArticles(articles) {
    const outputPath = path.join(__dirname, '../logs/generated-articles.json');
    await fs.writeFile(outputPath, JSON.stringify(articles, null, 2), 'utf-8');
    await this.log(`Articles sauvegardés dans ${outputPath}`);
  }

  /**
   * Génère un aperçu texte d'un article
   */
  getArticlePreview(article) {
    return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📰 ${article.title}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📂 Catégorie: ${article.category}
🔗 Slug: ${article.slug}
📅 Date: ${article.date}
✍️  Auteur: ${article.author || 'N/A'}

📝 Résumé:
${article.summary}

🔍 Meta Description:
${article.metaDescription}

🏷️  Mots-clés: ${article.keywords}

📊 Longueur contenu: ${article.content.length} caractères

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
  }
}

module.exports = ArticleGenerator;
