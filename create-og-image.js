import sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';

const width = 1200;
const height = 630;

// Titre et sous-titre en arabe
const title = 'صدى العرب';
const subtitle = 'مصدرك الموثوق للأخبار العاجلة والتحليلات المتعمقة باللغة العربية';
const siteUrl = 'arabpress.netlify.app';

// Créer un SVG avec texte arabe - Design professionnel amélioré
const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <!-- Dégradé bleu professionnel amélioré -->
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e3a8a;stop-opacity:1" />
      <stop offset="30%" style="stop-color:#1e40af;stop-opacity:1" />
      <stop offset="70%" style="stop-color:#2563eb;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
    </linearGradient>
    
    <!-- Dégradé pour le texte principal -->
    <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#e0f2fe;stop-opacity:1" />
    </linearGradient>
    
    <!-- Ombre portée pour le texte -->
    <filter id="textShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="6"/>
      <feOffset dx="0" dy="4" result="offsetblur"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.4"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <!-- Effet de brillance subtil -->
    <radialGradient id="shine" cx="50%" cy="30%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.15" />
      <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0" />
    </radialGradient>
  </defs>
  
  <!-- Fond avec dégradé -->
  <rect width="${width}" height="${height}" fill="url(#bgGradient)"/>
  
  <!-- Effet de brillance -->
  <rect width="${width}" height="${height}" fill="url(#shine)"/>
  
  <!-- Motifs décoratifs subtils (cercles en arrière-plan) -->
  <circle cx="80" cy="80" r="180" fill="rgba(255,255,255,0.04)"/>
  <circle cx="${width-150}" cy="${height-120}" r="220" fill="rgba(255,255,255,0.04)"/>
  <circle cx="${width/2}" cy="50" r="150" fill="rgba(255,255,255,0.03)"/>
  
  <!-- Conteneur principal pour le texte (centré verticalement et horizontalement) -->
  <g transform="translate(${width/2}, ${height/2})">
    <!-- Titre principal - Grand et majestueux -->
    <text
      x="0"
      y="-40"
      font-family="Arial, 'Segoe UI', 'Arabic UI Text', 'DejaVu Sans', sans-serif"
      font-size="96"
      font-weight="bold"
      fill="url(#textGradient)"
      text-anchor="middle"
      filter="url(#textShadow)"
      style="letter-spacing: 3px; font-stretch: normal;"
      dominant-baseline="middle"
    >
      ${title}
    </text>
    
    <!-- Ligne décorative élégante et discrète sous le titre (blanche) -->
    <line x1="-300" y1="30" x2="300" y2="30" stroke="#ffffff" stroke-width="2" opacity="0.6" stroke-linecap="round"/>
    
    <!-- Sous-titre - Professionnel et lisible -->
    <text
      x="0"
      y="90"
      font-family="Arial, 'Segoe UI', 'Arabic UI Text', 'DejaVu Sans', sans-serif"
      font-size="36"
      fill="#e0f2fe"
      text-anchor="middle"
      filter="url(#textShadow)"
      style="letter-spacing: 1.5px;"
      dominant-baseline="middle"
    >
      ${subtitle}
    </text>
  </g>
  
  <!-- Éléments décoratifs aux coins -->
  <circle cx="50" cy="50" r="3" fill="rgba(255,255,255,0.3)"/>
  <circle cx="${width-50}" cy="50" r="3" fill="rgba(255,255,255,0.3)"/>
  <circle cx="50" cy="${height-50}" r="3" fill="rgba(255,255,255,0.3)"/>
  <circle cx="${width-50}" cy="${height-50}" r="3" fill="rgba(255,255,255,0.3)"/>
  
  <!-- URL du site en petit (coin inférieur droit) -->
  <g transform="translate(${width-20}, ${height-20})">
    <text
      x="0"
      y="0"
      font-family="Arial, 'Segoe UI', 'DejaVu Sans', sans-serif"
      font-size="18"
      fill="#e0f2fe"
      text-anchor="end"
      dominant-baseline="baseline"
      opacity="0.85"
      style="letter-spacing: 0.5px;"
    >
      ${siteUrl}
    </text>
  </g>
</svg>
`;

async function createOGImage() {
  try {
    console.log('🎨 Création de l\'image Open Graph...\n');
    
    // Convertir SVG en WebP
    const imageBuffer = await sharp(Buffer.from(svg))
      .webp({ quality: 95, effort: 6 })
      .toBuffer();
    
    // Sauvegarder l'image
    const outputPath = './public/img/og-home.webp';
    await sharp(imageBuffer).toFile(outputPath);
    
    const stats = await (await import('fs/promises')).stat(outputPath);
    console.log('✅ Image Open Graph créée avec succès !');
    console.log(`   Fichier: ${outputPath}`);
    console.log(`   Dimensions: ${width}x${height}px`);
    console.log(`   Taille: ${(stats.size / 1024).toFixed(1)} KB`);
    console.log(`   Format: WebP`);
    console.log('\n📋 Contenu de l\'image:');
    console.log(`   Titre: ${title}`);
    console.log(`   Sous-titre: ${subtitle}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la création:', error.message);
    process.exit(1);
  }
}

createOGImage();

