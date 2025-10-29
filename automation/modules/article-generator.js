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

    const prompt = `Tu es un rédacteur professionnel pour un média en ligne spécialisé dans l'actualité du monde arabe.  
Ton objectif est de transformer cette information brute en **article journalistique original, vérifié et conforme aux règles de Google AdSense**.

### CONTEXTE
- Cette information provient d'une veille automatique à partir de sites d'actualité arabes.  
- L'article doit être **inspiré du sujet**, mais **pas une reformulation mot à mot**.  
- Il doit contenir une **analyse contextuelle** ou une **valeur ajoutée** (ex. impact local, comparaison régionale, perspective économique, sociale ou politique).  
- Le ton doit être **neutre, informatif et professionnel**.

### INFORMATIONS SOURCE
TITRE: ${newsItem.title}
RÉSUMÉ: ${newsItem.summary}
CATÉGORIE SUGGÉRÉE: ${newsItem.suggestedCategory}
SOURCE: ${newsItem.source}
LIEN SOURCE: ${newsItem.link}

### INSTRUCTIONS SPÉCIALES
- Rédige le contenu en **arabe moderne standard (العربية الفصحى)**.
- Ne copie aucune phrase d'un autre média : reformule tout.  
- N'invente pas de faits : reste factuel.  
- Évite le style "clickbait".  
- Ajoute toujours une **analyse ou perspective** propre à ton texte.  
- Le contenu doit contenir environ **350 à 1000 mots**.

### QUALITÉ ET STRUCTURE
1. **STRUCTURE DE L'ARTICLE**:
   - Introduction captivante qui accroche le lecteur (2-3 paragraphes)
   - Corps de l'article avec plusieurs sections bien développées
   - Sous-titres descriptifs avec ##
   - Analyse contextuelle et perspective régionale
   - Impact et implications pour le monde arabe
   - Conclusion concise

2. **QUALITÉ RÉDACTIONNELLE**:
   - Style journalistique professionnel et neutre
   - Phrases claires et bien structurées
   - Vocabulaire riche et précis en arabe moderne

3. **CONFORMITÉ ADSENSE**:
   - Contenu original et non dupliqué
   - Informations factuelles et vérifiables
   - Pas de contenu trompeur ou sensationaliste
   - Pas de contenu discriminatoire ou offensant

### FORMAT DE SORTIE
Réponds **UNIQUEMENT au format JSON** suivant (pas de markdown, pas de texte avant ou après) :

{
  "title": "Titre accrocheur et concis en arabe (max 80 caractères)",
  "summary": "Résumé de 2 phrases qui synthétise le sujet",
  "category": "Catégorie parmi: سياسة, اقتصاد, رياضة, تكنولوجيا, ثقافة, بيئة",
  "content": "Article complet en Markdown, environ 350-1000 mots.\n\nUtilise ## pour les sous-titres de section.\nInclure un paragraphe d'analyse personnelle ou régionale.\nTerminer par : 'Sources : [nom de la source]'\nEt une note en italique : '*Cet article a été généré à l'aide d'outils d'intelligence artificielle et vérifié par la rédaction avant publication.*'",
  "metaDescription": "Courte description (max 160 caractères, optimisée pour les moteurs de recherche)",
  "keywords": "mot-clé1, mot-clé2, mot-clé3, mot-clé4, mot-clé5",
  "author": "فريق تحرير عرب برس",
  "imageSearchTerms": "termes anglais pour rechercher une image libre de droit, exemple: arab news protest middle east",
  "imageAlt": "Description de l'image en arabe pour l'accessibilité"
}

CRITÈRES ESSENTIELS:
- Le contenu doit contenir MINIMUM 350 mots et idéalement 800-1000 mots
- Utilise l'arabe moderne standard (فصحى) exclusivement
- Ajoute TOUJOURS une section d'analyse ou de perspective régionale
- Inclut les sources à la fin de l'article
- Assure-toi que le JSON est valide et complet

IMPORTANT: Réponds UNIQUEMENT avec le JSON, rien d'autre avant ou après. Le JSON doit être valide.`;

    try {
      // Adapter max_tokens selon le modèle
      let maxTokens = 8000; // Par défaut pour Sonnet/Opus
      const { model } = this.config.anthropic;
      const isHaiku = model.includes('haiku');
      
      if (isHaiku) {
        maxTokens = 4096; // Limite pour Haiku
      } else if (model.includes('sonnet') || model.includes('opus')) {
        maxTokens = 8000; // Limite pour Sonnet/Opus
      }
      
      // Adapter le prompt pour Haiku (articles plus courts)
      let adaptedPrompt = prompt;
      if (isHaiku) {
        adaptedPrompt = prompt.replace(
          /350 à 1000 mots/g,
          '350 à 600 mots'
        ).replace(
          /800-1000 mots/g,
          '500-600 mots'
        );
      }
      
      const message = await this.anthropic.messages.create({
        model: model,
        max_tokens: maxTokens,
        temperature: 0.7,
        messages: [{
          role: 'user',
          content: adaptedPrompt
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

      // Nettoyer les caractères de contrôle problématiques dans les chaînes JSON
      // Échapper correctement les retours à la ligne dans les valeurs de chaînes
      jsonText = jsonText.replace(/"([^"]*)":\s*"([^"]*(?:\\.[^"]*)*)"/g, (match, key, value) => {
        // Échapper les retours à la ligne et autres caractères de contrôle dans la valeur
        const escapedValue = value
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          .replace(/\t/g, '\\t')
          .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
        return `"${key}": "${escapedValue}"`;
      });

      let articleData;
      try {
        articleData = JSON.parse(jsonText);
      } catch (parseError) {
        // Si le parsing échoue, essayer avec une méthode plus agressive
        await this.log(`⚠️  Erreur de parsing JSON, tentative de correction avancée...`);
        
        // Méthode alternative: remplacer tous les caractères de contrôle par des espaces
        jsonText = jsonText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ' ');
        // Échapper les retours à la ligne non échappés dans les chaînes
        jsonText = jsonText.replace(/([^\\])\n/g, '$1\\n');
        jsonText = jsonText.replace(/([^\\])\r/g, '$1\\r');
        
        try {
          articleData = JSON.parse(jsonText);
        } catch (secondError) {
          // Dernière tentative: utiliser une bibliothèque de réparation JSON si disponible
          // Pour l'instant, on log et on échoue
          await this.log(`✗ JSON invalide reçu de Claude. Position erreur: ${parseError.message}`);
          throw new Error(`Impossible de parser la réponse JSON après tentatives de correction: ${parseError.message}`);
        }
      }

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
   * Calcule un score de qualité pour un article
   */
  calculateQualityScore(article) {
    let score = 0;
    const issues = [];
    const warnings = [];

    // Longueur du contenu (0-30 points)
    const contentLength = article.content?.length || 0;
    if (contentLength < 500) {
      issues.push('Contenu trop court (moins de 500 caractères)');
    } else if (contentLength < 1000) {
      warnings.push('Contenu court (moins de 1000 caractères)');
      score += 10;
    } else if (contentLength < 2000) {
      score += 25;
    } else {
      score += 30;
    }

    // Qualité du titre (0-15 points)
    const titleLength = article.title?.length || 0;
    if (titleLength >= 20 && titleLength <= 80) {
      score += 15;
    } else {
      warnings.push('Titre en dehors de la plage optimale (20-80 caractères)');
      score += 8;
    }

    // Présence de métadonnées essentielles (0-20 points)
    if (article.summary && article.summary.length > 50) score += 5;
    if (article.metaDescription && article.metaDescription.length > 100) score += 5;
    if (article.keywords) score += 5;
    if (article.category) score += 5;

    // Originalité et analyse (0-20 points)
    const content = article.content || '';
    if (content.includes('##')) score += 5; // Présence de sous-titres
    if (content.includes('Sources :') || content.includes('المصادر')) score += 5; // Sources mentionnées
    if (content.includes('intelligence artificielle') || content.includes('ذكاء اصطناعي')) score += 5; // Mention IA
    if (content.length > 1500) score += 5; // Contenu riche

    // Analyse contextuelle (0-15 points)
    const analysisKeywords = ['تحليل', 'تأثير', 'مقارنة', 'منظور', 'perspect', 'analy'];
    const hasAnalysis = analysisKeywords.some(kw => content.toLowerCase().includes(kw));
    if (hasAnalysis) score += 15;
    else {
      warnings.push('Absence d\'analyse contextuelle détectée');
      score += 5;
    }

    return {
      score: Math.min(100, score), // Maximum 100 points
      issues,
      warnings
    };
  }

  /**
   * Sauvegarde les articles générés
   */
  async saveArticles(articles) {
    const outputPath = path.join(__dirname, '../logs/generated-articles.json');
    
    // Calculer les scores de qualité pour tous les articles
    const articlesWithScores = articles.map(article => {
      const quality = this.calculateQualityScore(article);
      return {
        ...article,
        qualityScore: quality.score,
        qualityIssues: quality.issues,
        qualityWarnings: quality.warnings
      };
    });

    await fs.writeFile(outputPath, JSON.stringify(articlesWithScores, null, 2), 'utf-8');
    await this.log(`Articles sauvegardés dans ${outputPath}`);
    
    // Afficher les scores
    for (const article of articlesWithScores) {
      await this.log(`\n${article.title.substring(0, 60)}...`);
      await this.log(`   Score qualité: ${article.qualityScore}/100`);
      if (article.qualityIssues.length > 0) {
        await this.log(`   Problèmes: ${article.qualityIssues.join(', ')}`);
      }
      if (article.qualityWarnings.length > 0) {
        await this.log(`   Avertissements: ${article.qualityWarnings.join(', ')}`);
      }
    }
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
