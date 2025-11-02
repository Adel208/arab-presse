import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './Layout';
import Home from './Home';
import ArticleDetail from './ArticleDetail';
import CategoryPage from './CategoryPage';
import About from './About';
import Contact from './Contact';
import Privacy from './Privacy';
import Terms from './Terms';
import FAQ from './FAQ';
import ErrorBoundary from './components/ErrorBoundary';
import { initPrefetch } from './utils/prefetch';

export default function App(): JSX.Element {
  // Initialiser le prefetch pour améliorer les performances
  useEffect(() => {
    initPrefetch();
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/article/:slug" element={<ArticleDetail />} />
            <Route path="/category/:categorySlug" element={<CategoryPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/faq" element={<FAQ />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

