import { useState, useEffect } from 'react';

export default function NewsletterPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Afficher le popup après 30 secondes si pas déjà fermé
    const timer = setTimeout(() => {
      const hasClosed = localStorage.getItem('newsletter-closed');
      if (!hasClosed) {
        setIsVisible(true);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('newsletter-closed', 'true');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ici, vous pouvez ajouter l'intégration avec votre service d'email marketing
    // Par exemple: Mailchimp, SendGrid, etc.
    
    console.log('Email soumis:', email);
    
    // Pour l'instant, on simule juste l'envoi
    alert('شكراً لتسجيلك! سنرسل لك آخر الأخبار قريباً.');
    
    setIsVisible(false);
    localStorage.setItem('newsletter-closed', 'true');
    localStorage.setItem('newsletter-subscribed', email);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        {/* Bouton fermer */}
        <button
          onClick={handleClose}
          className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="إغلاق"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Contenu */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-extrabold text-gray-900 mb-3">
            اشترك في النشرة الإخبارية
          </h3>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            احصل على آخر الأخبار والتحديثات مباشرة في بريدك الإلكتروني
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="أدخل بريدك الإلكتروني"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              required
            />
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              اشترك الآن
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-4">
            لن نشارك معلوماتك مع أي طرف ثالث
          </p>
        </div>
      </div>
    </div>
  );
}

