
import { skills } from '@/lib/data';
import { Badge } from '@/components/ui/badge';

const SkillsSection = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container-custom">
        <h2 className="text-3xl font-display font-bold mb-10">Technical Skills</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skills.map((skillGroup, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-sm"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h3 className="font-display font-semibold text-xl mb-4 text-primary">{skillGroup.category}</h3>
              <div className="flex flex-wrap gap-2">
                {skillGroup.technologies.map((tech, i) => (
                  <Badge 
                    key={i} 
                    variant="outline" 
                    className="bg-blue-50 text-primary border-blue-100 py-1 px-3"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-display font-semibold text-xl mb-2">Clean Code</h3>
            <p className="text-gray-600">I write maintainable, well-documented code following best practices and design patterns.</p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
              </svg>
            </div>
            <h3 className="font-display font-semibold text-xl mb-2">Problem Solving</h3>
            <p className="text-gray-600">I approach complex problems with a structured methodology and creative solutions.</p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-display font-semibold text-xl mb-2">Continuous Learning</h3>
            <p className="text-gray-600">I stay updated with the latest technologies and industry best practices.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
