import { Helmet } from 'react-helmet-async';

export default function FAQ(): JSX.Element {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "ما هو موقع صدى العرب؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "صدى العرب هو موقع إخباري عربي موثوق يقدم آخر الأخبار العاجلة والتحليلات المتعمقة باللغة العربية. نغطي مجموعة واسعة من المواضيع بما في ذلك السياسة، الاقتصاد، الرياضة، التكنولوجيا، الثقافة، والبيئة."
        }
      },
      {
        "@type": "Question",
        "name": "كيف يمكنني الاشتراك في آخر الأخبار؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "يمكنك الاشتراك في آخر الأخبار من خلال الاشتراك في خدمة RSS Feed المتاحة على الموقع. ابحث عن رابط \"اشترك في RSS\" في الصفحة الرئيسية أو في Footer الموقع."
        }
      },
      {
        "@type": "Question",
        "name": "ما هي المصادر التي تعتمدونها في نشر الأخبار؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "نعتمد على مصادر موثوقة ومحترفة في جمع الأخبار، بما في ذلك وكالات الأنباء الدولية المعتمدة، مصادر رسمية، وتقارير مراسلين متخصصين. نتحقق من جميع المعلومات قبل النشر لضمان الدقة والموثوقية."
        }
      },
      {
        "@type": "Question",
        "name": "كيف يمكنني التواصل معكم؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "يمكنك التواصل معنا من خلال صفحة \"اتصل بنا\" أو عبر البريد الإلكتروني: sadaarabe@gmail.com. نحن نرحب بملاحظاتكم واقتراحاتكم."
        }
      },
      {
        "@type": "Question",
        "name": "هل يمكنني مشاركة مقالاتكم على وسائل التواصل الاجتماعي؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "نعم، يمكنك مشاركة مقالاتنا على جميع منصات التواصل الاجتماعي. نرحب بالمشاركة مع ذكر المصدر (صدى العرب) عند الاقتباس من مقالاتنا."
        }
      },
      {
        "@type": "Question",
        "name": "كيف أجد مقالات في موضوع معين؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "يمكنك تصفح مقالاتنا حسب الفئات المتاحة على الموقع: سياسة، اقتصاد، رياضة، تكنولوجيا، ثقافة، وبيئة. استخدم قائمة التصنيفات في الصفحة الرئيسية أو في Navigation bar للوصول إلى المواضيع التي تهمك."
        }
      },
      {
        "@type": "Question",
        "name": "ما هي سياسة الخصوصية الخاصة بكم؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "نحن نلتزم باحترام خصوصيتك. يمكنك قراءة سياسة الخصوصية الكاملة من خلال صفحة \"سياسة الخصوصية\" في Footer الموقع. نستخدم cookies فقط لتحسين تجربة المستخدم ولأغراض تحليلية."
        }
      },
      {
        "@type": "Question",
        "name": "هل تقدمون خدمات الإعلان؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "نعم، نقدم خدمات الإعلان للشركات والمؤسسات المهتمة بالوصول إلى الجمهور العربي. للاستفسار عن خيارات الإعلان، يرجى التواصل معنا عبر البريد الإلكتروني: sadaarabe@gmail.com."
        }
      }
    ]
  };

  const canonicalUrl = `${window.location.origin}/faq`;

  return (
    <>
      <Helmet>
        <title>الأسئلة الشائعة - صدى العرب</title>
        <meta name="description" content="إجابات على الأسئلة الشائعة حول موقع صدى العرب، كيفية الاشتراك، المصادر، التواصل، والسياسات." />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content="الأسئلة الشائعة - صدى العرب" />
        <meta property="og:description" content="إجابات على الأسئلة الشائعة حول موقع صدى العرب" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        
        {/* Données structurées FAQPage */}
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <div dir="rtl" lang="ar" className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              الأسئلة الشائعة
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              إجابات على الأسئلة الأكثر شيوعاً حول موقع صدى العرب وخدماتنا
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-blue-600 pl-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  ما هو موقع صدى العرب؟
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  صدى العرب هو موقع إخباري عربي موثوق يقدم آخر الأخبار العاجلة والتحليلات المتعمقة باللغة العربية. نغطي مجموعة واسعة من المواضيع بما في ذلك السياسة، الاقتصاد، الرياضة، التكنولوجيا، الثقافة، والبيئة.
                </p>
              </div>

              <div className="border-l-4 border-blue-600 pl-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  كيف يمكنني الاشتراك في آخر الأخبار؟
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  يمكنك الاشتراك في آخر الأخبار من خلال الاشتراك في خدمة RSS Feed المتاحة على الموقع. ابحث عن رابط "اشترك في RSS" في الصفحة الرئيسية أو في Footer الموقع.
                </p>
              </div>

              <div className="border-l-4 border-blue-600 pl-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  ما هي المصادر التي تعتمدونها في نشر الأخبار؟
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  نعتمد على مصادر موثوقة ومحترفة في جمع الأخبار، بما في ذلك وكالات الأنباء الدولية المعتمدة، مصادر رسمية، وتقارير مراسلين متخصصين. نتحقق من جميع المعلومات قبل النشر لضمان الدقة والموثوقية.
                </p>
              </div>

              <div className="border-l-4 border-blue-600 pl-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  كيف يمكنني التواصل معكم؟
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  يمكنك التواصل معنا من خلال صفحة "اتصل بنا" أو عبر البريد الإلكتروني: <a href="mailto:sadaarabe@gmail.com" className="text-blue-600 hover:text-blue-800 font-semibold">sadaarabe@gmail.com</a>. نحن نرحب بملاحظاتكم واقتراحاتكم.
                </p>
              </div>

              <div className="border-l-4 border-blue-600 pl-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  هل يمكنني مشاركة مقالاتكم على وسائل التواصل الاجتماعي؟
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  نعم، يمكنك مشاركة مقالاتنا على جميع منصات التواصل الاجتماعي. نرحب بالمشاركة مع ذكر المصدر (صدى العرب) عند الاقتباس من مقالاتنا.
                </p>
              </div>

              <div className="border-l-4 border-blue-600 pl-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  كيف أجد مقالات في موضوع معين؟
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  يمكنك تصفح مقالاتنا حسب الفئات المتاحة على الموقع: سياسة، اقتصاد، رياضة، تكنولوجيا، ثقافة، وبيئة. استخدم قائمة التصنيفات في الصفحة الرئيسية أو في Navigation bar للوصول إلى المواضيع التي تهمك.
                </p>
              </div>

              <div className="border-l-4 border-blue-600 pl-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  ما هي سياسة الخصوصية الخاصة بكم؟
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  نحن نلتزم باحترام خصوصيتك. يمكنك قراءة سياسة الخصوصية الكاملة من خلال صفحة "سياسة الخصوصية" في Footer الموقع. نستخدم cookies فقط لتحسين تجربة المستخدم ولأغراض تحليلية.
                </p>
              </div>

              <div className="border-l-4 border-blue-600 pl-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  هل تقدمون خدمات الإعلان؟
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  نعم، نقدم خدمات الإعلان للشركات والمؤسسات المهتمة بالوصول إلى الجمهور العربي. للاستفسار عن خيارات الإعلان، يرجى التواصل معنا عبر البريد الإلكتروني: <a href="mailto:sadaarabe@gmail.com" className="text-blue-600 hover:text-blue-800 font-semibold">sadaarabe@gmail.com</a>.
                </p>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-600 mb-4">
                لم تجد إجابة لسؤالك؟
              </p>
              <a
                href="/contact"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                اتصل بنا
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

