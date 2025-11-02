import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { newsData, categories } from './data';
import AdBanner from './components/AdBanner';
import AdUnit from './components/AdUnit';
import { trackPageView } from './utils/analytics';
import { adsConfig } from './config/ads';

// Descriptions et mots-clés pour chaque catégorie
const categoryData: { [key: string]: { description: string; keywords: string; h1: string } } = {
  'سياسة': {
    description: 'آخر أخبار السياسة العربية والعالمية، تحليلات سياسية عميقة، انتخابات، حكومات، علاقات دولية، وقرارات سياسية مهمة تؤثر على المنطقة العربية.',
    keywords: 'أخبار سياسية، سياسة عربية، انتخابات، حكومات، علاقات دولية، قرارات سياسية، تحليلات سياسية',
    h1: 'أخبار السياسة العربية والعالمية'
  },
  'اقتصاد': {
    description: 'آخر أخبار الاقتصاد العربي والعالمي، تحليلات اقتصادية، أسواق مالية، عملات، تجارة، استثمارات، ونمو اقتصادي في المنطقة العربية.',
    keywords: 'أخبار اقتصادية، اقتصاد عربي، أسواق مالية، عملات، تجارة، استثمارات، نمو اقتصادي',
    h1: 'أخبار الاقتصاد العربي والعالمي'
  },
  'رياضة': {
    description: 'آخر أخبار الرياضة العربية والعالمية، نتائج المباريات، بطولات، لاعبون، أندية، وكأس العالم في جميع الرياضات.',
    keywords: 'أخبار رياضية، رياضة عربية، مباريات، بطولات، لاعبون، أندية، كأس العالم',
    h1: 'أخبار الرياضة العربية والعالمية'
  },
  'تكنولوجيا': {
    description: 'آخر أخبار التكنولوجيا والابتكارات، أجهزة جديدة، تطبيقات، ذكاء اصطناعي، وإنترنت الأشياء في المنطقة العربية.',
    keywords: 'أخبار تقنية، تكنولوجيا، أجهزة، تطبيقات، ذكاء اصطناعي، إنترنت الأشياء، ابتكارات',
    h1: 'أخبار التكنولوجيا والابتكارات'
  },
  'ثقافة': {
    description: 'آخر أخبار الثقافة والفنون العربية، كتب، أفلام، موسيقى، معارض، ومهرجانات ثقافية في المنطقة العربية.',
    keywords: 'أخبار ثقافية، ثقافة عربية، كتب، أفلام، موسيقى، معارض، مهرجانات ثقافية، فنون',
    h1: 'أخبار الثقافة والفنون العربية'
  },
  'بيئة': {
    description: 'آخر أخبار البيئة والتغير المناخي في المنطقة العربية، حماية البيئة، الطاقة المتجددة، والتحديات البيئية.',
    keywords: 'أخبار بيئية، بيئة، تغير مناخي، حماية البيئة، طاقة متجددة، تحديات بيئية',
    h1: 'أخبار البيئة والتغير المناخي'
  }
};

const ARTICLES_PER_PAGE = 10;

