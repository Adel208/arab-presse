import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Articles manquants (7 et 8)
const missingArticles = [
  {
    id: 7,
    slug: 'gabes-pollution-environnement',
    title: 'قابس تختنق: مدينة الموت البطيء بين وعود السلطة وصمود الأهالي',
    description: 'تتصاعد الأزمة البيئية في مدينة قابس جنوب شرق تونس بعد عقود من التلوّث الناتج عن مصانع الفوسفات والمواد الكيميائية.',
    category: 'بيئة',
    date: '2025-01-15',
    image: '/img/gabesmanif.webp'
  },
  {
    id: 8,
    slug: 'maroc-genz-212-manifestations',
    title: 'حركة GenZ 212 في المغرب: الشباب يطالب بإسقاط الحكومة والمستشفيات بدل الملاعب',
    description: 'انطلقت احتجاجات هي الأكبر منذ عقود في المغرب بقيادة GenZ 212، حيث يطالب الشباب بخدمات صحية وتعليمية لائقة',
    category: 'سياسة',
    date: '2025-09-28',
    image: '/img/marocmanif.webp'
  }
];

const baseUrl = 'https://arabpress.netlify.app';

// Lire l'index.html principal
const mainIndexPath = join('dist', 'index.html');
const mainIndexContent = readFileSync(mainIndexPath, 'utf-8');
const jsMatch = mainIndexContent.match(/<script[^>]+src="([^"]+)"/);
const cssMatch = mainIndexContent.match(/<link[^>]+href="([^"]+\.css)"/);
const jsFile = jsMatch ? jsMatch[1] : '/assets/index.js';
const cssFile = cssMatch ? cssMatch[1] : '/assets/index.css';

missingArticles.forEach(article => {
  const articleDir = join('dist', 'article', article.slug);
  mkdirSync(articleDir, { recursive: true });

  const articleUrl = `${baseUrl}/article/${article.slug}`;
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
    <meta property="og:site_name" content="صدى العرب" />
    <meta property="article:published_time" content="${article.date}" />
    <meta property="article:section" content="${article.category}" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${articleUrl}" />
    <meta name="twitter:title" content="${article.title.replace(/"/g, '&quot;')}" />
    <meta name="twitter:description" content="${article.description.replace(/"/g, '&quot;')}" />
    ${imageUrl ? `<meta name="twitter:image" content="${imageUrl}" />` : ''}
    
    <title>${article.title.replace(/"/g, '&quot;')} - صدى العرب</title>
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

console.log(`🎉 Generated ${missingArticles.length} article pages successfully!`);

