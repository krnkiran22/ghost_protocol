import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Dna, 
  Infinity, 
  Sword,
  Github,
  Twitter,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui';
import { animations } from '@/lib/design-system';

/**
 * Main Landing Page Component
 */
export const LandingPage: React.FC = () => {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ProblemStatementSection />
      <SolutionCardsSection />
      <StatsSection />
      <TimelineSection />
      <Footer />
    </main>
  );
};

/**
 * Hero Section Component
 */
const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background-primary to-background-secondary">
      {/* Animated Background - Particle System Placeholder */}
      <div className="absolute inset-0 opacity-30">
        <ParticleBackground />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
        <motion.h1
          initial={animations.slideUp.initial}
          animate={animations.slideUp.animate}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-display-lg font-bold tracking-tight text-stone-900 mb-6"
        >
          YOUR IP SHOULD OUTLIVE YOU
        </motion.h1>

        <motion.p
          initial={animations.slideUp.initial}
          animate={animations.slideUp.animate}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          className="text-xl text-stone-600 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          The first blockchain protocol that pays creators forever—even after death. 
          Powered by Story Protocol.
        </motion.p>

        <motion.div
          initial={animations.slideUp.initial}
          animate={animations.slideUp.animate}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            variant="primary"
            size="lg"
            iconRight={<ArrowRight className="h-5 w-5" />}
            className="min-w-48"
            onClick={() => navigate('/register')}
          >
            Resurrect an IP
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="min-w-48"
          >
            Explore the Graph
          </Button>

          <button className="text-stone-600 hover:text-stone-900 underline-offset-4 hover:underline transition-colors duration-200">
            Read the Manifesto →
          </button>
        </motion.div>
      </div>
    </section>
  );
};

/**
 * Problem Statement Section
 */
