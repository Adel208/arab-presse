/**
 * Configuration Google Analytics
 * Remplacez l'ID par votre propre ID GA4
 */

export const analyticsConfig = {
  // Google Analytics Measurement ID
  measurementId: 'G-1MVBT8GE8C',
  
  // Activer/désactiver Analytics
  enabled: true,
};

// Pour le développement, on peut désactiver temporairement
if (import.meta.env.DEV) {
  analyticsConfig.enabled = false; // Désactiver en développement
}

/**
 * Envoie un événement à Google Analytics
 */
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (!analyticsConfig.enabled || typeof window === 'undefined') return;
  
  if (window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

