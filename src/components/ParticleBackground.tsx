import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleSystemProps {
  count?: number;
}

/**
 * Animated particle system component
 */
const ParticleSystem: React.FC<ParticleSystemProps> = ({ count = 3000 }) => {
  const meshRef = useRef<THREE.Points>(null);
  
  // Generate random positions for particles
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Create particles in a sphere distribution
      const radius = Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    
    return positions;
  }, [count]);

  // Animate particles with slow rotation
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        transparent
        color="#d6d3d1"
        size={2}
        sizeAttenuation={false}
        opacity={0.6}
      />
    </points>
  );
};

interface ParticleBackgroundProps {
  mouseParallax?: boolean;
}

/**
 * CSS-based particle background (fallback)
 */
const CSSParticleBackground: React.FC = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute bg-stone-300 rounded-full animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

/**
 * Three.js particle background with mouse parallax
 */
export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  mouseParallax = true
}) => {
  // Try Three.js first, fallback to CSS if error
  try {
    return (
      <div className="absolute inset-0 -z-10">
        <Canvas
          camera={{
            position: [0, 0, 1],
            fov: 75,
            near: 0.1,
            far: 1000,
          }}
          style={{
            background: 'transparent',
          }}
          gl={{
            alpha: true,
            antialias: true,
          }}
        >
          <ParticleSystem count={2000} />
          {mouseParallax && <MouseParallaxController />}
        </Canvas>
      </div>
    );
  } catch {
    return <CSSParticleBackground />;
  }
};

/**
 * Mouse parallax controller for interactive particle movement
 */
const MouseParallaxController: React.FC = () => {
  useFrame((state) => {
    const { mouse, camera } = state;
    
    // Subtle camera movement based on mouse position
    camera.position.x = mouse.x * 0.1;
    camera.position.y = mouse.y * 0.1;
    camera.lookAt(0, 0, 0);
  });

  return null;
};