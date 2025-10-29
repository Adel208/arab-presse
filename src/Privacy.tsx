import { Helmet } from 'react-helmet-async';

export default function Privacy() {
  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-gray-50 py-12">
      <Helmet>
        <title>سياسة الخصوصية - صدى العرب</title>
        <meta name="description" content="سياسة الخصوصية وشروط الاستخدام لموقع صدى العرب" />
      </Helmet>
      
      <main className="max-w-4xl mx-auto px-6">
        <article className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8">سياسة الخصوصية</h1>
          
          <div className="prose prose-lg max-w-none space-y-6 text-gray-700 leading-relaxed">
            <p className="text-lg">
              نسعى في <strong>صدى العرب</strong> إلى حماية خصوصيتك وضمان أمان معلوماتك الشخصية.
            </p>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. المعلومات التي نجمعها</h2>
              <p>
                عندما تزور موقعنا، قد نجمع المعلومات التالية:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>عنوان IP الخاص بك</li>
                <li>نوع المتصفح ونسخته</li>
                <li>الصفحات التي تزورها</li>
                <li>مدة زيارتك للموقع</li>
                <li>معلومات جهازك</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. استخدام الكوكيز (Cookies)</h2>
              <p>
                نستخدم ملفات تعريف الارتباط (Cookies) لتحسين تجربتك على موقعنا. تساعدنا هذه الملفات على:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>تحليل سلوك الزوار</li>
                <li>تحسين محتوى الموقع</li>
                <li>تخصيص الإعلانات</li>
              </ul>
              <p className="mt-4">
                يمكنك إلغاء تفعيل ملفات تعريف الارتباط من إعدادات المتصفح، ولكن هذا قد يؤثر على وظائف الموقع.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. إعلانات Google AdSense</h2>
              <p>
                يستخدم موقعنا خدمة <strong>Google AdSense</strong> لعرض الإعلانات. هذا يعني أن شركة Google وأطرافها الثالثة تستخدم ملفات تعريف الارتباط (Cookies) لجمع معلومات حول زياراتك لموقعنا ومواقع أخرى على الإنترنت.
              </p>
              
              <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">ما هي ملفات تعريف الارتباط (Cookies) للإعلانات؟</h3>
              <p>
                ملفات تعريف الارتباط الخاصة بالإعلانات (Advertising Cookies) هي ملفات صغيرة تخزنها Google على جهازك عند زيارتك لموقعنا. هذه الملفات تساعد على:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-3">
                <li>تذكر زياراتك لموقعنا ومواقع أخرى</li>
                <li>تجمع معلومات حول اهتماماتك وتفضيلاتك</li>
                <li>تعرض لك إعلانات أكثر صلة بمحتوى تبحث عنه أو تهتم به</li>
                <li>تقيس فعالية الإعلانات</li>
              </ul>

              <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">الشركاء الإعلانيون</h3>
              <p>
                يعمل Google AdSense مع شبكة واسعة من المعلنين وشركاء الإعلان. قد يتم جمع معلوماتك وتستخدم من قبل:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-3">
                <li>Google LLC وشركاتها التابعة</li>
                <li>الشركاء المعتمدون من Google AdSense</li>
                <li>شبكات الإعلان التابعة لجهات خارجية</li>
              </ul>

              <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Remarketing</h3>
              <p>
                قد يستخدم موقعنا تقنية Remarketing (إعادة استهداف) التي تسمح لـ Google بإظهار إعلانات لموقعنا على المواقع الأخرى التي تزورها عبر الإنترنت. يتم ذلك باستخدام ملفات تعريف الارتباط الخاصة بـ Google.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">كيف يمكنك التحكم في الإعلانات؟</h3>
              <p className="mb-3">
                يمكنك التحكم في الإعلانات التي تراها وملفات تعريف الارتباط المستخدمة من خلال:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>
                  <strong>إعدادات الإعلانات في Google:</strong>{' '}
                  <a 
                    href="https://www.google.com/settings/ads" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    اضغط هنا للوصول إلى إعدادات الإعلانات
                  </a>
                </li>
                <li>
                  <strong>Opt-out من Google AdSense:</strong>{' '}
                  <a 
                    href="https://www.google.com/ads/preferences" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    اضغط هنا لإلغاء الاشتراك
                  </a>
                </li>
                <li>
                  <strong>حذف ملفات تعريف الارتباط:</strong> يمكنك حذف ملفات تعريف الارتباط من إعدادات المتصفح في أي وقت
                </li>
                <li>
                  <strong>Network Advertising Initiative:</strong>{' '}
                  <a 
                    href="http://www.networkadvertising.org/choices/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    www.networkadvertising.org/choices/
                  </a>
                </li>
              </ul>

              <div className="bg-yellow-50 border-r-4 border-yellow-500 p-4 rounded-lg mt-4">
                <p className="text-sm text-yellow-900">
                  <strong>ملاحظة مهمة:</strong> حتى إذا قمت بإلغاء الاشتراك من الإعلانات المخصصة، ستظل ترى إعلانات على موقعنا، لكنها لن تكون مخصصة بناءً على اهتماماتك.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. مشاركة المعلومات</h2>
              <p>
                نحن لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة. قد نشارك معلومات مجمعة (غير قابلة للتعريف) مع شركائنا من أجل تحسين خدماتنا.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. أمان المعلومات</h2>
              <p>
                نتخذ إجراءات أمنية مناسبة لحماية معلوماتك من الوصول غير المصرح به أو التغيير أو الإفشاء.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. حقوقك</h2>
              <p>لديك الحق في:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>الوصول إلى معلوماتك الشخصية</li>
                <li>طلب تصحيح أو حذف معلوماتك</li>
                <li>رفض تتبعك لإعلانات Google</li>
                <li>إلغاء الاشتراك في النشرات الإخبارية</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. التغييرات على هذه السياسة</h2>
              <p>
                قد نحدث سياسة الخصوصية هذه من وقت لآخر. سيتم إعلامك بأي تغييرات عبر النشر على هذه الصفحة.
              </p>
            </section>

            <section className="bg-blue-50 p-6 rounded-lg border-r-4 border-blue-600 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">تواصل معنا</h2>
              <p>
                إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى الاتصال بنا على:
              </p>
              <p className="mt-2">
                <strong>البريد الإلكتروني:</strong> privacy@echode-larabe.com
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