const ProblemStatementSection: React.FC = () => {
  const problems = [
    {
      name: "Bram Stoker",
      lifespan: "1847-1912",
      stat: "$0 earned from modern content",
      description: "His estate received nothing while his vampire generated $7 billion",
      image: "/api/placeholder/300/300" // Placeholder for portrait
    },
    {
      name: "His vampire made",
      stat: "$7,000,000,000+",
      description: "in derivatives across movies, games, books, and media",
      image: "/api/placeholder/300/300" // Placeholder for movie grid
    },
    {
      name: "His estate got",
      stat: "0.000%",
      description: "royalty share from billion-dollar franchises built on his work",
      image: "/api/placeholder/300/300" // Placeholder for empty wallet
    }
  ];

  return (
    <section className="py-32 bg-background-secondary">
      <div className="max-w-7xl mx-auto px-8">
        <motion.h2
          initial={animations.fadeIn.initial}
          whileInView={animations.fadeIn.animate}
          viewport={{ once: true, margin: "-100px" }}
          className="text-display-sm font-bold text-stone-900 text-center mb-16"
        >
          The Broken IP Economy
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={animations.slideUp.initial}
              whileInView={animations.slideUp.animate}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="text-center"
            >
              <div className="aspect-square bg-stone-200 rounded-xl mb-6 overflow-hidden">
                <img 
                  src={problem.image} 
                  alt={problem.name}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <h3 className="text-4xl font-bold text-stone-900 mb-2">
                {problem.stat}
              </h3>
              <p className="text-lg text-stone-600 leading-relaxed">
                {problem.description}
              </p>
              <div className="w-full h-px bg-stone-300 mt-6"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * Solution Cards Section
 */
const SolutionCardsSection: React.FC = () => {
  const solutions = [
    {
      icon: <Sparkles className="h-12 w-12" />,
      title: "Resurrect Historical IP",
      description: "Bring deceased creators' works onto the blockchain with estate verification and Ghost Wallets that pay beneficiaries forever."
    },
    {
      icon: <Dna className="h-12 w-12" />,
      title: "Trace Creative DNA",
      description: "AI-powered influence detection maps how ideas flow through time, ensuring original creators get credit for inspiring future works."
    },
    {
      icon: <Infinity className="h-12 w-12" />,
      title: "Eternal Royalties",
      description: "Smart contracts automatically distribute payments to estates, descendants, and chosen beneficiaries across generations."
    },
    {
      icon: <Sword className="h-12 w-12" />,
      title: "Plagiarism Guillotine",
      description: "Advanced detection algorithms identify unauthorized derivatives and automatically claim royalties for original creators."
    }
  ];

  return (
    <section className="py-32 bg-background-primary">
      <div className="max-w-7xl mx-auto px-8">
        <motion.h2
          initial={animations.fadeIn.initial}
          whileInView={animations.fadeIn.animate}
          viewport={{ once: true }}
          className="text-display-sm font-bold text-stone-900 text-center mb-16"
        >
          How Ghost Protocol Works
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={animations.slideUp.initial}
              whileInView={animations.slideUp.animate}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group p-8 bg-white border border-stone-200 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className="text-accent-gold mb-4 group-hover:scale-110 transition-transform duration-300">
                {solution.icon}
              </div>
              <h3 className="text-2xl font-semibold text-stone-900 mb-4">
                {solution.title}
              </h3>
              <p className="text-base text-stone-600 leading-relaxed mb-6">
                {solution.description}
              </p>
              <button className="text-stone-700 hover:text-accent-gold transition-colors duration-200 flex items-center gap-2">
                Learn more <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * Stats Section
 */
const StatsSection: React.FC = () => {
  const stats = [
    { number: "2.4M+", label: "IP Assets Registered" },
    { number: "$18.7M+", label: "Royalties Distributed" },
    { number: "847", label: "Dead Creators Revived" },
    { number: "99.2%", label: "Plagiarism Detection Rate" }
  ];

  return (
    <section className="py-24 bg-stone-900">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="text-center"
            >
              <div className="text-6xl font-bold text-white text-accent-gold mb-2 shadow-ghost-glow">
                <AnimatedCounter end={parseFloat(stat.number.replace(/[^0-9.]/g, ''))} />
                {stat.number.replace(/[0-9.]/g, '')}
              </div>
              <p className="text-sm text-stone-400 uppercase tracking-wide">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * Timeline Section
 */
const TimelineSection: React.FC = () => {
  const steps = [
    {
      title: "Register Your IP",
      description: "Upload your creative work and verify ownership through our secure blockchain registration system."
    },
    {
      title: "AI Analysis & Mapping", 
      description: "Our AI analyzes your work's influences and maps its place in the creative DNA graph."
    },
    {
      title: "Smart Contract Creation",
      description: "Automated contracts handle licensing, royalty distribution, and plagiarism detection."
    },
    {
      title: "Eternal Protection",
      description: "Your IP continues earning royalties forever, even after death, through Ghost Wallets."
    }
  ];

  return (
    <section className="py-32 bg-background-secondary">
      <div className="max-w-4xl mx-auto px-8">
        <motion.h2
          initial={animations.fadeIn.initial}
          whileInView={animations.fadeIn.animate}
          viewport={{ once: true }}
          className="text-display-sm font-bold text-stone-900 text-center mb-16"
        >
          How It Works
        </motion.h2>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-stone-300"></div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={animations.slideInLeft.initial}
              whileInView={animations.slideInLeft.animate}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="relative flex items-start mb-12 last:mb-0"
            >
              {/* Step Circle */}
              <div className="relative  z-10 w-12 h-12 bg-accent-gold rounded-full shadow-lg flex items-center justify-center text-white font-bold text-lg mr-8">
                {index + 1}
              </div>

              {/* Content Card */}
              <div className="flex-1 bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-stone-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-base text-stone-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * Footer Component
 */
const Footer: React.FC = () => {
  const footerSections = [
    {
      title: "Product",
      links: ["Resurrect an IP", "Explore Graph", "AI Studio", "Marketplace"]
    },
    {
      title: "Resources", 
      links: ["Documentation", "GitHub", "Story Protocol", "Hackathon Submission"]
    },
    {
      title: "Community",
      links: ["Twitter", "Discord", "GitHub", "Blog"]
    }
  ];

  return (
    <footer className="bg-stone-900 pt-16 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <h3 className="text-2xl text-white font-bold text-accent-gold mb-4">
              👻 Ghost Protocol
            </h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              The first blockchain protocol that pays creators forever—even after death.
            </p>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="text-base font-semibold text-stone-300 mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <button className="text-sm text-stone-400 hover:text-accent-gold transition-colors duration-200">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-stone-800">
          <p className="text-sm text-stone-500 mb-4 md:mb-0">
            © 2024 Ghost Protocol. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <span className="text-sm text-stone-500">
              Powered by{' '}
              <span className="text-accent-gold hover:underline cursor-pointer">
                Story Protocol
              </span>
            </span>
            
            <div className="flex gap-4">
              <Twitter className="h-5 w-5 text-stone-400 hover:text-accent-gold cursor-pointer transition-colors duration-200" />
              <MessageCircle className="h-5 w-5 text-stone-400 hover:text-accent-gold cursor-pointer transition-colors duration-200" />
              <Github className="h-5 w-5 text-stone-400 hover:text-accent-gold cursor-pointer transition-colors duration-200" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

/**
 * Placeholder Particle Background Component
 * TODO: Implement with Three.js
 */
const ParticleBackground: React.FC = () => {
  return (
    <div className="absolute inset-0">
      {/* Animated dots */}
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-stone-300 rounded-full"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 2,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
};

/**
 * Animated Counter Component
 */
const AnimatedCounter: React.FC<{ end: number; duration?: number }> = ({ 
  end, 
  duration = 2 
}) => {
  const [count, setCount] = React.useState(0);
  const [hasAnimated, setHasAnimated] = React.useState(false);

  React.useEffect(() => {
    if (hasAnimated) return;
    
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (startTime === undefined) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / (duration * 1000), 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setHasAnimated(true);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          animationFrame = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById(`counter-${end}`);
    if (element) observer.observe(element);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, [end, duration, hasAnimated]);

  return <span id={`counter-${end}`}>{count.toFixed(1)}</span>;
};