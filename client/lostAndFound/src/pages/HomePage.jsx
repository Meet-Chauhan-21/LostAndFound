import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin, Search, Heart, Eye, Star, Phone, Mail, ChevronRight, Package, FileText, Smartphone, PawPrint, Facebook, Twitter, Instagram, Linkedin, Github, UserPlus, Upload, MessageCircle, X } from "lucide-react";
import Navbar from "../components/Navbar";
import LostAndFoundCards from "../components/LostAndFoundCards";
import RecentPosts from "../components/RecentPosts";
import CategoryStats from "../components/CategoryStats";
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";
import DefaultImage from "../assets/Lost_And_Found.png";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";

// Typewriter Component
const TypewriterText = ({ text, className, onComplete }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 80);
      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, onComplete]);

  return (
    <span className={className}>
      {displayText}
      {currentIndex < text.length && (
        <span className="inline-block w-1 h-8 bg-blue-400 ml-1 animate-pulse" />
      )}
    </span>
  );
};

// Ripple Button Component
const RippleButton = ({ children, className, onClick, ...props }) => {
  const [ripples, setRipples] = useState([]);
  const rippleId = useRef(0);

  const addRipple = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newRipple = { x, y, id: rippleId.current++ };
    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 600);

    if (onClick) onClick(event);
  };

  return (
    <button
      className={`relative overflow-hidden focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 focus:outline-none ${className}`}
      onClick={addRipple}
      {...props}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white opacity-30 animate-ping pointer-events-none"
          style={{
            left: ripple.x - 20,
            top: ripple.y - 20,
            width: 40,
            height: 40,
          }}
        />
      ))}
    </button>
  );
};

// Search Suggestion Component
const SearchSuggestion = ({ suggestion, onSelect }) => (
  <button
    className="w-full text-left px-4 py-3 hover:bg-slate-800 transition-colors text-sm text-slate-300 hover:text-white focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-inset"
    onClick={() => onSelect(suggestion)}
    role="option"
    aria-label={`Search for ${suggestion}`}
  >
    <Search className="inline w-4 h-4 mr-3 text-slate-500" aria-hidden="true" />
    {suggestion}
  </button>
);

