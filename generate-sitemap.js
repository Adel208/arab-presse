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

function generateSitemap() {
  const currentDate = new Date().toISOString().split('T')[0];
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
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
    const articleDate = article.date.split('T')[0];
    const hasImage = article.id === 7 || article.id === 8;
    const imageUrl = article.id === 7 
      ? `${DOMAIN}/img/gabesmanif.webp`
      : article.id === 8
      ? `${DOMAIN}/img/marocmanif.webp`
      : null;

    xml += `  <url>
    <loc>${DOMAIN}/article/${article.id}</loc>
    <lastmod>${articleDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
`;

    // Ajouter les métadonnées news pour les articles récents (derniers 2 jours)
    const articleDateObj = new Date(article.date);
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    if (articleDateObj >= twoDaysAgo) {
      xml += `    <news:news>
      <news:publication>
        <news:name>بوابة الأخبار العربية</news:name>
        <news:language>ar</news:language>
      </news:publication>
      <news:publication_date>${articleDate}</news:publication_date>
      <news:title>${article.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</news:title>
      ${article.keywords ? `<news:keywords>${article.keywords}</news:keywords>` : ''}
    </news:news>
`;
    }

    // Ajouter l'image si disponible
    if (hasImage && imageUrl) {
      xml += `    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>${article.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</image:title>
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
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  
`;
  });

  xml += `</urlset>`;

  // Écrire le sitemap dans le dossier public
  const publicDir = path.join(process.cwd(), 'public');
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
  console.log('✅ Sitemap généré avec succès dans public/sitemap.xml');
}

generateSitemap();
