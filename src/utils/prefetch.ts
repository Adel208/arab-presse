/**
 * Prefetch des ressources pour améliorer les performances
 * Prefetch les articles populaires/récents pour charger plus rapidement
 */

export function prefetchPopularArticles() {
  // Liste des articles populaires (les 3 premiers articles récents)
  // Ces articles seront préchargés en arrière-plan pour améliorer la navigation
  const popularArticleSlugs = [
    'gabes-pollution-environnement',
    'maroc-genz-212-manifestations',
    'afttah-almthf-almsry-alkbyr-injaz-thqafy-azym-lmsr-wllaalm-a'
  ];

  // Prefetch les articles populaires
  popularArticleSlugs.forEach(slug => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'document';
    link.href = `/article/${slug}`;
    document.head.appendChild(link);
  });
}

/**
 * Prefetch les images critiques quand l'utilisateur survole un lien article
 */
export function setupHoverPrefetch() {
  // Observer les liens vers les articles et prefetch au survol
  document.addEventListener('mouseover', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a[href^="/article/"]') as HTMLAnchorElement;
    
    if (link && link.href) {
      // Prefetch l'article si on survole le lien
      const prefetchLink = document.createElement('link');
      prefetchLink.rel = 'prefetch';
      prefetchLink.as = 'document';
      prefetchLink.href = link.href;
      
      // Éviter les doublons
      if (!document.querySelector(`link[href="${link.href}"]`)) {
        document.head.appendChild(prefetchLink);
      }
    }
  }, { passive: true });
}

/**
 * Initialise le prefetch après le chargement initial
 */
export function initPrefetch() {
  // Attendre que la page soit complètement chargée
  if (document.readyState === 'complete') {
    prefetchPopularArticles();
    setupHoverPrefetch();
  } else {
    window.addEventListener('load', () => {
      // Délai pour ne pas bloquer le chargement initial
      setTimeout(() => {
        prefetchPopularArticles();
        setupHoverPrefetch();
      }, 2000);
    });
  }
}

