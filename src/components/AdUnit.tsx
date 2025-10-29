import { useEffect, useRef } from 'react';
import { adsConfig } from '../config/ads';

interface AdUnitProps {
  position: 'sidebar' | 'in-content' | 'between-articles' | 'footer';
  className?: string;
}

/**
 * Composant d'unité publicitaire native/personnalisée
 * S'affiche comme une place publicitaire même si AdSense n'est pas configuré
 */
export default function AdUnit({ position, className = '' }: AdUnitProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Désactiver temporairement si AdSense n'est pas configuré
    if (!adsConfig.enabled || adsConfig.publisherId === 'ca-pub-XXXXXXXXXX') {
      // En production, on pourrait afficher des publicités natives alternatives
      // Pour l'instant, on garde une placeholder visuelle
      return;
    }

    const loadAd = () => {
      try {
        if (adRef.current) {
          // Charger AdSense si pas déjà chargé
          if (!window.adsbygoogle) {
            const script = document.createElement('script');
            script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsConfig.publisherId}`;
            script.async = true;
            script.crossOrigin = 'anonymous';
            document.head.appendChild(script);
          }

          // Initialiser l'annonce
          if (window.adsbygoogle && !adRef.current.hasChildNodes()) {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la publicité:', error);
      }
    };

    const timeoutId = setTimeout(loadAd, adsConfig.loadDelay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [position]);

  // Styles selon la position
  const positionClasses = {
    sidebar: 'w-full min-h-[250px]',
    'in-content': 'w-full min-h-[250px] my-8',
    'between-articles': 'w-full min-h-[100px] my-12',
    footer: 'w-full min-h-[100px]',
  };

  return (
    <div className={`${positionClasses[position]} ${className}`} ref={adRef}>
      {/* Placeholder pour les publicités */}
      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
        <div className="text-center p-4">
          <div className="text-gray-400 text-xs font-semibold mb-2">إعلان</div>
          {adsConfig.publisherId === 'ca-pub-XXXXXXXXXX' ? (
            <div className="text-gray-500 text-xs">Configurez AdSense dans config/ads.ts</div>
          ) : (
            <div className="text-blue-600 text-xs animate-pulse">جاري تحميل الإعلان...</div>
          )}
        </div>
      </div>
    </div>
  );
}

