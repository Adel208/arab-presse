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
        {/* Hero Section - Breaking News */}
        {selectedCategory === 'الكل' && (
          <section className="mb-16">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 md:p-12 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col lg:flex-row items-center gap-10 border border-red-100">
              <div className="flex-1 text-center lg:text-right">
                <span className="inline-block px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-full mb-6 tracking-wider">بيئة</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">قابس تختنق: مدينة الموت البطيء بين وعود السلطة وصمود الأهالي</h2>
                <p className="text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto lg:mx-0">
                  تعيش قابس التونسية أزمة بيئية خانقة دفعت آلاف السكان إلى الشوارع احتجاجًا على التلوث الصناعي، وسط وعود حكومية واتهامات بالإهمال والتواطؤ. أكثر من 14 ألف طن من الفوسفوجبسوم يُلقى يوميًا في البحر.
                </p>
                <Link to="/article/7" className="inline-flex items-center gap-3 bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1">
                  اقرأ المزيد
                </Link>
              </div>
              <div className="lg:w-1/2 w-full h-64 md:h-80 rounded-xl shadow-inner overflow-hidden relative">
                <img 
                  src="/img/gabesmanif.webp" 
                  alt="احتجاجات في مدينة قابس ضد التلوث البيئي"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            </div>
          </section>
        )}

        <section className="mb-12">
          <div className="flex items-center justify-between mb-10 border-b border-gray-200 pb-6">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <span className="text-blue-600">{selectedCategory === 'الكل' ? 'أحدث الأخبار' : `أخبار ${selectedCategory}`}</span>
            </h2>
            <p className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full font-medium">
              {filteredNews.length} مقال متاح
            </p>
          </div>
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
