import { useState, useEffect } from 'react';

export const useParticleSystem = (particleCount = 100) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 6 + 2,
        speed: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        isStar: Math.random() > 0.7,
        isMeteor: Math.random() > 0.9,
        trail: [],
        color: Math.random() > 0.5 ? 'purple' : 'blue'
      }));
      setParticles(newParticles);
    };

    generateParticles();
    
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => {
        const newY = particle.y <= -10 ? window.innerHeight + 10 : particle.y - particle.speed;
        
        return {
          ...particle,
          y: newY
        };
      }));
    }, 200); // Further reduced update frequency for maximum performance

    return () => clearInterval(interval);
  }, [particleCount]);

  return particles;
}; 