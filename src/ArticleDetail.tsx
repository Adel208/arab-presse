import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { newsData } from './data';
import AdBanner from './components/AdBanner';
import RelatedArticles from './components/RelatedArticles';
import Breadcrumb from './components/Breadcrumb';
import { trackPageView, trackSocialShare } from './utils/analytics';
import { adsConfig } from './config/ads';
import { enhanceParagraphWithLinks } from './utils/internalLinks';

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  // Nettoyer le slug pour enlever d'éventuels paramètres de requête
  const cleanSlug = slug?.split('?')[0] || slug;
  const article = newsData.find(item => item.slug === cleanSlug);

  // Track page view
  useEffect(() => {
    if (article) {
      trackPageView(`/article/${cleanSlug}`, article.title);
    }
  }, [cleanSlug, article]);
  
  // Construire l'URL absolue pour l'image
  const imageUrl = article?.image 
    ? `${window.location.origin}${article.image.replace(/ /g, '%20')}`
    : article?.id === 7 
    ? `${window.location.origin}/img/gabesmanif.webp`
    : article?.id === 8
    ? `${window.location.origin}/img/marocmanif.webp`
    : article?.id === 17
    ? `${window.location.origin}/img/zohran%20mamdani.webp`
    : `${window.location.origin}/logo.svg`;
  
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

  // Calculer le temps de lecture estimé (moyenne: 200 mots/minute pour l'arabe)
  const estimatedReadingTime = article.content 
    ? Math.max(1, Math.ceil((article.content.split(/\s+/).length) / 200))
    : 1;

  // Données structurées JSON-LD pour SEO enrichies
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": article.metaDescription || article.summary,
    "image": [
      {
        "@type": "ImageObject",
        "url": imageUrl,
        "width": 1200,
        "height": 800,
        "caption": article.imageAlt || article.title
      }
    ],
    "datePublished": article.date,
    "author": {
      "@type": "Person",
      "name": article.author || "هيئة التحرير",
      "url": `${window.location.origin}/about`
    },
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
    "keywords": article.keywords || '',
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl,
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": imageUrl
      }
    },
    "inLanguage": "ar",
    "wordCount": article.content ? article.content.split(/\s+/).length : 0,
    "articleBody": article.content || article.summary,
    "timeRequired": `PT${estimatedReadingTime}M`,
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", "h2"]
    },
    // Enrichissement: description du sujet principal
    "about": {
      "@type": "Thing",
      "name": article.category,
      "description": `مقال عن ${article.category}`
    },
    // Enrichissement: mentions dans les mots-clés
    "mentions": article.keywords ? article.keywords.split('،').map(k => ({
      "@type": "Thing",
      "name": k.trim()
    })) : [],
    // Enrichissement: URL de l'article pour le partage
    "url": canonicalUrl,
    // Enrichissement: date de modification (utiliser datePublished pour l'instant)
    "dateModified": article.date,
    // Enrichissement: type de contenu
    "genre": article.category,
    // Enrichissement: type d'article
    "publisherImprint": {
      "@type": "Organization",
      "name": "صدى العرب"
    }
  };

  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{article.title} - صدى العرب</title>
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
        <meta property="og:image:secure_url" content={imageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="800" />
        <meta property="og:image:type" content="image/webp" />
        <meta property="og:site_name" content="صدى العرب" />
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
        
        {/* Preload de l'image hero pour améliorer les performances */}
        {article.image && (
          <link rel="preload" href={article.image} as="image" type={article.image.includes('.webp') ? 'image/webp' : 'image/jpeg'} />
        )}
        
        {/* Données structurées JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <Breadcrumb 
          items={[
            { label: 'الرئيسية', url: '/' },
            { label: article.category, url: `/category/${encodeURIComponent(article.category)}` },
            { label: article.title, url: `/article/${article.slug}` }
          ]}
        />

        {/* Bannière publicitaire en haut de l'article */}
        <AdBanner slotId={adsConfig.slots.headerBanner} style={{ width: '100%', height: '90px', marginBottom: '2rem' }} format="horizontal" />
        
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
                src="/img/darfoure.webp" 
                alt="تقرير عن دارفور"
                width="1200"
                height="800"
                loading="eager"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : article.id === 13 ? (
              <img 
                src="/img/tunispolic.webp" 
                alt="السلطات التونسية تعلق نشاط منظمات المجتمع المدني"
                width="1200"
                height="800"
                loading="eager"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : article.id === 4 ? (
              <img 
                src="/img/sudan-un-flags.webp" 
                alt="أعلام الأمم المتحدة والسودان - تحذيرات أممية من كارثة إنسانية في الفاشر"
                width="1200"
                height="800"
                loading="eager"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : article.id === 9 ? (
              <img 
                src="/img/ben-barka.webp" 
                alt="صورة أرشيفية للمعارض المغربي المهدي بن بركة الذي اختفى في باريس عام 1965"
                width="1200"
                height="800"
                loading="eager"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : article.id === 10 ? (
              <img 
                src="/img/eu-sudan-flags.webp" 
                alt="أعلام الاتحاد الأوروبي والسودان - إدانة أوروبية لانتهاكات الدعم السريع في الفاشر"
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
                          // Normal paragraph avec liens internes
                          // Ne pas ajouter de liens dans :
                          // - Le premier paragraphe de la première section (index === 0 && pIndex === 0)
                          // - Les paragraphes trop courts (< 150 caractères)
                          // - Plus d'un lien par paragraphe pour éviter la surcharge
                          const isFirstParagraphOfFirstSection = index === 0 && pIndex === 0;
                          const shouldAddLinks = !isFirstParagraphOfFirstSection && paragraph.trim().length > 150;
                          
                          return (
                            <p key={pIndex} className="leading-relaxed">
                              {shouldAddLinks 
                                ? enhanceParagraphWithLinks(paragraph, article, newsData)
                                : paragraph
                              }
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

            {/* Publicité avant le footer */}
            <AdBanner slotId={adsConfig.slots.inArticle} style={{ width: '100%', height: '250px', marginTop: '2rem' }} format="rectangle" />

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  <p className="font-semibold mb-2">شارك المقال:</p>
                  <div className="flex gap-4 flex-wrap">
                    <a 
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={() => trackSocialShare('facebook', article.title)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      Facebook
                    </a>
                    <a 
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={() => trackSocialShare('twitter', article.title)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                      Twitter
                    </a>
                    <a 
                      href={`https://wa.me/?text=${encodeURIComponent(article.title + ' ' + window.location.href)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={() => trackSocialShare('whatsapp', article.title)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                      WhatsApp
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
        
        {/* Articles connexes */}
        <RelatedArticles currentArticle={article} allArticles={newsData} />
      </main>
    </div>
  );
}
