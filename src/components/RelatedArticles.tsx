import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { NewsItem } from '../types';

interface RelatedArticlesProps {
  currentArticle: NewsItem;
  allArticles: NewsItem[];
  limit?: number;
}

export default function RelatedArticles({ currentArticle, allArticles, limit = 3 }: RelatedArticlesProps) {
  // Fonction pour calculer un score de similarité entre deux articles
  const calculateSimilarityScore = (article1: NewsItem, article2: NewsItem): number => {
    let score = 0;

    // Bonus important pour la même catégorie
    if (article1.category === article2.category) {
      score += 10;
    }

    // Score basé sur les mots-clés communs
    const keywords1 = (article1.keywords || '').split('،').map(k => k.trim().toLowerCase());
    const keywords2 = (article2.keywords || '').split('،').map(k => k.trim().toLowerCase());
    
    // Compter les mots-clés communs
    const commonKeywords = keywords1.filter(k => keywords2.some(k2 => k2.includes(k) || k.includes(k2)));
    score += commonKeywords.length * 5;

    // Score basé sur les mots communs dans le titre
    const title1Words = article1.title.toLowerCase().split(/\s+/);
    const title2Words = article2.title.toLowerCase().split(/\s+/);
    const commonTitleWords = title1Words.filter(w => w.length > 3 && title2Words.includes(w));
    score += commonTitleWords.length * 3;

    // Score basé sur les mots communs dans le résumé
    const summary1Words = (article1.summary || '').toLowerCase().split(/\s+/);
    const summary2Words = (article2.summary || '').toLowerCase().split(/\s+/);
    const commonSummaryWords = summary1Words.filter(w => w.length > 4 && summary2Words.includes(w));
    score += commonSummaryWords.length * 1;

    // Bonus pour les articles récents (moins de 30 jours)
    const articleDate = new Date(article2.date);
    const daysDiff = (Date.now() - articleDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff < 30) {
      score += 2;
    }

    return score;
  };

  // Calculer les scores de similarité pour tous les articles
  const articlesWithScores = allArticles
    .filter(article => article.id !== currentArticle.id)
    .map(article => ({
      article,
      score: calculateSimilarityScore(currentArticle, article)
    }))
    .filter(item => item.score > 0) // Exclure les articles sans similarité
    .sort((a, b) => b.score - a.score) // Trier par score décroissant
    .slice(0, limit)
    .map(item => item.article);

  // Si pas assez d'articles avec similarité, ajouter des articles de la même catégorie
  if (articlesWithScores.length < limit) {
    const sameCategoryArticles = allArticles
      .filter(article => 
        article.id !== currentArticle.id && 
        article.category === currentArticle.category &&
        !articlesWithScores.some(a => a.id === article.id)
      )
      .slice(0, limit - articlesWithScores.length);
    
    articlesWithScores.push(...sameCategoryArticles);
  }

  // Si encore pas assez, ajouter n'importe quels articles récents
  if (articlesWithScores.length < limit) {
    const additionalArticles = allArticles
      .filter(article => 
        article.id !== currentArticle.id && 
        !articlesWithScores.some(a => a.id === article.id)
      )
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, limit - articlesWithScores.length);
    
    articlesWithScores.push(...additionalArticles);
  }

  const relatedArticles = articlesWithScores;

  if (relatedArticles.length === 0) {
    return null;
  }

  // Données structurées ItemList pour les articles liés
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "مقالات متعلقة",
    "description": `مقالات متعلقة بـ: ${currentArticle.title}`,
    "numberOfItems": relatedArticles.length,
    "itemListElement": relatedArticles.map((article, index) => {
      const item: any = {
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "NewsArticle",
          "headline": article.title,
          "url": `${window.location.origin}/article/${article.slug}`,
          "datePublished": article.date
        }
      };
      
      if (article.image) {
        item.item.image = `${window.location.origin}${article.image}`;
      }
      
      return item;
    })
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(itemListSchema)}
        </script>
      </Helmet>
      <section className="mt-16 pt-12 border-t border-gray-200">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
          <span className="text-blue-600">مواضيع متعلقة</span>
        </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedArticles.map((article) => (
          <Link
            key={article.id}
            to={`/article/${article.slug}`}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group border border-gray-100"
          >
            {article.image ? (
              <div className="relative w-full h-48 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  width="400"
                  height="300"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-full h-48"></div>
            )}
            
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                  {article.category}
                </span>
                <time dateTime={article.date} className="text-xs text-gray-500">
                  {article.date}
                </time>
              </div>
              
              <h3 className="text-lg font-extrabold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {article.title}
              </h3>
              
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                {article.summary}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
    </>
  );
}

