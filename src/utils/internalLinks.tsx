import { Link } from 'react-router-dom';
import { NewsItem } from '../types';

/**
 * Trouve des articles pertinents basés sur les mots-clés
 */
export function findRelatedArticlesByKeywords(
  currentArticle: NewsItem,
  allArticles: NewsItem[],
  keywords: string[],
  limit: number = 3
): NewsItem[] {
  // Filtrer l'article actuel
  const otherArticles = allArticles.filter(a => a.id !== currentArticle.id);
  
  // Créer un score de pertinence pour chaque article
  const scoredArticles = otherArticles.map(article => {
    let score = 0;
    
    // Score basé sur les mots-clés communs
    const currentKeywords = currentArticle.keywords?.split('،').map(k => k.trim().toLowerCase()) || [];
    const articleKeywords = article.keywords?.split('،').map(k => k.trim().toLowerCase()) || [];
    
    // Compter les mots-clés communs
    for (const keyword of keywords) {
      const keywordLower = keyword.toLowerCase();
      
      // Vérifier dans les mots-clés de l'article
      if (articleKeywords.some(k => k.includes(keywordLower) || keywordLower.includes(k))) {
        score += 3;
      }
      
      // Vérifier dans le titre
      if (article.title.toLowerCase().includes(keywordLower)) {
        score += 2;
      }
      
      // Vérifier dans le résumé
      if (article.summary.toLowerCase().includes(keywordLower)) {
        score += 1;
      }
    }
    
    // Bonus pour la même catégorie
    if (article.category === currentArticle.category) {
      score += 2;
    }
    
    return { article, score };
  });
  
  // Trier par score et prendre les meilleurs
  return scoredArticles
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.article);
}

/**
 * Ajoute des liens internes dans le texte basés sur des mots-clés importants
 */
export function addInternalLinksToText(
  text: string,
  relatedArticles: NewsItem[],
  maxLinks: number = 1
): JSX.Element {
  if (relatedArticles.length === 0 || maxLinks <= 0) {
    return <>{text}</>;
  }
  
  // Mots-clés importants à lier (priorité aux premiers articles)
  const keywordsToLink: { keyword: string; article: NewsItem }[] = [];
  
  // Extraire des mots-clés importants des articles liés
  relatedArticles.slice(0, maxLinks).forEach(article => {
    const articleKeywords = article.keywords?.split('،').map(k => k.trim()) || [];
    
    // Trouver un mot-clé qui apparaît dans le texte
    const keywordInText = articleKeywords.find(keyword => {
      const keywordLower = keyword.toLowerCase();
      const textLower = text.toLowerCase();
      return textLower.includes(keywordLower) && keyword.length >= 4 && keyword.length <= 20;
    });
    
    if (keywordInText) {
      keywordsToLink.push({
        keyword: keywordInText,
        article
      });
    }
  });
  
  // Si aucun mot-clé trouvé, retourner le texte sans lien
  if (keywordsToLink.length === 0) {
    return <>{text}</>;
  }
  
  // Trier par longueur décroissante pour éviter les conflits (lien le plus long en premier)
  keywordsToLink.sort((a, b) => b.keyword.length - a.keyword.length);
  
  // Créer les liens (maximum un lien par paragraphe pour éviter la surcharge)
  // Prendre le premier mot-clé trouvé dans le texte
  for (const { keyword, article } of keywordsToLink) {
    const keywordIndex = text.indexOf(keyword);
    
    if (keywordIndex !== -1) {
      // S'assurer que c'est un mot entier (pas une partie d'un autre mot)
      const before = keywordIndex > 0 ? text[keywordIndex - 1] : ' ';
      const after = keywordIndex + keyword.length < text.length ? text[keywordIndex + keyword.length] : ' ';
      const isWordBoundary = /[\s،.؛؟!]/.test(before) && /[\s،.؛؟!]/.test(after);
      
      if (isWordBoundary || keywordIndex === 0) {
        const beforeText = text.substring(0, keywordIndex);
        const afterText = text.substring(keywordIndex + keyword.length);
        
        return (
          <>
            {beforeText}
            <Link
              to={`/article/${article.slug}`}
              className="text-blue-600 hover:text-blue-800 hover:underline font-semibold transition-colors"
              title={article.title}
            >
              {keyword}
            </Link>
            {afterText}
          </>
        );
      }
    }
  }
  
  // Si aucun lien n'a été créé, retourner le texte original
  return <>{text}</>;
}

/**
 * Fonction helper pour ajouter des liens contextuels dans un paragraphe
 */
export function enhanceParagraphWithLinks(
  paragraph: string,
  currentArticle: NewsItem,
  allArticles: NewsItem[]
): JSX.Element {
  // Extraire les mots-clés de l'article actuel
  const keywords = currentArticle.keywords?.split('،').map(k => k.trim()) || [];
  
  // Trouver des articles pertinents (maximum 2 liens par paragraphe)
  const relatedArticles = findRelatedArticlesByKeywords(
    currentArticle,
    allArticles,
    keywords,
    2
  );
  
  // Si pas d'articles pertinents ou paragraphe trop court, retourner sans liens
  if (relatedArticles.length === 0 || paragraph.length < 50) {
    return <>{paragraph}</>;
  }
  
  // Ajouter les liens au texte
  const enhancedContent = addInternalLinksToText(paragraph, relatedArticles, 1);
  
  return <>{enhancedContent}</>;
}

