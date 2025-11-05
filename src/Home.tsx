import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { newsData, categories } from './data';
import AdBanner from './components/AdBanner';
import AdUnit from './components/AdUnit';
import { trackPageView } from './utils/analytics';
import { adsConfig } from './config/ads';

export default function Home(): JSX.Element {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>('الرئيسة');

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory('الرئيسة');
    }
    
    // Track page view
    trackPageView(window.location.pathname, 'Home');
  }, [searchParams]);

  const filteredNews = newsData
    .filter((item) =>
      selectedCategory === 'الرئيسة' || item.category === selectedCategory
    )
    .sort((a, b) => {
      // Trier par date décroissante (plus récent en premier)
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });

  // Récupérer le dernier article pour le Hero
  const latestArticle = filteredNews.length > 0 ? filteredNews[0] : null;
  
  // Fonction helper pour obtenir l'image d'un article avec fallbacks
  const getArticleImage = (article: typeof newsData[0]) => {
    // D'abord, utiliser l'image de l'article si elle existe
    if (article.image && article.image.trim() !== '') {
      return article.image;
    }
    
    // Ensuite, fallbacks spécifiques selon l'ID de l'article (pour les articles sans image définie)
    const imageMap: { [key: number]: string } = {
      1: '/img/gabesmanif.webp',
      2: '/img/marocmanif.webp',
      3: '/img/sudan-un-flags.webp',
      4: '/img/turkey-uk-flags.webp',
      5: '/img/darfoure.webp',
      6: '/img/ben-barka.webp', // ID 6 n'a pas d'image dans data.ts
      7: '/img/ben-barka.webp',
      8: '/img/marocmanif.webp',
      9: '/img/ben-barka.webp',
      10: '/img/eu-sudan-flags.webp',
      12: '/img/darfoure.webp',
      13: '/img/tunispolic.webp',
      17: '/img/zohran mamdani.webp',
    };
    
    return imageMap[article.id] || '/img/gabesmanif.webp'; // Image par défaut si aucun mapping trouvé
  };

  // Données structurées pour la page d'accueil enrichies
  const homeStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "صدى العرب",
    "url": window.location.origin,
    "description": "مصدرك الموثوق للأخبار العاجلة والتحليلات المتعمقة باللغة العربية",
    "inLanguage": "ar",
    "publisher": {
      "@type": "Organization",
      "name": "صدى العرب",
      "alternateName": "Arab Press",
      "url": window.location.origin,
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/logo.svg`,
        "width": 512,
        "height": 512
      },
      "description": "مصدرك الموثوق للأخبار العاجلة والتحليلات المتعمقة باللغة العربية، مع تغطية شاملة للأحداث السياسية والاقتصادية والثقافية والبيئية.",
      "foundingDate": "2024",
      "sameAs": [
        "https://www.facebook.com/profile.php?id=61583290285231"
      ],
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "contactType": "Customer Service",
          "email": "sadaarabe@gmail.com",
          "availableLanguage": ["Arabic", "French"],
          "areaServed": {
            "@type": "Country",
            "name": "France"
          }
        },
        {
          "@type": "ContactPoint",
          "contactType": "Editorial",
          "email": "sadaarabe@gmail.com",
          "availableLanguage": ["Arabic", "French"]
        },
        {
          "@type": "ContactPoint",
          "contactType": "Partnership",
          "email": "sadaarabe@gmail.com",
          "availableLanguage": ["Arabic", "French", "English"]
        }
      ],
      "publishingPrinciples": `${window.location.origin}/terms`,
      "knowsAbout": [
        "أخبار عربية",
        "سياسة",
        "اقتصاد",
        "رياضة",
        "تكنولوجيا",
        "ثقافة",
        "بيئة"
      ]
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${window.location.origin}/?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const canonicalUrl = selectedCategory === 'الرئيسة' 
    ? window.location.origin 
    : `${window.location.origin}/?category=${encodeURIComponent(selectedCategory)}`;

  // Données structurées ItemList pour la liste des articles
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": selectedCategory === 'الرئيسة' ? "أحدث الأخبار" : `أخبار ${selectedCategory}`,
    "description": `قائمة المقالات ${selectedCategory === 'الرئيسة' ? '' : `في فئة ${selectedCategory}`}`,
    "numberOfItems": filteredNews.length,
    "itemListElement": filteredNews.slice(0, 20).map((article, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "NewsArticle",
        "headline": article.title,
        "description": article.summary,
        "url": `${window.location.origin}/article/${article.slug}`,
        "image": article.image ? `${window.location.origin}${article.image}` : `${window.location.origin}${getArticleImage(article)}`,
        "datePublished": article.date,
        "author": {
          "@type": "Person",
          "name": article.author || "هيئة التحرير"
        },
        "articleSection": article.category
      }
    }))
  };

  return (
    <div dir="rtl" lang="ar" className="bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900 font-arabic min-h-screen">
      <Helmet>
        <title>صدى العرب - مصدرك الموثوق للأخبار العاجلة</title>
        <meta name="description" content="مصدرك الموثوق للأخبار العاجلة والتحليلات المتعمقة باللغة العربية، مع تغطية شاملة للأحداث السياسية والاقتصادية والثقافية والبيئية." />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" type="application/rss+xml" title="صدى العرب - RSS Feed" href={`${window.location.origin}/feed.xml`} />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="صدى العرب" />
        <meta property="og:description" content="مصدرك الموثوق للأخبار العاجلة والتحليلات المتعمقة باللغة العربية" />
        <meta property="og:site_name" content="صدى العرب" />
        <meta property="og:image" content={`${window.location.origin}/img/og-home.webp`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/webp" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="صدى العرب" />
        <meta name="twitter:description" content="مصدرك الموثوق للأخبار العاجلة والتحليلات المتعمقة باللغة العربية" />
        <meta name="twitter:image" content={`${window.location.origin}/img/og-home.webp`} />
        
        <script type="application/ld+json">
          {JSON.stringify(homeStructuredData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(itemListSchema)}
        </script>
      </Helmet>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Bannière publicitaire en haut */}
        <AdBanner slotId={adsConfig.slots.headerBanner} style={{ width: '100%', height: '90px' }} format="horizontal" />
        
        {/* Breaking News Bar */}
        {selectedCategory === 'الرئيسة' && filteredNews.length > 0 && (
          <div className="mb-6 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6 rounded-full flex items-center gap-4 shadow-large overflow-hidden relative">
            <span className="font-black text-sm whitespace-nowrap flex items-center gap-2 bg-white/20 px-4 py-1 rounded-full backdrop-blur-sm">
              <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046a1 1 0 01.414 0h1a1 1 0 01.894.553L15.92 4H18a1 1 0 010 2h-1.382l-.724 3.633A3 3 0 0012.854 12H7.146a3 3 0 00-2.94-2.367L3.382 6H2a1 1 0 110-2h2.08l1.304-2.447a1 1 0 01.894-.553h1zM5.654 6l.724 3.633A1 1 0 007.146 10h5.708a1 1 0 00.768-.367L14.346 6H5.654zM9 13a3 3 0 106 0 3 3 0 00-6 0zm-5 3a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
              الأخبار العاجلة
            </span>
            <div className="flex-1 overflow-hidden">
              <div className="animate-scroll">
                <span className="mr-8 font-semibold">{filteredNews[0]?.title}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Hero Section - Breaking News - Full Screen with Overlay */}
        {selectedCategory === 'الرئيسة' && latestArticle && (
          <section className="mb-16 relative h-[600px] md:h-[700px] rounded-3xl overflow-hidden shadow-large group animate-scaleIn">
            <div className="absolute inset-0">
              <img 
                src={getArticleImage(latestArticle)} 
                alt={latestArticle.imageAlt || latestArticle.title}
                width="1200"
                height="800"
                loading="eager"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30"></div>
            </div>
            <div className="relative z-10 h-full flex items-end">
              <div className="max-w-4xl px-8 py-12 text-white">
                <span className="inline-block px-4 py-2 bg-red-600 text-white text-sm font-black rounded-full mb-4 tracking-wider shadow-large">
                  {latestArticle.category} • الأخبار العاجلة
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight drop-shadow-2xl">
                  {latestArticle.title}
                </h2>
                <p className="text-lg md:text-xl text-gray-100 mb-8 leading-relaxed max-w-3xl drop-shadow-lg">
                  {latestArticle.summary}
                </p>
                <div className="flex flex-wrap gap-4 items-center">
                  <Link to={`/article/${latestArticle.slug}`} className="inline-flex items-center gap-3 bg-white text-gray-900 font-black py-4 px-8 rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-large hover:shadow-2xl hover:scale-105 group/btn">
                    اقرأ المزيد
                    <span className="transform transition-transform duration-300 group-hover/btn:translate-x-2">→</span>
                  </Link>
                  <time className="inline-flex items-center gap-2 text-gray-300 text-sm font-semibold bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg" dateTime={latestArticle.date}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    {new Date(latestArticle.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </time>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Section أحدث الأخبار - Juste après le Hero */}
        <section className="flex flex-col lg:flex-row-reverse gap-10 lg:gap-12 mb-16">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-10 border-b border-gray-200 pb-6">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                <span className="text-blue-600">{selectedCategory === 'الرئيسة' ? 'أحدث الأخبار' : `أخبار ${selectedCategory}`}</span>
              </h2>
              <p className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full font-medium">
                {filteredNews.length} مقال متاح
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((item) => (
                <article key={item.id} className="bg-white rounded-2xl shadow-soft overflow-hidden card-hover group border border-gray-100/50 backdrop-blur-sm animate-slideUp">
{item.image ? (
                    <div className="relative w-full h-56 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.imageAlt || item.title}
                        width="400"
                        height="300"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                  ) : item.id === 7 ? (
                    <div className="relative w-full h-56 overflow-hidden">
                      <img
                        src="/img/gabesmanif.webp"
                        alt={item.title}
                        width="400"
                        height="300"
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                  ) : item.id === 8 ? (
                    <div className="relative w-full h-56 overflow-hidden">
                      <img
                        src="/img/marocmanif.webp"
                        alt={item.title}
                        width="400"
                        height="300"
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                  ) : item.id === 5 ? (
                    <div className="relative w-full h-56 overflow-hidden">
                      <img
                        src="/img/turkey-uk-flags.webp"
                        alt="أعلام تركيا وبريطانيا"
                        width="400"
                        height="300"
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                  ) : item.id === 4 ? (
                    <div className="relative w-full h-56 overflow-hidden">
                      <img
                        src="/img/sudan-un-flags.webp"
                        alt="أعلام الأمم المتحدة والسودان"
                        width="400"
                        height="300"
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                  ) : item.id === 9 ? (
                    <div className="relative w-full h-56 overflow-hidden">
                      <img
                        src="/img/ben-barka.webp"
                        alt="المهدي بن بركة"
                        width="400"
                        height="300"
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                  ) : item.id === 10 ? (
                    <div className="relative w-full h-56 overflow-hidden">
                      <img
                        src="/img/eu-sudan-flags.webp"
                        alt="أعلام الاتحاد الأوروبي والسودان"
                        width="400"
                        height="300"
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                  ) : (
                    <div className="bg-gray-200 border-2 border-dashed rounded-t-xl w-full h-56 group-hover:opacity-90 transition-opacity duration-300"></div>
                  )}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-500 font-medium mb-3">
                      <span className="px-4 py-1.5 bg-gradient-to-r from-primary-100 to-primary-50 text-primary-700 rounded-full text-xs font-black tracking-wider shadow-sm border border-primary-200/50">{item.category}</span>
                      <time dateTime={item.date} className="text-gray-600 font-semibold">{item.date}</time>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 group-hover:text-primary-600 transition-colors duration-300 overflow-hidden text-ellipsis whitespace-nowrap leading-tight mb-3">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>{item.summary}</p>
                    <Link to={`/article/${item.slug}`} className="inline-flex items-center gap-2 text-primary-600 font-black hover:text-primary-700 transition-all duration-300 group-hover:gap-3 mt-4">
                      اقرأ المزيد
                      <span className="transform transition-transform duration-300 group-hover:translate-x-2">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {filteredNews.length === 0 && (
              <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <h3 className="text-2xl font-bold text-gray-600 mb-4">لا توجد أخبار في هذه الفئة</h3>
                <Link to="/" className="text-blue-600 hover:text-blue-700 font-semibold">
                  العودة إلى جميع الأخبار
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar - Categories + Ads */}
          <aside className="lg:w-64 w-full space-y-6">
            {/* Catégories */}
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-32 h-fit border border-gray-100">
              <h3 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-3 border-b border-gray-200 pb-4">
                <span className="text-blue-600">التصنيفات</span>
              </h3>
              <ul className="space-y-1">
                {categories.map((category) => (
                  <li key={category}>
                    <Link
                      to={category === 'الرئيسة' ? '/' : `/category/${encodeURIComponent(category)}`}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full block text-right py-4 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-between group ${
                        selectedCategory === category 
                          ? 'bg-blue-600 text-white shadow-md' 
                          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm'
                      }`}
                    >
                      <span>{category}</span>
                      <span className={`transform transition-transform duration-200 ${
                        selectedCategory === category ? 'translate-x-2' : 'group-hover:translate-x-2'
                      }`}>→</span>
                    </Link>
                  </li>
                ))}
              </ul>
              
              {/* Abonnement RSS */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <a
                  href="/feed.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg group"
                  title="اشترك في آخر الأخبار عبر RSS"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795.001 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.118-15.758-15.839-15.82zm0-3.368c10.58.046 19.152 8.594 19.183 19.185h4.817c-.03-13.231-10.755-23.954-24-24v4.815z"/>
                    </svg>
                    <span className="font-bold text-sm">اشترك في RSS</span>
                  </div>
                  <span className="text-xs opacity-90 group-hover:opacity-100">→</span>
                </a>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  آخر الأخبار مباشرة في قارئ RSS
                </p>
              </div>
            </div>
            
            {/* Publicité dans la sidebar */}
            <AdUnit position="sidebar" className="sticky top-96" />
          </aside>
        </section>

        {/* Most Read Section */}
        {selectedCategory === 'الرئيسة' && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-primary-600">الأكثر قراءة</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredNews.slice(0, 4).map((item, index) => (
                <Link
                  key={item.id}
                  to={`/article/${item.slug}`}
                  className="relative group bg-white rounded-2xl shadow-soft overflow-hidden card-hover border border-gray-100/50"
                >
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center text-white font-black text-lg shadow-large z-10">
                    {index + 1}
                  </div>
                  {item.image ? (
                    <div className="relative w-full h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        width="400"
                        height="300"
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-primary-100 to-primary-200 w-full h-48"></div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-black">
                        {item.category}
                      </span>
                      <time dateTime={item.date} className="text-xs text-gray-500 font-semibold">
                        {item.date}
                      </time>
                    </div>
                    <h3 className="text-lg font-black text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {item.summary}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Newsletter Section - Tout en bas */}
        <section className="mb-16 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden">
          {/* Éléments décoratifs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-4">ابق على اطلاع</h2>
            <p className="text-xl text-primary-50 mb-8 leading-relaxed">
              اشترك في نشرتنا الإخبارية لتلقي آخر الأخبار والتحديثات مباشرة في بريدك الإلكتروني
            </p>
            <form 
              className="max-w-md mx-auto flex flex-col sm:flex-row gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const email = (form.elements.namedItem('email') as HTMLInputElement)?.value;
                if (email) {
                  alert(`شكرًا لك! سنرسل الأخبار إلى ${email}`);
                  form.reset();
                }
              }}
            >
              <input 
                type="email" 
                name="email"
                placeholder="أدخل بريدك الإلكتروني"
                required
                className="flex-1 px-6 py-4 rounded-xl text-gray-900 font-semibold focus:outline-none focus:ring-4 focus:ring-white/30 shadow-large"
                dir="ltr"
              />
              <button 
                type="submit" 
                className="bg-white text-primary-700 font-black px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-large hover:scale-105 whitespace-nowrap"
              >
                اشترك الآن
              </button>
            </form>
            <p className="text-sm text-primary-200 mt-4">
              نحن نحترم خصوصيتك. لن نشارك معلوماتك مع أي طرف ثالث.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
