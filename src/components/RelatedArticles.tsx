import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { NewsItem } from '../types';

interface RelatedArticlesProps {
  currentArticle: NewsItem;
  allArticles: NewsItem[];
  limit?: number;
}

export default function RelatedArticles({ currentArticle, allArticles, limit = 3 }: RelatedArticlesProps) {
  // Filtrer les articles par catégorie et exclure l'article actuel
  const relatedArticles = allArticles
    .filter(article => 
      article.id !== currentArticle.id && 
      article.category === currentArticle.category
    )
    .slice(0, limit);

  // Si pas assez d'articles dans la même catégorie, ajouter d'autres articles
  if (relatedArticles.length < limit) {
    const additionalArticles = allArticles
      .filter(article => 
        article.id !== currentArticle.id && 
        !relatedArticles.some(rel => rel.id === article.id)
      )
      .slice(0, limit - relatedArticles.length);
    
    relatedArticles.push(...additionalArticles);
  }

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

