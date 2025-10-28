import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Lire data.ts brut et extraire les articles
const dataPath = join('src', 'data.ts');
if (!existsSync(dataPath)) {
  console.log('⚠️  src/data.ts not found, skipping article generation');
  process.exit(0);
}

const dataContent = readFileSync(dataPath, 'utf-8');

// Extraire les articles depuis le tableau newsData (format simplifié)
// Chercher tous les blocs { id: X, ... }
const articlePattern = /\{\s*id:\s*(\d+),[\s\S]*?slug:\s*['"]([^'"]+)['"],[\s\S]*?title:\s*`([^`]+)`,[\s\S]*?summary:\s*`([^`]+)`,[\s\S]*?category:\s*['"]([^'"]+)['"],[\s\S]*?date:\s*['"]([^'"]+)['"]([\s\S]*?)content:\s*`/g;
const articles = [];
let match;

while ((match = articlePattern.exec(dataContent)) !== null) {
  // Extraire l'image depuis match[7] si elle existe
  let image = null;
  const imageMatch = match[7] ? match[7].match(/image:\s*['"]([^'"]*)['"]/) : null;
  if (imageMatch) {
    image = imageMatch[1];
  }

  articles.push({
    id: parseInt(match[1]),
    slug: match[2],
    title: match[3],
    description: match[4],
    category: match[5],
    date: match[6],
    image: image
  });
}

const baseUrl = process.env.URL || 'https://arabpress.netlify.app';

// Lire l'index.html principal pour obtenir les références correctes des assets
const mainIndexPath = join('dist', 'index.html');
if (!existsSync(mainIndexPath)) {
  console.log('⚠️  dist/index.html not found');
  process.exit(0);
}

const mainIndexContent = readFileSync(mainIndexPath, 'utf-8');
const jsMatch = mainIndexContent.match(/<script[^>]+src="([^"]+)"/);
const cssMatch = mainIndexContent.match(/<link[^>]+href="([^"]+\.css)"/);
const jsFile = jsMatch ? jsMatch[1] : '/assets/index.js';
const cssFile = cssMatch ? cssMatch[1] : '/assets/index.css';

articles.forEach(article => {
  const articleDir = join('dist', 'article', String(article.id));
  mkdirSync(articleDir, { recursive: true });

    const articleUrl = `${baseUrl}/article/${article.id}`;
    const imageUrl = article.image ? `${baseUrl}${article.image}` : null;

  const html = `<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${article.description.replace(/"/g, '&quot;')}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${articleUrl}" />
    <meta property="og:title" content="${article.title.replace(/"/g, '&quot;')}" />
    <meta property="og:description" content="${article.description.replace(/"/g, '&quot;')}" />
    ${imageUrl ? `<meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />` : ''}
    <meta property="og:site_name" content="بوابة الأخبار العربية" />
    <meta property="article:published_time" content="${article.date}" />
    <meta property="article:section" content="${article.category}" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${articleUrl}" />
    <meta name="twitter:title" content="${article.title.replace(/"/g, '&quot;')}" />
    <meta name="twitter:description" content="${article.description.replace(/"/g, '&quot;')}" />
    ${imageUrl ? `<meta name="twitter:image" content="${imageUrl}" />` : ''}
    
    <title>${article.title.replace(/"/g, '&quot;')} - بوابة الأخبار العربية</title>
    <script type="module" crossorigin src="${jsFile}"></script>
    <link rel="stylesheet" crossorigin href="${cssFile}">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

  writeFileSync(join(articleDir, 'index.html'), html);
  console.log(`✅ Generated: /article/${article.id}/index.html`);
});

console.log(`🎉 Generated ${articles.length} article pages successfully!`);
