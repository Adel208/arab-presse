import { useState } from 'react';
import { Link } from 'react-router-dom';
import { categories } from './data';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-8 py-6">
        {/* Logo, titre et burger */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl font-bold">ع</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700 tracking-tight">
              بوابة الأخبار العربية
            </h1>
          </Link>

          {/* Burger menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center justify-center gap-4 flex-wrap">
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

        {/* Navigation - Mobile */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4 animate-fadeIn">
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  to={cat === 'الكل' ? '/' : `/?category=${encodeURIComponent(cat)}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 rounded-lg font-semibold text-gray-700 hover:bg-blue-600 hover:text-white transition-all duration-200 text-center"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

