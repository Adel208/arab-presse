import { Helmet } from 'react-helmet-async';

export default function Terms() {
  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-gray-50 py-12">
      <Helmet>
        <title>شروط الاستخدام - صدى العرب</title>
        <meta name="description" content="شروط وأحكام استخدام موقع صدى العرب" />
      </Helmet>
      
      <main className="max-w-4xl mx-auto px-6">
        <article className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8">شروط الاستخدام</h1>
          
          <div className="prose prose-lg max-w-none space-y-6 text-gray-700 leading-relaxed">
            <p className="text-lg">
              مرحباً بك في موقع <strong>صدى العرب</strong>. باستخدامك لهذا الموقع، فإنك توافق على الامتثال للشروط والأحكام التالية.
            </p>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. قبول الشروط</h2>
              <p>
                من خلال الوصول إلى هذا الموقع واستخدامه، فإنك تقر بأنك قد قرأت وفهمت هذه الشروط وتوافق على الالتزام بها.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. محتوى الموقع</h2>
              <p>
                يوفر موقع <strong>صدى العرب</strong> الأخبار والتحليلات المتعلقة بالعالم العربي. نحن نسعى جاهدين لضمان دقة المعلومات، لكننا:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>لا نضمن دقة، اكتمال، أو صحة أي محتوى</li>
                <li>غير مسؤولين عن أخطاء أو أخطاء في المحتوى</li>
                <li>قد نستخدم أدوات الذكاء الاصطناعي في إنتاج بعض المحتوى</li>
                <li>جميع المقالات تخضع للمراجعة قبل النشر</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. حقوق الملكية الفكرية</h2>
              <p>
                جميع محتويات هذا الموقع، بما في ذلك النصوص والصور والشعارات، محمية بحقوق الطبع والنشر. لا يجوز:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>نسخ أو إعادة إنتاج المحتوى دون إذن</li>
                <li>استخدام المحتوى لأغراض تجارية</li>
                <li>توزيع المحتوى على مواقع أخرى</li>
              </ul>
              <p className="mt-4">
                يُسمح باقتباس أجزاء صغيرة مع الإشارة إلى المصدر.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. المحتوى المقدم من المستخدمين</h2>
              <p>
                إذا كنت تقدم محتوى إلى الموقع (تعليقات، رسائل، إلخ)، فإنك:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>تمنحنا الحق في استخدام وتعديل ونشر هذا المحتوى</li>
                <li>تضمن أن المحتوى لا ينتهك حقوق الآخرين</li>
                <li>تتعهد بعدم نشر محتوى مخالف أو مسيء</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. الإعلانات</h2>
              <p>
                يحتوي موقعنا على إعلانات من Google AdSense وشركاء آخرين. نحن:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>غير مسؤولين عن محتوى الإعلانات المعروضة</li>
                <li>لا نمتلك أي سيطرة على إعلانات Google</li>
                <li>نتلقى تعويضاً من بعض الروابط والإعلانات</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. الروابط الخارجية</h2>
              <p>
                قد يحتوي موقعنا على روابط لمواقع خارجية. نحن لا نتحكم في هذه المواقع ونحن غير مسؤولين عن محتواها أو سياستها.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. إخلاء المسؤولية</h2>
              <p>
                لا نضمن أن الموقع سيكون متاحاً بشكل مستمر أو خالياً من الأخطاء. نحن غير مسؤولين عن:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>أي خسائر أو أضرار ناتجة عن استخدام الموقع</li>
                <li>انقطاع الخدمة أو الأعطال التقنية</li>
                <li>محتوى مواقع خارجية مربوطة</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. التعديلات على الشروط</h2>
              <p>
                نحتفظ بالحق في تعديل هذه الشروط في أي وقت. استمرار استخدامك للموقع بعد التعديلات يعني موافقتك عليها.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. القانون الحاكم</h2>
              <p>
                تخضع هذه الشروط لقوانين البلد الذي يتم فيه إدارة الموقع.
              </p>
            </section>

            <section className="bg-blue-50 p-6 rounded-lg border-r-4 border-blue-600 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">اتصل بنا</h2>
              <p>
                إذا كان لديك أي أسئلة حول شروط الاستخدام هذه، يرجى الاتصال بنا:
              </p>
              <p className="mt-2">
                <strong>البريد الإلكتروني:</strong> legal@echode-larabe.com
              </p>
            </section>

            <p className="text-sm text-gray-500 mt-8">
              آخر تحديث: {new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}

