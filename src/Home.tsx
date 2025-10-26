import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { newsData } from './data';

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
  }, [searchParams]);

  const filteredNews = newsData.filter((item) =>
    selectedCategory === 'الكل' || item.category === selectedCategory
  );

  return (
    <div dir="rtl" lang="ar" className="bg-gray-50 text-gray-900 font-sans">
      <Helmet>
        <title>بوابة الأخبار العربية - مصدرك الموثوق للأخبار العاجلة</title>
        <meta name="description" content="مصدرك الموثوق للأخبار العاجلة والتحليلات المتعمقة باللغة العربية، مع تغطية شاملة للأحداث السياسية والاقتصادية والثقافية والبيئية." />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="بوابة الأخبار العربية" />
        <meta property="og:description" content="مصدرك الموثوق للأخبار العاجلة والتحليلات المتعمقة باللغة العربية" />
        <meta property="og:site_name" content="بوابة الأخبار العربية" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <section className="mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">
            {selectedCategory === 'الكل' ? 'جميع الأخبار' : `أخبار ${selectedCategory}`}
          </h2>
          <p className="text-center text-gray-600 text-lg">
            {filteredNews.length} {filteredNews.length === 1 ? 'مقال' : 'مقالات'}
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((item) => (
            <article key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 group border border-gray-100">
              {item.id === 7 ? (
                <div className="relative w-full h-56 overflow-hidden">
                  <img
                    src="/img/gabesmanif.webp"
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
              ) : (
                <div className="bg-gray-200 border-2 border-dashed rounded-t-xl w-full h-56 group-hover:opacity-90 transition-opacity duration-300"></div>
              )}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-500 font-medium">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold tracking-wider">{item.category}</span>
                  <time dateTime={item.date}>{item.date}</time>
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 overflow-hidden text-ellipsis whitespace-nowrap">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>{item.summary}</p>
                <Link to={`/article/${item.id}`} className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition-colors duration-200 group-hover:gap-3">
                  اقرأ المزيد
                  <span className="transform transition-transform duration-200 group-hover:translate-x-2">→</span>
                </Link>
              </div>
            </article>
          ))}
        </section>

        {filteredNews.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-600 mb-4">لا توجد أخبار في هذه الفئة</h3>
            <Link to="/" className="text-blue-600 hover:text-blue-700 font-semibold">
              العودة إلى جميع الأخبار
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
