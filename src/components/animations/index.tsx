import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ScrollProgressProps {
  className?: string;
}

/**
 * Scroll progress indicator component
 */
export const ScrollProgress: React.FC<ScrollProgressProps> = ({ className = '' }) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / docHeight;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <motion.div
      className={`fixed top-0 left-0 h-1 bg-gradient-to-r from-vintage-gold to-vintage-gold/60 z-50 ${className}`}
      style={{ 
        width: `${scrollProgress * 100}%`,
        transformOrigin: '0%',
      }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: scrollProgress }}
      transition={{ duration: 0.1, ease: 'easeOut' }}
    />
  );
};

interface FloatingElementProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Floating animation wrapper component
 */
export const FloatingElement: React.FC<FloatingElementProps> = ({ 
  children, 
  delay = 0,
  className = ''
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-10, 10, -10],
        rotate: [-2, 2, -2],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
};

interface ParallaxElementProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}

/**
 * Parallax scroll effect component
 */
export const ParallaxElement: React.FC<ParallaxElementProps> = ({
  children,
  offset = 50,
  className = ''
}) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const updateScrollY = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', updateScrollY);
    return () => window.removeEventListener('scroll', updateScrollY);
  }, []);

  return (
    <motion.div
      className={className}
      style={{
        transform: `translateY(${scrollY * (offset / 100)}px)`,
      }}
    >
      {children}
    </motion.div>
  );
};

interface RevealOnScrollProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  className?: string;
}

/**
 * Reveal animation on scroll component
 */
export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  direction = 'up',
  delay = 0,
  className = ''
}) => {
  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: 40 },
    right: { y: 0, x: -40 },
  };

  return (
    <motion.div
      className={className}
      initial={{ 
        opacity: 0,
        ...directions[direction]
      }}
      whileInView={{ 
        opacity: 1,
        y: 0,
        x: 0
      }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.8,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      {children}
    </motion.div>
  );
};

interface HoverEffectProps {
  children: React.ReactNode;
  scale?: number;
  glow?: boolean;
  className?: string;
}

/**
 * Interactive hover effects component
 */
export const HoverEffect: React.FC<HoverEffectProps> = ({
  children,
  scale = 1.05,
  glow = false,
  className = ''
}) => {
  return (
    <motion.div
      className={`${className} ${glow ? 'hover:drop-shadow-lg' : ''}`}
      whileHover={{ 
        scale,
        filter: glow ? 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.3))' : undefined,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}
    >
      {children}
    </motion.div>
  );
};