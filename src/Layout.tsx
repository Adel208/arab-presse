import { ReactNode, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import NewsletterPopup from './components/NewsletterPopup';
import { analyticsConfig } from './config/analytics';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  useEffect(() => {
    // Charger Google Analytics si activé
    if (analyticsConfig.enabled && analyticsConfig.measurementId !== 'G-XXXXXXXXXX') {
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.measurementId}`;
      script.async = true;
      document.head.appendChild(script);

      // Initialiser gtag
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      window.gtag = gtag;

      gtag('js', new Date());
      gtag('config', analyticsConfig.measurementId);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <NewsletterPopup />
    </div>
  );
}

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

