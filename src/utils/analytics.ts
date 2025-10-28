import { analyticsConfig, trackEvent } from '../config/analytics';

/**
 * Envoie un événement page_view à GA4
 */
export const trackPageView = (path: string, title: string) => {
  if (!analyticsConfig.enabled || typeof window === 'undefined') return;
  
  if (window.gtag) {
    window.gtag('config', analyticsConfig.measurementId, {
      page_path: path,
      page_title: title,
    });
  }
};

/**
 * Track un partage social
 */
export const trackSocialShare = (platform: string, articleTitle: string) => {
  trackEvent('share', {
    method: platform,
    content_type: 'article',
    item_id: articleTitle,
  });
};

/**
 * Track un clic sur un lien externe
 */
export const trackOutboundLink = (url: string) => {
  trackEvent('click', {
    event_category: 'outbound',
    event_label: url,
    transport_type: 'beacon',
  });
};

/**
 * Track le temps de lecture
 */
export const trackReadingTime = (timeInSeconds: number, articleTitle: string) => {
  trackEvent('reading_time', {
    value: timeInSeconds,
    content_type: 'article',
    item_id: articleTitle,
  });
};

/**
 * Track le scroll depth
 */
export const trackScrollDepth = (depth: number) => {
  trackEvent('scroll_depth', {
    value: depth,
    event_label: `${depth}%`,
  });
};

/**
 * Track la recherche
 */
export const trackSearch = (searchTerm: string, resultsCount: number) => {
  trackEvent('search', {
    search_term: searchTerm,
    results_count: resultsCount,
  });
};

