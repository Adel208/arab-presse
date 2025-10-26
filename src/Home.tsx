import { useState } from 'react';
import { Link } from 'react-router-dom';
import { newsData, categories } from './data';

export default function Home(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');

  const filteredNews = newsData.filter((item) =>
    (selectedCategory === 'الكل' || item.category === selectedCategory) &&
    (item.title.includes(searchTerm) || item.summary.includes(searchTerm))
  );

  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-gray-50 text-gray-900 font-sans leading-relaxed text-lg">
      <header className="bg-white shadow-md py-6 px-8 sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-12 w-full md:w-auto">
            <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">بوابة الأخبار العربية</h1>
            <nav className="hidden lg:flex items-center gap-8">
              <a href="#" className="text-gray-700 font-semibold hover:text-blue-600 transition-colors duration-200 hover:underline underline-offset-4">الرئيسية</a>
              <a href="#" className="text-gray-700 font-semibold hover:text-blue-600 transition-colors duration-200 hover:underline underline-offset-4">سياسة</a>
              <a href="#" className="text-gray-700 font-semibold hover:text-blue-600 transition-colors duration-200 hover:underline underline-offset-4">اقتصاد</a>
              <a href="#" className="text-gray-700 font-semibold hover:text-blue-600 transition-colors duration-200 hover:underline underline-offset-4">رياضة</a>
              <a href="#" className="text-gray-700 font-semibold hover:text-blue-600 transition-colors duration-200 hover:underline underline-offset-4">تكنولوجيا</a>
              <a href="#" className="text-gray-700 font-semibold hover:text-blue-600 transition-colors duration-200 hover:underline underline-offset-4">بيئة</a>
            </nav>
          </div>
          <div className="relative w-full md:w-80">
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 ps-12 pe-6 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md bg-white text-base"
              placeholder="ابحث في الأخبار..."
              aria-label="بحث"
            />
            <svg className="absolute start-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <section className="mb-16 md:mb-20">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col lg:flex-row items-center gap-10 border border-blue-100">
            <div className="flex-1 text-center lg:text-right">
              <span className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-full mb-6 tracking-wider">خبر عاجل</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">اكتشاف علمي يغير قواعد الطب الحديث</h2>
              <p className="text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto lg:mx-0">أعلن باحثون دوليون عن تطوير تقنية جينية ثورية تعالج الأمراض المزمنة بنسبة نجاح 95%، مما يفتح آفاقًا جديدة في الرعاية الصحية العالمية ويقلل تكاليف العلاج بشكل جذري.</p>
              <a href="#" className="inline-flex items-center gap-3 bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1">اقرأ المزيد</a>
            </div>
            <div className="lg:w-1/2 w-full h-64 md:h-80 bg-gray-200 border-2 border-dashed rounded-xl shadow-inner"></div>
          </div>
        </section>

        <section className="flex flex-col lg:flex-row-reverse gap-10 lg:gap-12">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-10 border-b border-gray-200 pb-6">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                <span className="text-blue-600">أحدث الأخبار</span>
              </h2>
              <p className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full font-medium">{filteredNews.length} مقال متاح</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            </div>
            {filteredNews.length === 0 && (
              <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-600 text-lg font-medium">لا توجد مقالات تطابق البحث الحالي. جرب تصنيفًا آخر أو كلمات مفتاحية مختلفة.</p>
              </div>
            )}
          </div>

          <aside className="lg:w-64 w-full bg-white rounded-xl shadow-lg p-6 sticky top-32 h-fit border border-gray-100">
            <h3 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-3 border-b border-gray-200 pb-4">
              <span className="text-blue-600">التصنيفات</span>
            </h3>
            <ul className="space-y-1">
              {categories.map((category) => (
                <li key={category}>
                  <button
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-right py-4 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-between group ${selectedCategory === category ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm'}`}
                    aria-pressed={selectedCategory === category}
                  >
                    <span>{category}</span>
                    <span className={`transform transition-transform duration-200 ${selectedCategory === category ? 'translate-x-2' : 'group-hover:translate-x-2'}`}>→</span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12 px-8 mt-24 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-right">
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-blue-400 tracking-wider">بوابة الأخبار العربية</h4>
            <p className="text-gray-400 max-w-md leading-relaxed">مصدرك الموثوق للأخبار العاجلة والتحليلات المتعمقة باللغة العربية، مع تغطية شاملة للأحداث السياسية والاقتصادية والثقافية.</p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6 text-sm font-medium">
            <a href="#" className="hover:text-blue-400 transition-colors duration-200">سياسة الخصوصية</a>
            <a href="#" className="hover:text-blue-400 transition-colors duration-200">شروط الاستخدام</a>
            <a href="#" className="hover:text-blue-400 transition-colors duration-200">اتصل بنا</a>
          </div>
          <div className="text-gray-400 text-sm">
            <p>جميع الحقوق محفوظة © 2023 بوابة الأخبار العربية. صُمم بتقنيات حديثة لتجربة مستخدم متميزة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

