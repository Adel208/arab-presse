import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

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
              يعمل فريقنا من الصحفيين المحترفين والمراسلين والمحررين في مختلف أنحاء العالم العربي على تقديم أخبار يومية دقيقة ومحايدة. يتم اختيار فريقنا بعناية لضمان جودة المحتوى والتزامنا بالقيم الأخلاقية للصحافة.
            </p>
            <p className="mt-4">
              <strong>هيئة التحرير:</strong> فريق محررين متخصصين في مختلف المجالات (سياسة، اقتصاد، ثقافة، بيئة، تكنولوجيا، رياضة) يعملون على مراجعة وفحص جميع المقالات قبل النشر.
            </p>
            <p className="mt-4">
              <strong>المراسلون:</strong> شبكة من المراسلين الميدانيين المنتشرين في مختلف دول العالم العربي لتغطية الأحداث من مصادرها الأولية.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">تاريخنا</h2>
            <p>
              تأسس موقع <strong>صدى العرب</strong> بهدف سد فجوة في المشهد الإعلامي العربي، حيث نؤمن بأهمية تقديم أخبار موثوقة ومحايدة تخدم المصلحة العامة. بدأنا رحلتنا بحلم بسيط: أن نكون الصوت الذي يسمعه العالم العربي.
            </p>
            <p className="mt-4">
              على مر السنين، نما موقعنا ليشمل تغطية شاملة للأحداث في جميع أنحاء العالم العربي، مع التركيز على الأخبار التي تهم المواطن العربي في حياته اليومية وتؤثر على مستقبله.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">التقنيات المستخدمة</h2>
            <p>
              نستخدم أحدث التقنيات والذكاء الاصطناعي لدعم فريق التحرير في:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>جمع المعلومات من مصادر موثوقة</li>
              <li>صياغة المقالات الأولية</li>
              <li>التحقق من المعلومات</li>
              <li>تحسين تجربة القراءة</li>
            </ul>
            <p className="mt-4">
              بحسب ما هو موضح في <Link to="/terms" className="text-blue-600 hover:text-blue-700 underline">شروط الاستخدام</Link>، جميع المقالات تخضع لمراجعة بشرية دقيقة قبل النشر لضمان الدقة والجودة والالتزام بمعايير الصحافة الأخلاقية.
            </p>
            
            <div className="bg-blue-50 border-r-4 border-blue-600 p-6 rounded-lg mt-8">
              <h3 className="text-xl font-bold text-blue-900 mb-3">تواصل معنا</h3>
              <p className="text-blue-900 mb-2">
                نحن نرحب بتواصلك معنا في أي وقت. هل لديك اقتراحات أو استفسارات أو ترغب في الانضمام إلى فريقنا؟
              </p>
              <ul className="list-disc list-inside space-y-1 text-blue-900">
                <li><strong>البريد الإلكتروني العام:</strong> sadaarabe@gmail.com</li>
                <li><strong>البريد الإلكتروني للصحافة:</strong> sadaarabe@gmail.com</li>
                <li><strong>البريد الإلكتروني للتعاون:</strong> sadaarabe@gmail.com</li>
              </ul>
              <p className="mt-4 text-blue-900">
                يمكنك أيضاً زيارة صفحة <Link to="/contact" className="underline font-semibold">اتصل بنا</Link> لإرسال رسالة مباشرة.
              </p>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}