export default function CategoryPage(): JSX.Element {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [searchParams] = useSearchParams();
  const category = categorySlug ? decodeURIComponent(categorySlug) : '';
  
  // Pagination
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  
  // Vérifier que la catégorie existe
  const isValidCategory = categories.includes(category) && category !== 'الرئيسة';
  
  // Tous les articles de la catégorie (triés)
  const allCategoryArticles = useMemo(() => {
    return newsData
      .filter((item) => item.category === category)
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });
  }, [category]);
  
  // Pagination
  const totalPages = Math.ceil(allCategoryArticles.length / ARTICLES_PER_PAGE);
  const validPage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const startIndex = (validPage - 1) * ARTICLES_PER_PAGE;
  const endIndex = startIndex + ARTICLES_PER_PAGE;
  const categoryArticles = allCategoryArticles.slice(startIndex, endIndex);

  const categoryInfo = categoryData[category] || {
    description: `آخر أخبار ${category} في المنطقة العربية والعالمية.`,
    keywords: `أخبار ${category}`,
    h1: `أخبار ${category}`
  };

  // Track page view
  useEffect(() => {
    if (isValidCategory) {
      trackPageView(`/category/${categorySlug}`, categoryInfo.h1);
    }
  }, [categorySlug, isValidCategory, categoryInfo.h1]);

  if (!isValidCategory) {
    return (
      <div dir="rtl" lang="ar" className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">الصفحة غير موجودة</h1>
          <Link to="/" className="text-blue-600 hover:underline">العودة إلى الصفحة الرئيسية</Link>
        </div>
      </div>
    );
  }

  const canonicalUrl = validPage === 1 
    ? `${window.location.origin}/category/${categorySlug}`
    : `${window.location.origin}/category/${categorySlug}?page=${validPage}`;
  const pageTitle = validPage === 1 
    ? `${categoryInfo.h1} - صدى العرب`
    : `${categoryInfo.h1} - صفحة ${validPage} - صدى العرب`;

  // Données structurées Schema.org pour la page de catégorie
  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": categoryInfo.h1,
    "description": categoryInfo.description,
    "url": canonicalUrl,
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": allCategoryArticles.length,
        "numberOfPages": totalPages,
        "itemListElement": categoryArticles.map((article, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "NewsArticle",
          "headline": article.title,
          "url": `${window.location.origin}/article/${article.slug}`,
          "image": article.image ? `${window.location.origin}${article.image}` : undefined,
          "datePublished": article.date,
          "author": {
            "@type": "Person",
            "name": article.author || "هيئة التحرير"
          }
        }
      }))
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "الرئيسية",
          "item": window.location.origin
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": category,
          "item": canonicalUrl
        }
      ]
    }
  };

  // Fonction helper pour obtenir l'image d'un article
  const getArticleImage = (article: typeof newsData[0]) => {
    if (article.image && article.image.trim() !== '') {
      return article.image;
    }
    const imageMap: { [key: number]: string } = {
      1: '/img/gabesmanif.webp',
      2: '/img/marocmanif.webp',
      3: '/img/sudan-un-flags.webp',
      4: '/img/turkey-uk-flags.webp',
      5: '/img/darfoure.webp',
      6: '/img/ben-barka.webp',
      7: '/img/ben-barka.webp',
      8: '/img/marocmanif.webp',
      9: '/img/ben-barka.webp',
      10: '/img/eu-sudan-flags.webp',
      12: '/img/darfoure.webp',
      13: '/img/tunispolic.webp',
    };
    return imageMap[article.id] || '/img/gabesmanif.webp';
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={categoryInfo.description} />
        <meta name="keywords" content={categoryInfo.keywords} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={categoryInfo.description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="صدى العرب" />
        <meta property="og:image" content={`${window.location.origin}/img/og-home.webp`} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={categoryInfo.description} />
        <meta name="twitter:image" content={`${window.location.origin}/img/og-home.webp`} />
        
        {/* Données structurées */}
        <script type="application/ld+json">
          {JSON.stringify(categorySchema)}
        </script>
        
        {/* Liens de pagination pour SEO */}
        {validPage > 1 && (
          <link rel="prev" href={`${window.location.origin}/category/${categorySlug}${validPage === 2 ? '' : `?page=${validPage - 1}`}`} />
        )}
        {validPage < totalPages && (
          <link rel="next" href={`${window.location.origin}/category/${categorySlug}?page=${validPage + 1}`} />
        )}
        {validPage > 1 && (
          <meta name="robots" content="noindex,follow" />
        )}
      </Helmet>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Bannière publicitaire */}
        <AdBanner slotId={adsConfig.slots.headerBanner} style={{ width: '100%', height: '90px' }} format="horizontal" />
        
        {/* Header de catégorie */}
        <div className="mb-8">
          <nav className="text-sm text-gray-600 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li><Link to="/" className="hover:text-blue-600 transition-colors">الرئيسية</Link></li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium">{category}</li>
            </ol>
          </nav>
          
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            {categoryInfo.h1}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
            {categoryInfo.description}
          </p>
          <p className="text-sm text-gray-500 mt-4">
            {categoryArticles.length} مقال
          </p>
          <p className="text-sm text-gray-500 mt-2">
            صفحة {validPage} من {totalPages} ({allCategoryArticles.length} مقال إجمالاً)
          </p>
        </div>

        {/* Articles de la catégorie */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Liste principale des articles */}
          <div className="lg:col-span-2 space-y-6">
            {categoryArticles.length > 0 ? (
              categoryArticles.map((article) => {
                const articleImage = getArticleImage(article);
                return (
                  <Link
                    key={article.id}
                    to={`/article/${article.slug}`}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 group"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      <div className="md:w-64 md:flex-shrink-0 h-48 md:h-full overflow-hidden">
                        <img
                          src={articleImage}
                          alt={article.imageAlt || article.title}
                          width="400"
                          height="300"
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      
                      {/* Contenu */}
                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-3">
                            {article.category}
                          </span>
                          <h2 className="text-2xl font-extrabold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {article.title}
                          </h2>
                          <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                            {article.summary}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{new Date(article.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                          <span className="flex items-center gap-1 group-hover:text-blue-600 transition-colors">
                            اقرأ المزيد
                            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <p className="text-xl text-gray-600">لا توجد مقالات في هذه الفئة حالياً.</p>
                <Link to="/" className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-semibold">
                  العودة إلى الصفحة الرئيسية
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:w-64 space-y-6">
            {/* Catégories */}
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-32 h-fit border border-gray-100">
              <h3 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-3 border-b border-gray-200 pb-4">
                <span className="text-blue-600">التصنيفات</span>
              </h3>
              <ul className="space-y-2">
                {categories.filter(cat => cat !== 'الرئيسة').map((cat) => (
                  <li key={cat}>
                    <Link
                      to={`/category/${encodeURIComponent(cat)}`}
                      className={`block py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                        cat === category
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    >
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Publicité */}
            <AdUnit position="sidebar" className="sticky top-96" />
          </aside>
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-12 flex justify-center items-center gap-2 flex-wrap" aria-label="التنقل بين الصفحات">
            {/* Lien Précédent */}
            {validPage > 1 ? (
              <Link
                to={`/category/${categorySlug}${validPage === 2 ? '' : `?page=${validPage - 1}`}`}
                className="px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg hover:bg-blue-50 text-gray-700 font-semibold transition-all duration-200 flex items-center gap-2"
              >
                <span>←</span>
                السابق
              </Link>
            ) : (
              <span className="px-4 py-2 bg-gray-100 rounded-lg text-gray-400 cursor-not-allowed flex items-center gap-2">
                <span>←</span>
                السابق
              </span>
            )}

            {/* Numéros de pages */}
            <div className="flex items-center gap-2 flex-wrap">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (validPage <= 3) {
                  pageNum = i + 1;
                } else if (validPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = validPage - 2 + i;
                }

                return (
                  <Link
                    key={pageNum}
                    to={`/category/${categorySlug}${pageNum === 1 ? '' : `?page=${pageNum}`}`}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 min-w-[40px] text-center ${
                      pageNum === validPage
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-gray-700 shadow-md hover:shadow-lg hover:bg-blue-50'
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}
            </div>

            {/* Lien Suivant */}
            {validPage < totalPages ? (
              <Link
                to={`/category/${categorySlug}?page=${validPage + 1}`}
                className="px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg hover:bg-blue-50 text-gray-700 font-semibold transition-all duration-200 flex items-center gap-2"
              >
                التالي
                <span>→</span>
              </Link>
            ) : (
              <span className="px-4 py-2 bg-gray-100 rounded-lg text-gray-400 cursor-not-allowed flex items-center gap-2">
                التالي
                <span>→</span>
              </span>
            )}
          </nav>
        )}
      </div>
    </>
  );
}

