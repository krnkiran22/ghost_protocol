import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points as ThreePoints, PointsMaterial, BufferGeometry, BufferAttribute } from 'three';
import * as THREE from 'three';

interface ParticleSystemProps {
  count?: number;
}

/**
 * Animated particle system component
 */
const ParticleSystem: React.FC<ParticleSystemProps> = ({ count = 5000 }) => {
  const ref = useRef<Points>(null);
  
  // Generate random sphere positions
  const [sphere] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    random.inSphere(positions, { radius: 1.5 });
    return [positions];
  }, [count]);

  // Animate particles
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#d6d3d1"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

interface ParticleBackgroundProps {
  mouseParallax?: boolean;
}

/**
 * Three.js particle background with mouse parallax
 */
export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  mouseParallax = true
}) => {
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
        <ParticleSystem count={3000} />
        {mouseParallax && <MouseParallaxController />}
      </Canvas>
    </div>
  );
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