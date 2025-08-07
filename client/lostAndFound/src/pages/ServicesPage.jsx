import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Search, Package, Shield, Bell, Users, Smartphone, MapPin, CheckCircle, 
  TrendingUp, Globe, Clock, Award, Zap, Heart, Star, Target, ArrowRight,
  Database, Lock, Eye, MessageCircle, Phone, Mail, Calendar, UserCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PostFoundModal from "../components/PostFoundModal";
import PostLostModal from "../components/PostLostModal";
import { useAuth } from "../context/AuthContext";
import Swal from 'sweetalert2';

const ServicesPage = () => {
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

  // Statistics data
  const stats = [
    { icon: <Users className="w-6 h-6" />, value: "50K+", label: "Active Users", color: "from-purple-500 to-purple-600" },
    { icon: <CheckCircle className="w-6 h-6" />, value: "15K+", label: "Items Recovered", color: "from-green-500 to-green-600" },
    { icon: <Globe className="w-6 h-6" />, value: "100+", label: "Cities Covered", color: "from-blue-500 to-blue-600" },
    { icon: <Clock className="w-6 h-6" />, value: "24/7", label: "Support Available", color: "from-orange-500 to-orange-600" }
  ];

  // How it works steps
  const workflowSteps = [
    {
      step: "01",
      title: "Report Lost/Found Item",
      description: "Upload photos and details of your lost or found item",
      icon: <Search className="w-8 h-8" />,
      color: "from-purple-500 to-purple-600"
    },
    {
      step: "02",
      title: "AI-Powered Matching",
      description: "Our advanced AI analyzes and matches items automatically",
      icon: <Zap className="w-8 h-8" />,
      color: "from-blue-500 to-blue-600"
    },
    {
      step: "03",
      title: "Community Network",
      description: "Connect with users in your area for faster recovery",
      icon: <Users className="w-8 h-8" />,
      color: "from-green-500 to-green-600"
    },
    {
      step: "04",
      title: "Secure Return",
      description: "Verified process ensures safe item return to owner",
      icon: <Shield className="w-8 h-8" />,
      color: "from-orange-500 to-orange-600"
    }
  ];

  // Success metrics
  const successMetrics = [
    { percentage: 92, label: "Success Rate", color: "from-green-400 to-green-600" },
    { percentage: 85, label: "User Satisfaction", color: "from-blue-400 to-blue-600" },
    { percentage: 78, label: "Recovery Speed", color: "from-purple-400 to-purple-600" },
    { percentage: 95, label: "Platform Reliability", color: "from-orange-400 to-orange-600" }
  ];

  // Modal state
  const [showFoundModal, setShowFoundModal] = useState(false);
  const [showLostModal, setShowLostModal] = useState(false);
  
  // Navigation
  const navigate = useNavigate();
  
  // Authentication
  const { user, isAuthenticated } = useAuth();



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
            transition={{ duration: 0.4, ease: "easeOut" }}
            viewport={{ once: false, margin: "-100px" }}
            className="inline-flex items-center gap-3 bg-[#1e213a]/50 border border-purple-500/30 rounded-full px-6 py-3 mb-8 backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Package className="w-5 h-5 text-purple-400" />
            </motion.div>
            <span className="text-purple-300 font-medium">
              How LostAndFound Works
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            viewport={{ once: false, margin: "-100px" }}
            className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent"
          >
            Reuniting Lost Items with Their Owners
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: false, margin: "-100px" }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Our advanced platform combines AI technology with community power to create the most effective lost & found solution
          </motion.p>
        </div>
      </section>

      {/* How It Works Section - Zigzag Pattern */}
      <section className="py-16 container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 40, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: false, margin: "-50px" }}
            className="text-3xl font-bold text-center text-white mb-16"
          >
            How LostAndFound Works
          </motion.h2>
          
          <div className="relative">
            {/* Main Connection Line - Zigzag */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-blue-500 via-green-500 to-orange-500 transform -translate-x-1/2 hidden lg:block"></div>
            
            {/* Zigzag Connection Lines */}
            <div className="hidden lg:block absolute top-1/4 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"></div>
            <div className="hidden lg:block absolute top-1/2 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-blue-500 to-green-500"></div>
            <div className="hidden lg:block absolute top-3/4 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-green-500 to-orange-500"></div>
            
            {/* Workflow Steps in Zigzag */}
            <div className="space-y-24">
              {workflowSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -80 : 80, y: 30, scale: 0.8 }}
                  whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                  viewport={{ once: false, margin: "-100px" }}
                  className={`flex items-center gap-20 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  {/* Step Node */}
                  <div className={`flex-1 flex ${index % 2 === 0 ? 'justify-end pr-12' : 'justify-start pl-12'}`}>
                    <motion.div 
                      className="relative"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div 
                        className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center shadow-xl border-2 border-white/20 relative z-10`}
                        whileHover={{ boxShadow: "0 0 30px rgba(147, 51, 234, 0.5)" }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div 
                          className="text-white"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                        >
                          {step.icon}
                        </motion.div>
                        <motion.div 
                          className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold border border-white"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.3 }}
                        >
                          {step.step}
                        </motion.div>
                      </motion.div>
                      
                      {/* Connection Arrow */}
                      {index < workflowSteps.length - 1 && (
                        <motion.div 
                          className={`absolute top-1/2 ${index % 2 === 0 ? '-right-8' : '-left-8'} transform -translate-y-1/2`}
                          animate={{ x: index % 2 === 0 ? [0, 5, 0] : [0, -5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <ArrowRight className={`w-6 h-6 text-purple-400 ${index % 2 === 0 ? '' : 'rotate-180'}`} />
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                  
                  {/* Step Content */}
                  <div className="flex-1">
                    <motion.div 
                      className={`bg-[#1e213a]/90 p-10 rounded-xl shadow-xl border border-purple-500/30 backdrop-blur-sm max-w-lg ${index % 2 === 0 ? 'ml-12' : 'mr-12'}`}
                      whileHover={{ scale: 1.02, y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.h3 
                        className="text-2xl font-semibold text-white mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        viewport={{ once: false }}
                      >
                        {step.title}
                      </motion.h3>
                      <motion.p 
                        className="text-gray-300 text-lg leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        viewport={{ once: false }}
                      >
                        {step.description}
                      </motion.p>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Final Connection Point */}
            <div className="hidden lg:block absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 40, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: false, margin: "-50px" }}
            className="text-3xl font-bold text-center text-white mb-12"
          >
            Our Impact in Numbers
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.7, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
                viewport={{ once: false, margin: "-50px" }}
                whileHover={{ scale: 1.05, y: -10, rotateY: 5 }}
                className="bg-[#1e213a]/80 p-6 rounded-xl shadow-2xl border border-purple-500/20 backdrop-blur-sm text-center"
              >
                <motion.div 
                  className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div 
                    className="text-white"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  >
                    {stat.icon}
                  </motion.div>
                </motion.div>
                <motion.div 
                  className="text-3xl font-bold text-white mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.1 }}
                  viewport={{ once: false }}
                >
                  {stat.value}
                </motion.div>
                <motion.div 
                  className="text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                  viewport={{ once: false }}
                >
                  {stat.label}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Metrics Section */}
      <section className="py-16 container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 40, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: false, margin: "-50px" }}
            className="text-3xl font-bold text-center text-white mb-12"
          >
            Our Success Metrics
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {successMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60, y: 30, scale: 0.8 }}
                whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
                viewport={{ once: false, margin: "-50px" }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="bg-[#1e213a]/80 p-6 rounded-xl shadow-2xl border border-purple-500/20 backdrop-blur-sm"
              >
                <motion.div 
                  className="flex items-center justify-between mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                  viewport={{ once: false }}
                >
                  <h3 className="text-white font-semibold">{metric.label}</h3>
                  <motion.span 
                    className="text-2xl font-bold text-white"
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
                    viewport={{ once: false }}
                  >
                    {metric.percentage}%
                  </motion.span>
                </motion.div>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${metric.percentage}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 + 0.4, ease: "easeOut" }}
                    viewport={{ once: false }}
                    className={`h-3 rounded-full bg-gradient-to-r ${metric.color} relative`}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: index * 0.3 }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      

      {/* CTA Section */}
      <section className="py-20 container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-16 rounded-2xl border border-purple-500/30 backdrop-blur-sm"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Join Our Community?</h2>
            <p className="text-2xl text-gray-300 mb-12 max-w-4xl mx-auto">
              Join 50K+ users who trust LostAndFound to reunite them with their lost items
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <motion.button 
                onClick={() => {
                  if (isAuthenticated()) {
                    setShowFoundModal(true);
                  } else {
                    Swal.fire({
                      icon: 'warning',
                      title: 'Please Login First',
                      text: 'You need to be logged in to post found items',
                      confirmButtonColor: '#f59e0b',
                      background: '#1e213a',
                      backdrop: 'rgba(0,0,0,0.4)',
                      customClass: {
                        popup: 'rounded-xl shadow-2xl',
                        title: 'text-white font-bold',
                        htmlContainer: 'text-gray-300',
                        confirmButton: 'rounded-lg px-6 py-2 font-medium'
                      }
                    }).then((result) => {
                      if (result.isConfirmed) {
                        navigate('/login');
                      }
                    });
                  }
                }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(147, 51, 234, 0.5)" }}
              whileTap={{ scale: 0.95 }}
                className="px-12 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all text-lg"
            >
              Report a Found Item
            </motion.button>
            <motion.button 
                onClick={() => {
                  if (isAuthenticated()) {
                    setShowLostModal(true);
                  } else {
                    Swal.fire({
                      icon: 'warning',
                      title: 'Please Login First',
                      text: 'You need to be logged in to post lost items',
                      confirmButtonColor: '#8b5cf6',
                      background: '#1e213a',
                      backdrop: 'rgba(0,0,0,0.4)',
                      customClass: {
                        popup: 'rounded-xl shadow-2xl',
                        title: 'text-white font-bold',
                        htmlContainer: 'text-gray-300',
                        confirmButton: 'rounded-lg px-6 py-2 font-medium'
                      }
                    }).then((result) => {
                      if (result.isConfirmed) {
                        navigate('/login');
                      }
                    });
                  }
                }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}
              whileTap={{ scale: 0.95 }}
                className="px-12 py-4 border-2 border-purple-500 text-white rounded-xl font-medium hover:bg-purple-500/20 transition-all text-lg"
            >
              Report a Lost Item
            </motion.button>
          </div>
          </motion.div>
        </div>
      </section>

      {/* Modals */}
      {showFoundModal && (
        <PostFoundModal 
          isOpen={showFoundModal} 
          onClose={() => setShowFoundModal(false)} 
        />
      )}
      
      {showLostModal && (
        <PostLostModal 
          isOpen={showLostModal} 
          onClose={() => setShowLostModal(false)} 
        />
      )}

      <Footer />
    </div>
  );
};

export default ServicesPage;