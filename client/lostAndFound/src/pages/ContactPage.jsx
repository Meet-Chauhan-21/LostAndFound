import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, MessageCircle, Mail, Phone, Clock } from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({ name: "", email: "", subject: "", message: "" });
        setIsSubmitted(false);
      }, 3000);
    }, 1500);
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 bg-[#1e213a]/50 border border-purple-500/30 rounded-full px-6 py-3 mb-8 backdrop-blur-sm"
          >
            <MessageCircle className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 font-medium">
              Reach Across the Cosmos
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent"
          >
            Connect With Our Stellar Team
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            We're orbiting nearby to answer your light-speed queries
          </motion.p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-pink-600/20 p-8 rounded-xl shadow-2xl border-2 border-purple-500/30 backdrop-blur-sm relative overflow-hidden"
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 animate-pulse"></div>
            
            <motion.h2 
              className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Send us a message
            </motion.h2>
            
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-400/50 shadow-lg"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Send className="w-10 h-10 text-white" />
                </motion.div>
                <motion.h3 
                  className="text-2xl font-bold mb-3 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  Message Sent Successfully! 🎉
                </motion.h3>
                <motion.p 
                  className="text-gray-300 text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  Thank you for contacting us. We'll get back to you soon!
                </motion.p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Name</label>
                    <motion.input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-2 border-purple-400/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-400 outline-none transition-all text-black placeholder-gray-600 backdrop-blur-sm"
                      placeholder="Your name"
                      whileFocus={{ scale: 1.02, borderColor: "rgb(147, 51, 234)" }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Email</label>
                    <motion.input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border-2 border-blue-400/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition-all text-black placeholder-gray-600 backdrop-blur-sm"
                      placeholder="your@email.com"
                      whileFocus={{ scale: 1.02, borderColor: "rgb(59, 130, 246)" }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">Subject</label>
                  <motion.input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gradient-to-r from-pink-900/30 to-purple-900/30 border-2 border-pink-400/50 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-400 outline-none transition-all text-black placeholder-gray-600 backdrop-blur-sm"
                    placeholder="Subject"
                    whileFocus={{ scale: 1.02, borderColor: "rgb(236, 72, 153)" }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">Message</label>
                  <motion.textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border-2 border-cyan-400/50 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 outline-none transition-all text-black placeholder-gray-600 backdrop-blur-sm"
                    placeholder="Your message..."
                    whileFocus={{ scale: 1.02, borderColor: "rgb(34, 211, 238)" }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 0 30px rgba(147, 51, 234, 0.8)",
                    background: "linear-gradient(135deg, #8b5cf6, #3b82f6, #ec4899)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 text-white rounded-lg font-bold text-lg flex items-center justify-center gap-3 transition-all hover:from-purple-700 hover:via-blue-700 hover:to-pink-700 relative overflow-hidden"
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-blue-400/20 to-pink-400/20 animate-pulse"></div>
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* Contact Information */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-pink-600/20 p-8 rounded-xl shadow-2xl border border-purple-500/30 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
                Contact Information
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mt-1 border-2 border-purple-400/50 shadow-lg">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-gray-300 font-medium">Email</h4>
                    <a href="mailto:meetchauhan9915@gmail.com" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                      meetchauhan9915@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mt-1 border-2 border-green-400/50 shadow-lg">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-gray-300 font-medium">Phone</h4>
                    <a href="tel:+919265379915" className="text-green-400 hover:text-green-300 transition-colors font-medium">
                      +91 9265379915
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mt-1 border-2 border-orange-400/50 shadow-lg">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-gray-300 font-medium">Support Hours</h4>
                    <p className="text-orange-400 font-medium">24/7 Available Support</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;