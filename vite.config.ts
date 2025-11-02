import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Minification activée par défaut avec esbuild
    minify: 'esbuild',
    cssMinify: true,
    // Code splitting pour améliorer les performances
    rollupOptions: {
      output: {
        manualChunks: {
          // Séparer React et React-DOM dans un chunk dédié
          'react-vendor': ['react', 'react-dom'],
          // Séparer React Router dans un chunk dédié
          'router-vendor': ['react-router-dom'],
          // Séparer react-helmet-async dans un chunk dédié
          'helmet-vendor': ['react-helmet-async'],
        }
      }
    },
    // Optimisation de la taille des chunks
    chunkSizeWarningLimit: 600,
    // Source maps pour le debugging (désactivé en production pour réduire la taille)
    sourcemap: false,
  },
  // Optimisation des performances de développement
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
  },
})

