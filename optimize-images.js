import sharp from 'sharp';
import { readdir, stat, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const IMG_DIR = './public/img';
const MAX_SIZE_BYTES = 200 * 1024; // 200KB - seuil pour optimisation
const QUALITY = 85; // Qualité WebP (80-90 = bon équilibre)

async function optimizeImage(inputPath, outputPath) {
  try {
    const stats = await stat(inputPath);
    const sizeKB = stats.size / 1024;
    
    console.log(`\n📸 Optimisation: ${inputPath.split('/').pop()}`);
    console.log(`   Taille actuelle: ${sizeKB.toFixed(1)} KB`);
    
    // Obtenir les métadonnées de l'image
    const metadata = await sharp(inputPath).metadata();
    console.log(`   Dimensions: ${metadata.width}x${metadata.height}`);
    
    // Optimiser en WebP
    await sharp(inputPath)
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(outputPath);
    
    const newStats = await stat(outputPath);
    const newSizeKB = newStats.size / 1024;
    const reduction = ((stats.size - newStats.size) / stats.size * 100).toFixed(1);
    
    console.log(`   ✅ Nouvelle taille: ${newSizeKB.toFixed(1)} KB`);
    console.log(`   📉 Réduction: ${reduction}%`);
    
    return {
      original: inputPath,
      optimized: outputPath,
      originalSize: stats.size,
      optimizedSize: newStats.size,
      reduction: parseFloat(reduction)
    };
  } catch (error) {
    console.error(`   ❌ Erreur: ${error.message}`);
    return null;
  }
}

async function processImages() {
  console.log('🚀 Démarrage de l\'optimisation des images...\n');
  
  try {
    const files = await readdir(IMG_DIR);
    const imagesToOptimize = [];
    const results = [];
    
    // Identifier les images à optimiser
    for (const file of files) {
      const filePath = join(IMG_DIR, file);
      const stats = await stat(filePath);
      
      // Vérifier si c'est une image PNG ou JPG
      if ((file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) && 
          stats.size > MAX_SIZE_BYTES) {
        const webpPath = filePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
        
        // Vérifier si le WebP n'existe pas déjà ou est plus ancien
        if (!existsSync(webpPath) || (await stat(webpPath)).mtime < stats.mtime) {
          imagesToOptimize.push({ file, filePath, webpPath, size: stats.size });
        }
      }
    }
    
    if (imagesToOptimize.length === 0) {
      console.log('✅ Aucune image à optimiser.');
      return;
    }
    
    console.log(`📋 ${imagesToOptimize.length} image(s) à optimiser:\n`);
    
    // Optimiser chaque image
    for (const { file, filePath, webpPath } of imagesToOptimize) {
      const result = await optimizeImage(filePath, webpPath);
      if (result) {
        results.push(result);
      }
    }
    
    // Résumé
    if (results.length > 0) {
      console.log('\n' + '='.repeat(60));
      console.log('📊 RÉSUMÉ DE L\'OPTIMISATION');
      console.log('='.repeat(60));
      
      let totalOriginal = 0;
      let totalOptimized = 0;
      
      results.forEach(r => {
        totalOriginal += r.originalSize;
        totalOptimized += r.optimizedSize;
        const fileName = r.original.split('/').pop();
        console.log(`\n${fileName}:`);
        console.log(`  ${(r.originalSize / 1024).toFixed(1)} KB → ${(r.optimizedSize / 1024).toFixed(1)} KB (${r.reduction}%)`);
      });
      
      const totalReduction = ((totalOriginal - totalOptimized) / totalOriginal * 100).toFixed(1);
      const totalSaved = ((totalOriginal - totalOptimized) / 1024).toFixed(1);
      
      console.log('\n' + '-'.repeat(60));
      console.log(`📦 TOTAL:`);
      console.log(`   Avant: ${(totalOriginal / 1024).toFixed(1)} KB`);
      console.log(`   Après: ${(totalOptimized / 1024).toFixed(1)} KB`);
      console.log(`   Économisé: ${totalSaved} KB (${totalReduction}%)`);
      console.log('='.repeat(60));
      
      console.log('\n⚠️  IMPORTANT:');
      console.log('   Les fichiers WebP ont été créés. Vous devez maintenant:');
      console.log('   1. Vérifier que les nouvelles images WebP fonctionnent correctement');
      console.log('   2. Remplacer les références dans le code (.png/.jpg → .webp)');
      console.log('   3. Supprimer les anciens fichiers PNG/JPG si tout fonctionne');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du traitement:', error);
    process.exit(1);
  }
}

// Exécuter le script
processImages();

