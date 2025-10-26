import { writeFileSync, mkdirSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const articles = [
  {
    id: 7,
    title: 'قابس تختنق: مدينة الموت البطيء بين وعود السلطة وصمود الأهالي',
    description: 'تعيش قابس التونسية أزمة بيئية خانقة دفعت آلاف السكان إلى الشوارع احتجاجًا على التلوث الصناعي، وسط وعود حكومية واتهامات بالإهمال والتواطؤ.',
    image: '/img/gabesmanif.webp',
    date: '2025-01-15',
    category: 'بيئة'
  },
  {
    id: 8,
    title: 'حركة GenZ 212 في المغرب: الشباب يطالب بإسقاط الحكومة والمستشفيات بدل الملاعب',
    description: 'انطلقت احتجاجات هي الأكبر منذ عقود في المغرب بقيادة GenZ 212، حيث يطالب الشباب بخدمات صحية وتعليمية لائقة، ويقفون ضد الحكومة وسياسات الإنفاق المتهورة.',
    image: '/img/marocmanif.webp',
    date: '2025-09-28',
    category: 'سياسة'
  }
];

const baseUrl = process.env.URL || 'https://arabpress.netlify.app';

// Lire l'index.html principal pour obtenir les références correctes des assets
const mainIndexPath = join('dist', 'index.html');
const mainIndexContent = readFileSync(mainIndexPath, 'utf-8');
const jsMatch = mainIndexContent.match(/<script[^>]+src="([^"]+)"/);
const cssMatch = mainIndexContent.match(/<link[^>]+href="([^"]+\.css)"/);
const jsFile = jsMatch ? jsMatch[1] : '/assets/index.js';
const cssFile = cssMatch ? cssMatch[1] : '/assets/index.css';

articles.forEach(article => {
  const articleDir = join('dist', 'article', String(article.id));
  mkdirSync(articleDir, { recursive: true });

  const imageUrl = `${baseUrl}${article.image}`;
  const articleUrl = `${baseUrl}/article/${article.id}`;

  const html = `<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${article.description}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${articleUrl}" />
    <meta property="og:title" content="${article.title}" />
    <meta property="og:description" content="${article.description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:secure_url" content="${imageUrl}" />
    <meta property="og:image:type" content="image/webp" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="بوابة الأخبار العربية" />
    <meta property="article:published_time" content="${article.date}" />
    <meta property="article:section" content="${article.category}" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${articleUrl}" />
    <meta name="twitter:title" content="${article.title}" />
    <meta name="twitter:description" content="${article.description}" />
    <meta name="twitter:image" content="${imageUrl}" />
    
    <title>${article.title} - بوابة الأخبار العربية</title>
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

console.log('🎉 Article pages generated successfully!');

