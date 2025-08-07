import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const NeuralNetworkViz = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Neural network nodes
    const nodes = [
      { x: 50, y: 50, connections: [1, 2, 3] },
      { x: 150, y: 30, connections: [4, 5] },
      { x: 150, y: 70, connections: [4, 5] },
      { x: 150, y: 110, connections: [4, 5] },
      { x: 250, y: 50, connections: [6, 7] },
      { x: 250, y: 90, connections: [6, 7] },
      { x: 350, y: 50, connections: [8] },
      { x: 350, y: 90, connections: [8] },
      { x: 450, y: 70, connections: [] }
    ];

    // Animation variables
    let time = 0;
    const pulseData = [];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections
      nodes.forEach((node, i) => {
        node.connections.forEach(targetIndex => {
          const target = nodes[targetIndex];
          if (target) {
            ctx.strokeStyle = 'rgba(147, 51, 234, 0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(target.x, target.y);
            ctx.stroke();
            
            // Animated pulse along connection
            const pulse = Math.sin(time + i * 0.5) * 0.5 + 0.5;
            ctx.strokeStyle = `rgba(147, 51, 234, ${pulse * 0.7})`;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(target.x, target.y);
            ctx.stroke();
          }
        });
      });
      
      // Draw nodes
      nodes.forEach((node, i) => {
        const pulse = Math.sin(time + i) * 0.3 + 0.7;
        
        // Node glow
        ctx.fillStyle = `rgba(147, 51, 234, ${pulse * 0.3})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Node core
        ctx.fillStyle = `rgba(147, 51, 234, ${pulse})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
        ctx.fill();
      });
      
      time += 0.02; // Further reduced animation speed for maximum performance
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-xl"
        style={{ background: 'rgba(30, 33, 58, 0.5)' }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-2xl font-bold mb-2">Neural Network</div>
          <div className="text-sm text-gray-300">Real-time item matching</div>
        </div>
      </div>
    </div>
  );
};

export default NeuralNetworkViz; 