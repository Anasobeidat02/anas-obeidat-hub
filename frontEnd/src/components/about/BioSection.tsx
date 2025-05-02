
const BioSection = () => {
  return (
    <section className="container-custom py-12">
      <h2 className="text-3xl font-display font-bold mb-6">About Me</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="prose max-w-none">
            <p className="mb-4">
              مرحبًا! أنا أنس عبيدات، مطور ويب متكامل (Full Stack Developer) شغوف بإنشاء تجارب رقمية استثنائية ومشاركة معرفتي مع المجتمع العربي.
            </p>
            
            <p className="mb-4">
              بدأت رحلتي في عالم البرمجة منذ عدة سنوات، وتخصصت في تطوير تطبيقات الويب باستخدام أحدث التقنيات مثل React.js و Node.js وقواعد البيانات المختلفة. أعمل حاليًا على إنشاء محتوى تعليمي على منصة YouTube لمساعدة المبرمجين الناطقين بالعربية على تعلم أساسيات ومتقدمات تطوير الويب.
            </p>
            
            <p className="mb-4">
              أؤمن بقوة التعليم المستمر والمشاركة المجتمعية، وأسعى دائمًا لتبسيط المفاهيم المعقدة وجعل عالم البرمجة أكثر سهولة للمبتدئين والمتوسطين.
            </p>
            
            <p>
              خارج عالم البرمجة، أحب القراءة والسفر واستكشاف تقنيات جديدة. أسعى دائمًا للتواصل مع المطورين الآخرين وتبادل الأفكار والخبرات، فلا تتردد في التواصل معي!
            </p>
          </div>
          
          <div className="mt-8">
            <h3 className="text-xl font-display font-semibold mb-4">My Journey</h3>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">2023</span>
                </div>
                <div>
                  <h4 className="font-semibold">Started Educational YouTube Channel</h4>
                  <p className="text-gray-600">Launched programming tutorials for Arabic speakers</p>
                </div>
              </li>
              
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">2022</span>
                </div>
                <div>
                  <h4 className="font-semibold">Senior Full Stack Developer</h4>
                  <p className="text-gray-600">Worked on enterprise applications using modern frameworks</p>
                </div>
              </li>
              
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">2020</span>
                </div>
                <div>
                  <h4 className="font-semibold">Computer Science Degree</h4>
                  <p className="text-gray-600">Graduated with honors in Computer Science</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative shadow-lg">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="block text-2xl font-display font-bold mb-2">Anas Obeidat</span>
                <span className="block text-gray-600">Full Stack Developer</span>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-blue-400/10"></div>
          </div>
          
          <div className="mt-6 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-display font-semibold mb-3">Quick Facts</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">Amman, Jordan</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Experience:</span>
                <span className="font-medium">5+ years</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Focus:</span>
                <span className="font-medium">Web Development, Education</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Languages:</span>
                <span className="font-medium">Arabic, English</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BioSection;
