import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Lire data.ts brut et extraire les articles
const dataPath = join('src', 'data.ts');
if (!existsSync(dataPath)) {
  console.log('⚠️  src/data.ts not found, skipping article generation');
  process.exit(0);
}

const dataContent = readFileSync(dataPath, 'utf-8');

// Extraire tous les articles - méthode plus robuste
const articles = [];
const lines = dataContent.split('\n');
let currentArticle = null;
let inArticle = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Détecter le début d'un article
  if (line.trim().match(/^\{\s*$/)) {
    inArticle = true;
    currentArticle = {};
    continue;
  }
  
  // Détecter la fin d'un article (avec ou sans virgule, car le dernier n'a pas de virgule)
  if (inArticle && (line.trim() === '},' || line.trim() === '}')) {
    if (currentArticle.id && currentArticle.slug) {
      articles.push(currentArticle);
    }
    inArticle = false;
    currentArticle = null;
    continue;
  }
  
  // Extraire les champs
  if (inArticle && currentArticle) {
    const idMatch = line.match(/id:\s*(\d+)/);
    const slugMatch = line.match(/slug:\s*['"]([^'"]+)['"]/);
    const titleMatch = line.match(/title:\s*`([^`]+)`/);
    const summaryMatch = line.match(/summary:\s*`([^`]+)`/);
    const categoryMatch = line.match(/category:\s*['"]([^'"]+)['"]/);
    const dateMatch = line.match(/date:\s*['"]([^'"]+)['"]/);
    const imageMatch = line.match(/image:\s*['"]([^'"]*)['"]/);
    
    if (idMatch) currentArticle.id = parseInt(idMatch[1]);
    if (slugMatch) currentArticle.slug = slugMatch[1];
    if (titleMatch) currentArticle.title = titleMatch[1];
    if (summaryMatch) currentArticle.description = summaryMatch[1];
    if (categoryMatch) currentArticle.category = categoryMatch[1];
    if (dateMatch) {
      let date = dateMatch[1];
      if (date.includes('T')) date = date.split('T')[0];
      currentArticle.date = date;
    }
    if (imageMatch) currentArticle.image = imageMatch[1];
  }
}

const baseUrl = process.env.URL || 'https://arabpress.netlify.app';

// Lire l'index.html principal pour obtenir les références correctes des assets
const mainIndexPath = join('dist', 'index.html');
if (!existsSync(mainIndexPath)) {
  console.log('⚠️  dist/index.html not found');
  process.exit(0);
}

const mainIndexContent = readFileSync(mainIndexPath, 'utf-8');
// Extraire les chemins d'assets - chercher le script module et le CSS
const jsMatches = mainIndexContent.matchAll(/<script[^>]+src="([^"]+)"/g);
const cssMatches = mainIndexContent.matchAll(/<link[^>]+href="([^"]+\.css)"/g);

// Prendre le premier script module trouvé
let jsFile = '/assets/index.js';
for (const match of jsMatches) {
  if (match[1].startsWith('/assets/')) {
    jsFile = match[1];
    break;
  }
}

// Prendre le premier CSS trouvé
let cssFile = '/assets/index.css';
for (const match of cssMatches) {
  if (match[1].startsWith('/assets/')) {
    cssFile = match[1];
    break;
  }
}

// Extraire le script Google Analytics du fichier index principal
const gaMatch = mainIndexContent.match(/<script[^>]+src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=([^"]+)"/);
const gaId = gaMatch ? gaMatch[1] : null;

articles.forEach(article => {
  const articleDir = join('dist', 'article', article.slug);
  mkdirSync(articleDir, { recursive: true });

  const articleUrl = `${baseUrl}/article/${article.slug}`;
  const imageUrl = article.image ? `${baseUrl}${article.image}` : null;

  // Construire le HTML avec tous les éléments nécessaires
  const html = `<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    ${gaId ? `<!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}');
    </script>` : ''}
    
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/logo.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${(article.description || '').replace(/"/g, '&quot;')}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${articleUrl}" />
    <meta property="og:title" content="${(article.title || '').replace(/"/g, '&quot;')}" />
    <meta property="og:description" content="${(article.description || '').replace(/"/g, '&quot;')}" />
    ${imageUrl ? `<meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:secure_url" content="${imageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/${imageUrl.includes('.webp') ? 'webp' : 'jpeg'}" />` : ''}
    <meta property="og:site_name" content="صدى العرب" />
    <meta property="article:published_time" content="${article.date}" />
    <meta property="article:section" content="${article.category}" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${articleUrl}" />
    <meta name="twitter:title" content="${(article.title || '').replace(/"/g, '&quot;')}" />
    <meta name="twitter:description" content="${(article.description || '').replace(/"/g, '&quot;')}" />
    ${imageUrl ? `<meta name="twitter:image" content="${imageUrl}" />` : ''}
    
    <title>${(article.title || '').replace(/"/g, '&quot;')} - صدى العرب</title>
    <script type="module" crossorigin src="${jsFile}"></script>
    <link rel="stylesheet" crossorigin href="${cssFile}">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

  writeFileSync(join(articleDir, 'index.html'), html);
  console.log(`✅ Generated: /article/${article.slug}/index.html`);
});

console.log(`🎉 Generated ${articles.length} article pages successfully!`);
