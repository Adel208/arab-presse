import { useState } from 'react';
import { Link } from 'react-router-dom';
import { categories } from './data';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="font-arabic bg-white/95 backdrop-blur-md shadow-soft sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-5">
        {/* Desktop: Logo + Nav sur une seule ligne */}
        <div className="hidden md:flex items-center justify-between gap-8">
          {/* Logo et titre */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-all duration-300 flex-shrink-0 group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-xl flex items-center justify-center shadow-medium group-hover:shadow-large group-hover:scale-105 transition-all duration-300">
              <span className="text-white text-2xl font-black">ع</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-primary-700 tracking-tight whitespace-nowrap bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              صدى العرب
            </h1>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="flex items-center justify-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={cat === 'الرئيسة' ? '/' : `/category/${encodeURIComponent(cat)}`}
                className="px-5 py-2.5 rounded-full font-bold text-gray-700 hover:bg-gradient-to-r hover:from-primary-600 hover:to-primary-700 hover:text-white hover:shadow-medium transition-all duration-300 text-sm whitespace-nowrap border border-transparent hover:border-primary-500"
              >
                {cat}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile: Logo + Burger */}
        <div className="md:hidden flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-all duration-300 group">
            <div className="w-11 h-11 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-xl flex items-center justify-center shadow-medium group-hover:shadow-large group-hover:scale-105 transition-all duration-300">
              <span className="text-white text-xl font-black">ع</span>
            </div>
            <h1 className="text-xl font-black text-primary-700 tracking-tight bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              صدى العرب
            </h1>
          </Link>

          {/* Burger menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
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

        {/* Navigation - Mobile */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4 animate-fadeIn">
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  to={cat === 'الرئيسة' ? '/' : `/category/${encodeURIComponent(cat)}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 rounded-xl font-bold text-gray-700 hover:bg-gradient-to-r hover:from-primary-600 hover:to-primary-700 hover:text-white hover:shadow-medium transition-all duration-300 text-center"
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

