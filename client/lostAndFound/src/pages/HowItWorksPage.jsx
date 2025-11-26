import { motion } from "framer-motion";
import { Search, Package, Smartphone, Mail, CheckCircle, Volume2, VolumeX, Play, Pause, Rocket, Users, Shield, Zap } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useRef, useState } from "react";
import video from '../assets/HowItsWork.mp4'

const HowItWorksPage = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  
  // Particle animation effect
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 40 }, (_, i) => ({
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
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          videoRef.current?.play();
          setIsPlaying(true);
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <div className="min-h-screen bg-[#0c0e1d] relative overflow-hidden">
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
      
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: false, margin: "-50px" }}
            className="inline-flex items-center gap-3 bg-[#1e213a]/50 border border-purple-500/30 rounded-full px-6 py-3 mb-8 backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Rocket className="w-5 h-5 text-purple-400" />
            </motion.div>
            <span className="text-purple-300 font-medium">
              Discover Our Process
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50, x: -50 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: false, margin: "-100px" }}
            className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent"
          >
            How Lost & Found Works
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: false, margin: "-80px" }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            A simple, effective way to reunite lost items with their owners through our advanced platform
          </motion.p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-orange-400 via-white to-orange-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: false, margin: "-50px" }}
          >
            Simple 3-Step Process
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 100, rotateY: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              whileHover={{ scale: 1.08, y: -10 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: false, margin: "-50px" }}
              className="bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-pink-600/20 p-8 rounded-xl shadow-2xl border-2 border-purple-500/30 backdrop-blur-sm relative overflow-hidden group"
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 animate-pulse"></div>
              
              {/* Glass shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
              </div>
              
              <div className="relative z-10 text-center">
                                 <motion.div 
                   className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-6 mx-auto border-2 border-purple-400/50 shadow-lg group"
                   whileHover={{ scale: 1.3, rotate: 360 }}
                   transition={{ duration: 0.6, ease: "easeOut" }}
                 >
                   <Search className="w-8 h-8 text-white group-hover:scale-125 transition-transform duration-300" />
                 </motion.div>
                                 <motion.h3 
                   className="text-xl font-bold mb-3 text-white group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:via-white group-hover:to-orange-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500"
                   whileHover={{ scale: 1.05 }}
                   transition={{ duration: 0.3 }}
                 >
                   <span className="relative">
                     1. Report Item
                     <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-white group-hover:w-full transition-all duration-500 ease-out"></span>
                   </span>
                 </motion.h3>
                <p className="text-gray-300">
                Report a lost or found item with details and photos to help with identification.
              </p>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              initial={{ opacity: 0, x: -100, rotateZ: -10 }}
              whileInView={{ opacity: 1, x: 0, rotateZ: 0 }}
              whileHover={{ scale: 1.08, y: -10 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              viewport={{ once: false, margin: "-50px" }}
              className="bg-gradient-to-br from-blue-600/20 via-cyan-600/20 to-purple-600/20 p-8 rounded-xl shadow-2xl border-2 border-blue-500/30 backdrop-blur-sm relative overflow-hidden group"
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-purple-500/10 animate-pulse"></div>
              
              {/* Glass shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
              </div>
              
              <div className="relative z-10 text-center">
                                 <motion.div 
                   className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-6 mx-auto border-2 border-blue-400/50 shadow-lg group"
                   whileHover={{ scale: 1.3, rotate: 360 }}
                   transition={{ duration: 0.6, ease: "easeOut" }}
                 >
                   <Smartphone className="w-8 h-8 text-white group-hover:scale-125 transition-transform duration-300" />
                 </motion.div>
                                 <motion.h3 
                   className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-all duration-500"
                   whileHover={{ scale: 1.05 }}
                   transition={{ duration: 0.3 }}
                 >
                   <span className="relative">
                     2. Smart Matching
                     <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-500 ease-out"></span>
                   </span>
                 </motion.h3>
                <p className="text-gray-300">
                Our system automatically matches lost reports with found items using AI technology.
              </p>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 100, rotateY: 15 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              whileHover={{ scale: 1.08, y: -10 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              viewport={{ once: false, margin: "-50px" }}
              className="bg-gradient-to-br from-pink-600/20 via-purple-600/20 to-blue-600/20 p-8 rounded-xl shadow-2xl border-2 border-pink-500/30 backdrop-blur-sm relative overflow-hidden group"
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 animate-pulse"></div>
              
              {/* Glass shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
              </div>
              
              <div className="relative z-10 text-center">
                                 <motion.div 
                   className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mb-6 mx-auto border-2 border-pink-400/50 shadow-lg group"
                   whileHover={{ scale: 1.3, rotate: 360 }}
                   transition={{ duration: 0.6, ease: "easeOut" }}
                 >
                   <CheckCircle className="w-8 h-8 text-white group-hover:scale-125 transition-transform duration-300" />
                 </motion.div>
                                 <motion.h3 
                   className="text-xl font-bold mb-3 text-white group-hover:text-pink-400 transition-all duration-500"
                   whileHover={{ scale: 1.05 }}
                   transition={{ duration: 0.3 }}
                 >
                   <span className="relative">
                     3. Reunite
                     <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-400 group-hover:w-full transition-all duration-500 ease-out"></span>
                   </span>
                 </motion.h3>
                <p className="text-gray-300">
                Get notified when there's a match and arrange for item return through our secure system.
              </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Detailed Workflow Section */}
      <section className="py-16 container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-orange-400 via-white to-orange-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: false, margin: "-50px" }}
          >
            Detailed Workflow Process
          </motion.h2>
          
          <div className="space-y-8">
            {[
              {
                icon: <Search className="w-6 h-6" />,
                title: "Report Item",
                description: "Submit details about lost or found items with photos and descriptions",
                color: "from-purple-500 to-blue-500",
                borderColor: "border-purple-400/50"
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "AI Processing",
                description: "Our advanced AI system analyzes and categorizes the item automatically",
                color: "from-blue-500 to-cyan-500",
                borderColor: "border-blue-400/50"
              },
              {
                icon: <Smartphone className="w-6 h-6" />,
                title: "Smart Matching",
                description: "Potential matches are automatically identified using machine learning",
                color: "from-cyan-500 to-green-500",
                borderColor: "border-cyan-400/50"
              },
              {
                icon: <Mail className="w-6 h-6" />,
                title: "Notification",
                description: "Both parties are alerted about the match through secure notifications",
                color: "from-green-500 to-yellow-500",
                borderColor: "border-green-400/50"
              },
              {
                icon: <CheckCircle className="w-6 h-6" />,
                title: "Reunion",
                description: "Items are securely returned to owners with verification process",
                color: "from-yellow-500 to-pink-500",
                borderColor: "border-yellow-400/50"
              }
            ].map((step, index) => (
              <div 
                key={index}
                className="flex flex-col md:flex-row items-start md:items-center gap-6"
              >
                {/* Step number and icon */}
                <div className="flex items-center mb-4 md:mb-0">
                  <motion.div 
                    className={`flex-shrink-0 w-16 h-16 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mr-6 border-2 ${step.borderColor} shadow-lg`}
                    whileHover={{ 
                      scale: 1.2, 
                      rotate: 360,
                      boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)"
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <motion.div 
                      className="text-white"
                      whileHover={{ scale: 1.3 }}
                      transition={{ duration: 0.3 }}
                    >
                      {step.icon}
                    </motion.div>
                  </motion.div>
                  {/* Mobile line */}
                  <div className="md:hidden w-1 h-8 bg-gradient-to-b from-purple-400 to-blue-400 ml-5" />
                </div>
                
                {/* Content */}
                <div className="md:pl-4 flex-1">
                  <motion.div 
                    className="bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-pink-600/20 p-6 rounded-xl border-2 border-purple-500/30 backdrop-blur-sm shadow-2xl relative overflow-hidden group"
                    whileHover={{ 
                      scale: 1.05, 
                      rotateY: 5,
                      boxShadow: "0 25px 50px rgba(16, 185, 129, 0.3), 0 0 30px rgba(251, 146, 60, 0.2)"
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    {/* Floating particles effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <motion.div 
                        className="absolute top-2 left-2 w-2 h-2 bg-emerald-400 rounded-full"
                        animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div 
                        className="absolute top-4 right-4 w-1.5 h-1.5 bg-orange-400 rounded-full"
                        animate={{ y: [0, -8, 0], opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      />
                      <motion.div 
                        className="absolute bottom-3 left-4 w-1 h-1 bg-rose-400 rounded-full"
                        animate={{ y: [0, -6, 0], opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      />
                      <motion.div 
                        className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-violet-400 rounded-full"
                        animate={{ y: [0, -12, 0], opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                      />
                    </div>
                    
                    {/* Glowing border effect */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500 via-orange-500 via-rose-500 to-violet-500 bg-[length:200%_100%] animate-[border-walk_2s_linear_infinite]"></div>
                      <div className="absolute inset-[2px] rounded-xl bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-pink-600/20 backdrop-blur-sm"></div>
                    </div>
                    
                    {/* Text content with high z-index to stay on top */}
                    <div className="relative z-20">
                      <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">
                        {step.title}
                      </h3>
                      <p className="text-gray-300 drop-shadow-lg">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 container mx-auto px-4 relative z-10">
        <motion.h2 
          className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-orange-400 via-white to-orange-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: false, margin: "-50px" }}
        >
          See It In Action
        </motion.h2>
        
        <motion.div 
          className="relative aspect-w-16 aspect-h-9 w-full max-w-6xl mx-auto bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl overflow-hidden shadow-2xl border-2 border-purple-500/30 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.8, y: 100, rotateZ: -5 }}
          whileInView={{ opacity: 1, scale: 1, y: 0, rotateZ: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: false, margin: "-100px" }}
        >
            {/* Video Element */}
            <video
            src={video}
              ref={videoRef}
              className="w-full h-full object-cover"
              loop
              muted
              playsInline
            >
              Your browser does not support the video tag.
            </video>
            
            {/* Video Controls */}
            <div className="absolute bottom-4 right-4 flex space-x-2">
            <motion.button 
                onClick={toggleMute}
              className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </motion.button>
            <motion.button 
                onClick={togglePlay}
              className="p-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full text-white hover:from-pink-700 hover:to-purple-700 transition-all shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </motion.button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorksPage;