
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { socialLinks } from '@/lib/data';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message sent!",
      description: "Thank you for your message. I'll get back to you soon.",
    });
    
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    
    setIsSubmitting(false);
  };

  return (
    <section className="container-custom py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl font-display font-bold mb-4">Get In Touch</h2>
          <p className="text-gray-600 mb-6">
            Have a question or want to collaborate? Feel free to send me a message and I'll get back to you as soon as possible.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="How can I help you?"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Your message"
                rows={6}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full md:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </div>
        
        <div className="lg:pl-8">
          <div className="bg-gray-50 p-8 rounded-lg h-full">
            <h3 className="text-xl font-display font-semibold mb-6">Connect With Me</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm uppercase font-semibold text-gray-500 mb-3">Email</h4>
                <a href="mailto:contact@anasobeidat.com" className="text-primary hover:underline">
                  contact@anasobeidat.com
                </a>
              </div>
              
              <div>
                <h4 className="text-sm uppercase font-semibold text-gray-500 mb-3">Follow Me</h4>
                <div className="flex space-x-4">
                  {socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:border-primary hover:text-primary transition-colors"
                    >
                      {link.name.charAt(0)}
                    </a>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm uppercase font-semibold text-gray-500 mb-3">Location</h4>
                <p className="text-gray-600">
                  Amman, Jordan
                </p>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <p className="text-gray-600">
                  Looking for Arabic programming resources or want to collaborate on a project? 
                  <span className="block mt-1 text-primary font-medium">Let's connect!</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
