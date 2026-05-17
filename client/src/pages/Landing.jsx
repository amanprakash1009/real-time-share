import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import Testimonials from '../components/landing/Testimonials';
import CTASection from '../components/landing/CTASection';

/**
 * Landing — main marketing page assembled from section components.
 */
const Landing = () => {
  return (
    <div className="min-h-screen bg-[#060912]">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
