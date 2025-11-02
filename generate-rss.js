import fs from 'fs';
import path from 'path';

// Lire data.ts brut et extraire les articles
const dataPath = path.join('src', 'data.ts');
const dataContent = fs.readFileSync(dataPath, 'utf-8');

// Extraire les articles depuis le tableau newsData
// Pattern amélioré pour extraire plus d'informations
const articlePattern = /\{\s*id:\s*(\d+),[\s\S]*?slug:\s*['"]([^'"]+)['"],[\s\S]*?title:\s*`([^`]+)`,[\s\S]*?summary:\s*`([^`]+)`,[\s\S]*?category:\s*['"]([^'"]+)['"],[\s\S]*?date:\s*['"]([^'"]+)['"],[\s\S]*?(?:author:\s*['"]([^'"]*)['"],)?[\s\S]*?(?:image:\s*['"]([^'"]*)['"],)?[\s\S]*?(?:metaDescription:\s*['"]([^'"]*)['"],)?[\s\S]*?\}/g;
const articles = [];
let match;

while ((match = articlePattern.exec(dataContent)) !== null) {
  articles.push({
    id: parseInt(match[1]),
    slug: match[2],
    title: match[3],
    summary: match[4],
    category: match[5],
    date: match[6],
    author: match[7] || 'هيئة التحرير',
    image: match[8] || '',
    metaDescription: match[9] || match[4]
  });
}

// Trier par date (plus récent en premier)
articles.sort((a, b) => {
  const dateA = new Date(a.date);
  const dateB = new Date(b.date);
  return dateB - dateA;
});

// Domaine du site
const DOMAIN = 'https://arabpress.netlify.app';
const SITE_NAME = 'صدى العرب';
const SITE_DESCRIPTION = 'مصدرك الموثوق للأخبار العاجلة والتحليلات المتعمقة باللغة العربية، مع تغطية شاملة للأحداث السياسية والاقتصادية والثقافية والبيئية.';

// Fonction pour échapper les caractères XML
function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Fonction pour formater la date en format RFC 822 (requis pour RSS)
function formatRSSDate(dateString) {
  const date = new Date(dateString);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const day = days[date.getUTCDay()];
  const dayNum = date.getUTCDate().toString().padStart(2, '0');
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');
  
  return `${day}, ${dayNum} ${month} ${year} ${hours}:${minutes}:${seconds} +0000`;
}

function generateRSS() {
  const now = new Date();
  const lastBuildDate = formatRSSDate(now.toISOString());
  
  let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:sy="http://purl.org/rss/1.0/modules/syndication/">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${DOMAIN}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>ar</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <pubDate>${lastBuildDate}</pubDate>
    <managingEditor>sadaarabe@gmail.com (${escapeXml(SITE_NAME)})</managingEditor>
    <webMaster>sadaarabe@gmail.com (${escapeXml(SITE_NAME)})</webMaster>
    <generator>ArabPress RSS Generator</generator>
    <atom:link href="${DOMAIN}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${DOMAIN}/logo.svg</url>
      <title>${escapeXml(SITE_NAME)}</title>
      <link>${DOMAIN}</link>
    </image>
    <sy:updatePeriod>hourly</sy:updatePeriod>
    <sy:updateFrequency>1</sy:updateFrequency>
    
`;
  
  // Ajouter les articles (limiter à 50 derniers)
  articles.slice(0, 50).forEach((article) => {
    const articleUrl = `${DOMAIN}/article/${article.slug}`;
    const pubDate = formatRSSDate(article.date);
    const description = escapeXml(article.metaDescription || article.summary);
    const imageUrl = article.image ? `${DOMAIN}${article.image}` : '';
    
    rss += `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <description>${description}</description>
      <pubDate>${pubDate}</pubDate>
      <dc:creator>${escapeXml(article.author)}</dc:creator>
      <category>${escapeXml(article.category)}</category>
`;
    
    if (imageUrl) {
      rss += `      <enclosure url="${imageUrl}" type="image/webp"/>
`;
    }
    
    rss += `    </item>
`;
  });
  
  rss += `  </channel>
</rss>`;
  
  // Sauvegarder le fichier RSS
  const outputPath = path.join('public', 'feed.xml');
  fs.writeFileSync(outputPath, rss, 'utf-8');
  
  console.log('✅ Feed RSS créé avec succès !');
  console.log(`   Fichier: ${outputPath}`);
  console.log(`   Articles: ${articles.slice(0, 50).length}`);
  console.log(`   URL: ${DOMAIN}/feed.xml`);
}

generateRSS();

