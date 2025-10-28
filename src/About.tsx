import { Helmet } from 'react-helmet-async';

export default function About() {
  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-gray-50 py-12">
      <Helmet>
        <title>من نحن - صدى العرب</title>
        <meta name="description" content="تعرف على صحيفة صدى العرب: رسالتنا، رؤيتنا، وقيمنا في تقديم الأخبار والتحليلات الموثوقة" />
      </Helmet>
      
      <main className="max-w-4xl mx-auto px-6">
        <article className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8">من نحن</h1>
          
          <div className="prose prose-lg max-w-none space-y-6 text-gray-700 leading-relaxed">
            <p className="text-lg">
              <strong>صدى العرب</strong> هي بوابة إخبارية عربية مستقلة تلتزم بتقديم الأخبار والتحليلات الموثوقة والدقيقة لجميع القراء في العالم العربي وخارجه.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">رؤيتنا</h2>
            <p>
              نسعى لأن نكون المصدر الأكثر موثوقية للأخبار والتحليلات العميقة في العالم العربي، عبر تغطية شاملة للأحداث السياسية والاقتصادية والثقافية والبيئية والرياضية والتكنولوجية.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">مهمتنا</h2>
            <p>
              تقديم محتوى إخباري عالي الجودة باللغة العربية، مع التركيز على:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>الموضوعية والحياد في نقل الأخبار</li>
              <li>التحليل المتعمق للأحداث الجارية</li>
              <li>التغطية الشاملة للقضايا العربية والعالمية</li>
              <li>احترام حقوق الإنسان والديمقراطية</li>
              <li>توفير منصة مفتوحة للحوار البناء</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">قيمنا</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>الشفافية:</strong> نلتزم بالشفافية في مصادرنا وطرق عملنا</li>
              <li><strong>الاستقلالية:</strong> نعمل بشكل مستقل دون تأثيرات خارجية</li>
              <li><strong>الدقة:</strong> نتحقق من جميع المعلومات قبل نشرها</li>
              <li><strong>الانتماء:</strong> نحن جزء من المجتمع العربي ونهتم بقضاياه</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">فريقنا</h2>
            <p>
              يعمل فريقنا من الصحفيين المحترفين والمراسلين والمحررين في مختلف أنحاء العالم العربي على تقديم أخبار يومية دقيقة ومحايدة.
            </p>
            
            <div className="bg-blue-50 border-r-4 border-blue-600 p-6 rounded-lg mt-8">
              <p className="font-semibold text-blue-900">
                هل لديك اقتراحات أو استفسارات؟ نحن نرحب بتواصلك معنا.
              </p>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}

