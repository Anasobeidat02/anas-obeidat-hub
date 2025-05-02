
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ContactForm from '@/components/contact/ContactForm';

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Hero section */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-12 mb-8">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
                Let's <span className="text-gradient">Connect</span>
              </h1>
              <p className="text-lg text-gray-600">
                Have a question or want to work together? Reach out using the form below.
              </p>
            </div>
          </div>
        </section>
        
        <ContactForm />
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
