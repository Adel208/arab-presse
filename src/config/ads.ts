/**
 * Configuration des publicités
 * Remplacez les IDs par vos propres IDs AdSense après avoir créé votre compte
 */

export const adsConfig = {
  // AdSense Publisher ID (à remplacer)
  publisherId: 'ca-pub-XXXXXXXXXX',
  
  // IDs des slots AdSense (à remplacer après création)
  slots: {
    // Bannière horizontale
    headerBanner: 'xxxxxxxxxxxxxxxx',
    // Publicités natives dans la sidebar
    sidebarNative: 'xxxxxxxxxxxxxxxx',
    // Publicités in-article
    inArticle: 'xxxxxxxxxxxxxxxx',
    // Bannière footer
    footerBanner: 'xxxxxxxxxxxxxxxx',
    // Publicités entre les articles
    betweenArticles: 'xxxxxxxxxxxxxxxx',
  },
  
  // Délai avant affichage des publicités (ms) pour améliorer les performances
  loadDelay: 1000,
  
  // Activer/désactiver les publicités par défaut
  enabled: true,
};

// Pour le développement, on peut désactiver temporairement
if (import.meta.env.DEV) {
  adsConfig.enabled = false; // Désactiver en développement
}