const HomePage = () => {
  const [results, setResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [heroAnimationComplete, setHeroAnimationComplete] = useState(false);
  const navigate = useNavigate();

  // Add CSS animation for gradient shift
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

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

  const searchSuggestions = [
    "black wallet near downtown",
    "iPhone 15 Pro lost at mall",
    "blue backpack with laptop",
    "golden retriever puppy",
    "car keys with BMW keychain",
  ];

  // Search functionality
  const handleSearch = () => {
    if (searchValue.trim().length > 0) {
      setIsSearching(true);
      api
        .get(`/lostAndFound/search?itemName=${searchValue}`)
        .then((res) => {
          setResults(res.data);
          setNoResults(res.data.length === 0);
          setIsSearching(false);
        })
        .catch((err) => {
          console.error("Search error:", err);
          setResults([]);
          setNoResults(true);
          setIsSearching(false);
        });
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchValue.trim().length > 0) {
        setIsSearching(true);
        api
          .get(`/lostAndFound/search?itemName=${searchValue}`)
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
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [searchValue]);

  return (
    <div className="min-h-screen bg-[#0c0e1d] text-white relative overflow-hidden">
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

      <main className="relative z-10 overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center py-12 md:py-20">
          <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-16 leading-tight"
            >
              {/* First Line: "Reuniting Lost Items" */}
              <div className="flex flex-wrap justify-center items-center gap-4 mb-4">
                <motion.span 
                  className="text-white inline-block"
                  initial={{ opacity: 0, x: -200, rotateY: -180, scale: 0.3 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
                  transition={{ 
                    duration: 1.2, 
                    ease: [0.25, 0.46, 0.45, 0.94],
                    delay: 0.2
                  }}
                >
                  Reuniting
                </motion.span>
                
                <motion.span 
                  className="inline-block relative"
                  initial={{ opacity: 0, y: 100, scale: 0.3, rotateZ: -15 }}
                  animate={{ opacity: 1, y: 0, scale: 1, rotateZ: 0 }}
                  transition={{ 
                    duration: 1.4, 
                    ease: [0.68, -0.55, 0.265, 1.55],
                    delay: 0.6
                  }}
                  style={{
                    background: 'linear-gradient(-45deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)',
                    backgroundSize: '300% 300%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'gradientShift 3s ease-in-out infinite'
                  }}
                >
                  Lost Items
                </motion.span>
              </div>

              {/* Second Line: "With Their Owners" */}
              <div className="flex flex-wrap justify-center items-center gap-4">
                <motion.span 
                  className="text-white inline-block"
                  initial={{ opacity: 0, x: 200, rotateY: 180, scale: 0.3 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
                  transition={{ 
                    duration: 1.2, 
                    ease: [0.25, 0.46, 0.45, 0.94],
                    delay: 1.0
                  }}
                >
                  With
                </motion.span>
                
                <motion.span 
                  className="inline-block relative"
                  initial={{ opacity: 0, y: -100, scale: 0.3, rotateZ: 15 }}
                  animate={{ opacity: 1, y: 0, scale: 1, rotateZ: 0 }}
                  transition={{ 
                    duration: 1.4, 
                    ease: [0.68, -0.55, 0.265, 1.55],
                    delay: 1.4
                  }}
                  style={{
                    background: 'linear-gradient(-45deg, #fbbf24, #f97316, #ef4444, #fbbf24)',
                    backgroundSize: '300% 300%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'gradientShift 3s ease-in-out infinite 1.5s'
                  }}
                >
                  Their Owners
                </motion.span>
              </div>

              {/* Floating particles around the text */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 2 }}
              >
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${30 + (i % 2) * 40}%`
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0.3, 1, 0.3],
                      scale: [0.5, 1.2, 0.5]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </motion.div>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-lg md:text-xl lg:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              Join thousands of people helping each other recover lost belongings through our intelligent matching platform powered by community care.
            </motion.p>

            {/* Search Bar Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="w-full max-w-4xl mx-auto mb-8"
            >
              {/* Search Container */}
              <div className="relative bg-slate-800/60 backdrop-blur-md rounded-3xl p-2 border border-slate-700/50 shadow-2xl">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  {/* Search Input */}
                  <div className="flex-1 relative w-full">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search for lost or found items..."
                        value={searchValue}
                        onChange={(e) => {
                          setSearchValue(e.target.value);
                        }}
                        onFocus={() => {}}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && searchValue.trim()) {
                            handleSearch();
                          }
                        }}
                        className="w-full px-6 py-4 pl-14 pr-4 text-lg bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 focus:outline-none transition-all duration-300 text-white placeholder-slate-400"
                      />
                      <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    </div>
                  </div>

                  {/* Search Button */}
                  <button
                    onClick={handleSearch}
                    disabled={!searchValue.trim()}
                    className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 text-lg font-medium text-white shadow-lg hover:shadow-xl disabled:shadow-none"
                  >
                    <Search className="w-5 h-5" />
                    Search
                  </button>

                  {/* Near Me Button */}
                  <button className="w-full md:w-auto px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 text-lg font-medium text-white shadow-lg hover:shadow-xl">
                    <MapPin className="w-5 h-5" />
                    Near Me
                  </button>

                  {/* Clear Button */}
                  {searchValue && (
                    <button
                      onClick={() => {
                        setSearchValue("");
                        setShowSuggestions(false);
                      }}
                      className="w-full md:w-auto px-4 py-4 bg-slate-700/50 hover:bg-slate-600/50 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 text-slate-300 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Search Results Section */}
            {(results.length > 0 || (searchValue.trim() && results.length === 0)) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-6xl mx-auto"
              >
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                >
                  Search Results
                </motion.h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {results.length > 0 ? (
                    results.map((post, index) => (
      <motion.div
        key={post._id || post.id}
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        whileHover={{ 
                          scale: 1.05, 
                          y: -10,
                          boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.6)"
                        }}
                        className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-slate-700/50 group cursor-pointer hover:border-blue-500/50 hover:shadow-2xl"
      >
        {/* Image */}
                        <div className="h-32 overflow-hidden">
          <img
            src={post.itemPhoto || DefaultImage}
            alt={post.itemName || "Lost or Found item"}
                            className="w-full h-full object-cover transition-all duration-300 ease-out group-hover:scale-110"
          />
        </div>

        {/* Content */}
                        <div className="p-3 flex flex-col justify-between h-[120px]">
          <div>
            {/* Title & Type */}
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-base text-white line-clamp-1">
                {post.itemName}
              </h3>
              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  post.itemType === "lost"
                                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                    : "bg-green-500/20 text-green-400 border border-green-500/30"
                }`}
              >
                {post.itemType?.toUpperCase() || "UNKNOWN"}
              </span>
            </div>

            {/* Location */}
                            <div className="flex items-center text-slate-400 text-xs mb-2">
                              <MapPin className="w-3 h-3 mr-1" />
              {post.itemLocation}
            </div>
          </div>

          {/* Button */}
          <button
                            onClick={() => {
                console.log("🧩 post object:", post);
                console.log("🧩 post.id:", post.id);
                console.log("🧩 post._id:", post._id);
                              navigate(`/detail/${post._id || post.id}`);
                            }}
                            className="w-full text-xs px-2 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all duration-300 hover:scale-105"
          >
            View Details
          </button>
        </div>
      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="col-span-full text-center py-8"
                    >
                      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                        <div className="w-12 h-12 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Search className="w-6 h-6 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">No Results Found</h3>
                        <p className="text-slate-400 text-sm">Try searching with different keywords or check your spelling.</p>
                      </div>
                    </motion.div>
                  )}
  </div>
              </motion.div>
            )}
          </div>
        </section>



        {/* Existing Components with Dark Theme */}
        <div className="space-y-16 md:space-y-24 pb-16">
        <LostAndFoundCards />
        <RecentPosts />
        <CategoryStats />
        <HowItWorks />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
