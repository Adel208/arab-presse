import fs from 'fs';
import path from 'path';

// Lire data.ts brut et extraire les articles
const dataPath = path.join('src', 'data.ts');
const dataContent = fs.readFileSync(dataPath, 'utf-8');

// Extraire les articles depuis le tableau newsData
const articlePattern = /\{\s*id:\s*(\d+),[\s\S]*?slug:\s*['"]([^'"]+)['"],[\s\S]*?title:\s*`([^`]+)`,[\s\S]*?category:\s*['"]([^'"]+)['"],[\s\S]*?date:\s*['"]([^'"]+)['"],[\s\S]*?keywords:\s*['"]([^'"]*)['"]/g;
const articles = [];
let match;

while ((match = articlePattern.exec(dataContent)) !== null) {
  articles.push({
    id: parseInt(match[1]),
    slug: match[2],
    title: match[3],
    category: match[4],
    date: match[5],
    keywords: match[6]
  });
}

// Remplacez par votre domaine réel
const DOMAIN = 'https://arabpress.netlify.app';

// Fonction pour échapper les caractères XML
function escapeXml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateSitemap() {
  const today = new Date();
  const currentDate = today.toISOString().split('T')[0];
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- Page d'accueil -->
  <url>
    <loc>${DOMAIN}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
`;

  // Ajouter les articles
  articles.forEach(article => {
    // Extraire la date et s'assurer qu'elle n'est pas dans le futur
    let articleDate = article.date.split('T')[0];
    const articleDateObj = new Date(article.date);
    
    // Si la date est dans le futur, utiliser la date d'aujourd'hui
    if (articleDateObj > today) {
      articleDate = currentDate;
      console.warn(`⚠️  Date future corrigée pour l'article ${article.id} (${article.slug}): ${article.date} → ${currentDate}`);
    }
    
    // Assurer que lastmod n'est jamais dans le futur
    const lastmod = articleDate <= currentDate ? articleDate : currentDate;
    
    const hasImage = article.id === 7 || article.id === 8 || article.id === 12 || article.id === 13;
    const imageUrl = article.id === 7 
      ? `${DOMAIN}/img/gabesmanif.webp`
      : article.id === 8
      ? `${DOMAIN}/img/marocmanif.webp`
      : article.id === 12
      ? `${DOMAIN}/img/darfoure.jpg`
      : article.id === 13
      ? `${DOMAIN}/img/tunispolic.jpg`
      : null;

    xml += `  <url>
    <loc>${DOMAIN}/article/${article.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
`;

    // Ajouter l'image si disponible
    if (hasImage && imageUrl) {
      xml += `    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>${escapeXml(article.title)}</image:title>
    </image:image>
`;
    }

    xml += `  </url>
  
`;
  });

  // Ajouter les pages catégories
  const categories = ['سياسة', 'اقتصاد', 'رياضة', 'تكنولوجيا', 'ثقافة', 'بيئة'];
  categories.forEach(category => {
    xml += `  <url>
    <loc>${DOMAIN}/?category=${encodeURIComponent(category)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  
`;
  });

  // Ajouter les pages légales
  const legalPages = [
    { path: '/about', priority: '0.7', changefreq: 'monthly' },
    { path: '/contact', priority: '0.7', changefreq: 'monthly' },
    { path: '/privacy', priority: '0.8', changefreq: 'monthly' },
    { path: '/terms', priority: '0.8', changefreq: 'monthly' }
  ];

  legalPages.forEach(page => {
    xml += `  <url>
    <loc>${DOMAIN}${page.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
  
`;
  });

  xml += `</urlset>`;

  // Écrire le sitemap dans le dossier public (pour le dev)
  const publicDir = path.join(process.cwd(), 'public');
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
  console.log('✅ Sitemap généré avec succès dans public/sitemap.xml');

  // Écrire aussi dans dist/ (pour le build de production)
  const distDir = path.join(process.cwd(), 'dist');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml);
    console.log('✅ Sitemap généré avec succès dans dist/sitemap.xml');
  }
}

generateSitemap();
