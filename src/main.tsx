import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import './index.css'

// Vérifier que l'élément root existe
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found!')
}

// Initialiser React avec gestion d'erreur
try {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <React.StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </React.StrictMode>
  )
  // Masquer le message de chargement une fois React monté
  setTimeout(() => {
    const loadingMsg = document.querySelector('body > div[style*="position:fixed"]') as HTMLElement
    if (loadingMsg) {
      loadingMsg.style.display = 'none'
    }
  }, 500)
} catch (error) {
  console.error('Erreur lors de l\'initialisation de React:', error)
  rootElement.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;direction:rtl;padding:20px;text-align:center;background:#f9fafb;">
      <div>
        <h1 style="color:#dc2626;margin-bottom:16px;font-size:24px;">حدث خطأ</h1>
        <p style="color:#666;margin-bottom:8px;">حدث خطأ أثناء تحميل التطبيق.</p>
        <p style="color:#999;font-size:12px;margin-bottom:16px;">${error instanceof Error ? error.message : 'Erreur inconnue'}</p>
        <button onclick="window.location.reload()" style="padding:10px 20px;background:#2563eb;color:white;border:none;border-radius:6px;cursor:pointer;font-size:14px;">إعادة المحاولة</button>
        <p style="color:#999;font-size:11px;margin-top:16px;">Vérifiez la console du navigateur (F12) pour plus de détails.</p>
      </div>
    </div>
  `
}

