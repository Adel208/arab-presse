import { Link } from 'react-router-dom';
import { categories } from './data';

export default function Navbar() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-8 py-6">
        {/* Logo et titre */}
        <div className="flex items-center justify-center mb-6">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl font-bold">ع</span>
            </div>
            <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">
              بوابة الأخبار العربية
            </h1>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex items-center justify-center gap-4 flex-wrap">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={cat === 'الكل' ? '/' : `/?category=${encodeURIComponent(cat)}`}
              className="px-4 py-2 rounded-full font-semibold text-gray-700 hover:bg-blue-600 hover:text-white transition-all duration-200 text-sm"
            >
              {cat}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

