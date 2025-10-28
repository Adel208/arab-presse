import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { newsData } from './data';

// v2.0.1 - Image display fix

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const article = newsData.find(item => item.slug === slug);
  
  // Construire l'URL absolue pour l'image
  const imageUrl = article?.image 
    ? `${window.location.origin}${article.image}`
    : article?.id === 7 
    ? `${window.location.origin}/img/gabesmanif.webp`
    : article?.id === 8
    ? `${window.location.origin}/img/marocmanif.webp`
    : `${window.location.origin}/vite.svg`;
  
  const articleUrl = window.location.href;
  const canonicalUrl = article ? `${window.location.origin}/article/${article.slug}` : articleUrl;

  if (!article) {
    return (
      <div dir="rtl" lang="ar" className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">المقال غير موجود</h1>
          <Link to="/" className="text-blue-600 hover:underline">العودة إلى الصفحة الرئيسية</Link>
        </div>
      </div>
    );
  }

  const contentSections = article.content ? article.content.split('##').filter(section => section.trim()) : [];

  // Données structurées JSON-LD pour SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": article.metaDescription || article.summary,
    "image": [imageUrl],
    "datePublished": article.date,
    "dateModified": article.date,
    "author": {
      "@type": "Person",
      "name": article.author || "هيئة التحرير"
    },
    "publisher": {
      "@type": "Organization",
      "name": "بوابة الأخبار العربية",
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/vite.svg`
      }
    },
    "articleSection": article.category,
    "keywords": article.keywords || '',
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "inLanguage": "ar"
  };

  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{article.title} - بوابة الأخبار العربية</title>
        <meta name="description" content={article.metaDescription || article.summary} />
        <meta name="keywords" content={article.keywords || ''} />
        <meta name="author" content={article.author || "هيئة التحرير"} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.metaDescription || article.summary} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="بوابة الأخبار العربية" />
        <meta property="article:published_time" content={article.date} />
        <meta property="article:modified_time" content={article.date} />
        <meta property="article:author" content={article.author || "هيئة التحرير"} />
        <meta property="article:section" content={article.category} />
        {article.keywords && article.keywords.split('،').map((tag, index) => (
          <meta key={index} property="article:tag" content={tag.trim()} />
        ))}
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonicalUrl} />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.metaDescription || article.summary} />
        <meta name="twitter:image" content={imageUrl} />
        <meta name="twitter:creator" content={article.author || "هيئة التحرير"} />
        
        {/* Données structurées JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Hero Section */}
          <div className="relative w-full h-96 md:h-[500px] overflow-hidden">
            {article.image ? (
              <img 
                src={article.image}
                alt={article.imageAlt || article.title}
                width="1200"
                height="800"
                loading="eager"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : article.id === 7 ? (
              <img 
                src="/img/gabesmanif.webp" 
                alt="احتجاجات في مدينة قابس ضد التلوث البيئي"
                width="1200"
                height="800"
                loading="eager"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : article.id === 8 ? (
              <img 
                src="/img/marocmanif.webp" 
                alt="احتجاجات حركة GenZ 212 في المغرب"
                width="1200"
                height="800"
                loading="eager"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : article.id === 12 ? (
              <img 
                src="/img/darfoure.jpg" 
                alt="تقرير عن دارفور"
                width="1200"
                height="800"
                loading="eager"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : article.id === 13 ? (
              <img 
                src="/img/tunispolic.jpg" 
                alt="السلطات التونسية تعلق نشاط منظمات المجتمع المدني"
                width="1200"
                height="800"
                loading="eager"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40"></div>
            <div className="relative z-10 h-full flex items-center justify-center text-center px-8">
              <div>
                <span className="inline-block px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-full mb-4">
                  {article.category}
                </span>
                <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight drop-shadow-2xl">
                  {article.title}
                </h1>
                <div className="text-gray-200 font-medium text-lg drop-shadow-lg">
                  <time dateTime={article.date}>
                    {new Date(article.date).toLocaleDateString('ar-EG', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </time>
                  {article.author && (
                    <span className="mx-2">•</span>
                  )}
                  {article.author && (
                    <span>بقلم: {article.author}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            {/* Summary */}
            <div className="bg-blue-50 border-r-4 border-blue-600 p-6 rounded-lg mb-12">
              <p className="text-gray-700 text-lg leading-relaxed">{article.summary}</p>
            </div>

            {/* Key Stats - Only for article 7 */}
            {article.id === 7 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200 text-center">
                  <div className="text-4xl font-extrabold text-red-600 mb-2">14,000</div>
                  <div className="text-sm font-semibold text-red-900">طن من الفوسفوجبسوم يوميًا</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200 text-center">
                  <div className="text-4xl font-extrabold text-orange-600 mb-2">×3</div>
                  <div className="text-sm font-semibold text-orange-900">معدل الإصابة بالسرطان</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200 text-center">
                  <div className="text-4xl font-extrabold text-yellow-600 mb-2">70%</div>
                  <div className="text-sm font-semibold text-yellow-900">تراجع النشاط البحري</div>
                </div>
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              {contentSections.map((section, index) => {
                const lines = section.trim().split('\n');
                const title = lines[0].trim();
                const content = lines.slice(1).join('\n').trim();

                return (
                  <div key={index} className="mb-10">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6 border-r-4 border-blue-600 pr-4">
                      {title}
                    </h2>
                    <div className="text-gray-700 text-lg leading-relaxed space-y-4">
                      {content.split('\n\n').map((paragraph, pIndex) => {
                        if (paragraph.trim().startsWith('>')) {
                          // Quote
                          return (
                            <blockquote key={pIndex} className="border-r-4 border-blue-600 pr-6 my-6 italic text-gray-800 bg-blue-50 py-4 px-6 rounded-lg">
                              {paragraph.replace('>', '').replace(/\*\*/g, '').trim()}
                            </blockquote>
                          );
                        } else if (paragraph.trim().startsWith('**') && paragraph.trim().endsWith('**')) {
                          // Bold paragraph
                          return (
                            <p key={pIndex} className="font-bold text-gray-900">
                              {paragraph.replace(/\*\*/g, '')}
                            </p>
                          );
                        } else {
                          // Normal paragraph
                          return (
                            <p key={pIndex} className="leading-relaxed">
                              {paragraph}
                            </p>
                          );
                        }
                      })}
                    </div>
                    {index < contentSections.length - 1 && (
                      <div className="mt-8 border-t border-gray-200"></div>
                    )}
                  </div>
                );
              })}
            </div>


            {/* Tags */}
            {article.keywords && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h4 className="text-sm font-bold text-gray-600 mb-4">الكلمات المفتاحية:</h4>
                <div className="flex flex-wrap gap-2">
                  {article.keywords.split('،').map((keyword, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer">
                      {keyword.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  <p className="font-semibold mb-2">شارك المقال:</p>
                  <div className="flex gap-4">
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      Facebook
                    </a>
                    <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                      Twitter
                    </a>
                  </div>
                </div>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  ← العودة إلى القائمة
                </Link>
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
