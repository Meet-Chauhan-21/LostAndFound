import { useEffect, useRef, useState } from "react";
import { Search, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import api from "../utils/axiosConfig";

const HeroSection = ({ setResults, setNoResults, setIsSearching }) => {
  const [itemName, setItemName] = useState("");
  const inputRef = useRef(null);
  
  // Particle animation effect
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 4 + 1,
        speed: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.1,
        isStar: Math.random() > 0.8
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        y: particle.y <= -10 ? window.innerHeight + 10 : particle.y - particle.speed
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (itemName.trim().length > 0) {
        setIsSearching(true);
        api
          .get(`/lostAndFound/search?itemName=${itemName}`)
          .then((res) => {
            setResults(res.data);
            setNoResults(res.data.length === 0);
          })
          .catch((err) => {
            console.error("Search error:", err);
            setResults([]);
            setNoResults(true);
          });
      } else {
        setResults([]);
        setNoResults(false);
        setIsSearching(false);
      }
    }, 200); // Debounce delay

    return () => clearTimeout(delayDebounce);
  }, [itemName]);

  return (
    <section className="relative min-h-screen flex items-center justify-center py-12 md:py-20 bg-[#0c0e1d] overflow-hidden">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className={`absolute rounded-full ${
              particle.isStar 
                ? 'bg-white' 
                : 'bg-gradient-to-r from-purple-400 to-blue-400'
            }`}
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity
            }}
            animate={{
              y: [0, -window.innerHeight],
              opacity: [particle.opacity, 0]
            }}
            transition={{
              duration: 20 + particle.speed * 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Nebula Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-blue-900/10 to-transparent"></div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: 50, x: -50 }}
          whileInView={{ opacity: 1, y: 0, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: false, margin: "-100px" }}
          className="text-4xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent"
        >
          Reuniting Lost Items With Their Owners
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: false, margin: "-80px" }}
          className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8"
        >
          Join our community to help recover lost belongings through our intelligent matching platform
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          viewport={{ once: false, margin: "-50px" }}
          className="max-w-2xl mx-auto flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search lost or found items..."
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-white placeholder-gray-400 transition-all duration-300"
            />
          </div>
          <button
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <MapPin size={18} />
            <span>Near Me</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
