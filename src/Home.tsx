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
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory('الكل');
    }
    
    // Track page view
    trackPageView(window.location.pathname, 'Home');
  }, [searchParams]);

  const filteredNews = newsData
    .filter((item) =>
      selectedCategory === 'الكل' || item.category === selectedCategory
    )
    .sort((a, b) => {
      // Trier par date décroissante (plus récent en premier)
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });

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
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/vite.svg`,
        "width": 512,
        "height": 512
      },
      "url": window.location.origin,
      "sameAs": [
        "https://www.facebook.com/arabpress",
        "https://twitter.com/arabpress"
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

  const canonicalUrl = selectedCategory === 'الكل' 
    ? window.location.origin 
    : `${window.location.origin}/?category=${encodeURIComponent(selectedCategory)}`;

  return (
    <div dir="rtl" lang="ar" className="bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900 font-arabic min-h-screen">
      <Helmet>
        <title>صدى العرب - مصدرك الموثوق للأخبار العاجلة</title>
        <meta name="description" content="مصدرك الموثوق للأخبار العاجلة والتحليلات المتعمقة باللغة العربية، مع تغطية شاملة للأحداث السياسية والاقتصادية والثقافية والبيئية." />
        <link rel="canonical" href={canonicalUrl} />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="صدى العرب" />
        <meta property="og:description" content="مصدرك الموثوق للأخبار العاجلة والتحليلات المتعمقة باللغة العربية" />
        <meta property="og:site_name" content="صدى العرب" />
        <meta property="og:image" content={`${window.location.origin}/img/gabesmanif.webp`} />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="صدى العرب" />
        <meta name="twitter:description" content="مصدرك الموثوق للأخبار العاجلة والتحليلات المتعمقة باللغة العربية" />
        
        <script type="application/ld+json">
          {JSON.stringify(homeStructuredData)}
        </script>
      </Helmet>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Bannière publicitaire en haut */}
        <AdBanner slotId={adsConfig.slots.headerBanner} style={{ width: '100%', height: '90px' }} format="horizontal" />
        
        {/* Hero Section - Breaking News */}
        {selectedCategory === 'الكل' && (
          <section className="mb-16 animate-scaleIn">
            <div className="bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 rounded-3xl p-8 md:p-12 shadow-large hover:shadow-2xl transition-all duration-500 flex flex-col lg:flex-row items-center gap-10 border border-red-200/50 backdrop-blur-sm">
              <div className="flex-1 text-center lg:text-right">
                <span className="inline-block px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-full mb-6 tracking-wider">بيئة</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">قابس تختنق: مدينة الموت البطيء بين وعود السلطة وصمود الأهالي</h2>
                <p className="text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto lg:mx-0">
                  تعيش قابس التونسية أزمة بيئية خانقة دفعت آلاف السكان إلى الشوارع احتجاجًا على التلوث الصناعي، وسط وعود حكومية واتهامات بالإهمال والتواطؤ. أكثر من 14 ألف طن من الفوسفوجبسوم يُلقى يوميًا في البحر.
                </p>
                <Link to="/article/gabes-pollution-environnement" className="inline-flex items-center gap-3 bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1">
                  اقرأ المزيد
                </Link>
              </div>
              <div className="lg:w-1/2 w-full h-64 md:h-80 rounded-xl shadow-inner overflow-hidden relative">
                <img 
                  src="/img/gabesmanif.webp" 
                  alt="احتجاجات في مدينة قابس ضد التلوث البيئي"
                  width="800"
                  height="600"
                  loading="eager"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            </div>
          </section>
        )}

        <section className="flex flex-col lg:flex-row-reverse gap-10 lg:gap-12">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-10 border-b border-gray-200 pb-6">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                <span className="text-blue-600">{selectedCategory === 'الكل' ? 'أحدث الأخبار' : `أخبار ${selectedCategory}`}</span>
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
                      to={category === 'الكل' ? '/' : `/?category=${encodeURIComponent(category)}`}
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
            </div>
            
            {/* Publicité dans la sidebar */}
            <AdUnit position="sidebar" className="sticky top-96" />
          </aside>
        </section>
      </div>
    </div>
  );
}
