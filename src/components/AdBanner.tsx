import { useEffect, useRef } from 'react';
import { adsConfig } from '../config/ads';

interface AdBannerProps {
  slotId: string;
  style?: React.CSSProperties;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  responsive?: boolean;
}

export default function AdBanner({ 
  slotId, 
  style,
  format = 'auto',
  responsive = true 
}: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adsConfig.enabled) return;

    const loadAd = () => {
      try {
        if (adRef.current && adsConfig.publisherId && adsConfig.publisherId !== 'ca-pub-XXXXXXXXXX') {
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

    // Délai pour améliorer les performances
    const timeoutId = setTimeout(loadAd, adsConfig.loadDelay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [slotId]);

  // Ne pas afficher si désactivé
  if (!adsConfig.enabled) {
    return null;
  }

  return (
    <div className="my-6 flex justify-center" style={style} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          ...style
        }}
        data-ad-client={adsConfig.publisherId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}

declare global {
  interface Window {
    adsbygoogle?: any;
  }
}

