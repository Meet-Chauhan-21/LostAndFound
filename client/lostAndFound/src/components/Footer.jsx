import { motion } from "framer-motion";
import { Search, Mail, Phone, Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  const socialLinks = [
    {
      icon: Facebook,
      name: "facebook",
      hoverBg: "hover:bg-blue-600",
      hoverShadow: "hover:shadow-lg hover:shadow-blue-500/50",
    },
    {
      icon: Twitter,
      name: "twitter",
      hoverBg: "hover:bg-sky-500",
      hoverShadow: "hover:shadow-lg hover:shadow-sky-500/50",
    },
    {
      icon: Instagram,
      name: "instagram",
      hoverBg: "hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600",
      hoverShadow: "hover:shadow-lg hover:shadow-pink-500/50",
    },
    {
      icon: Linkedin,
      name: "linkedin",
      hoverBg: "hover:bg-blue-700",
      hoverShadow: "hover:shadow-lg hover:shadow-blue-700/50",
    },
    {
      icon: Github,
      name: "github",
      hoverBg: "hover:bg-gray-800",
      hoverShadow: "hover:shadow-lg hover:shadow-gray-800/50",
    },
  ];

  return (
    <motion.footer
      className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-t border-slate-700/50 py-20 px-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInUpVariants}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Logo and Description */}
          <motion.div
            variants={fadeInUpVariants}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Search className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-400 bg-clip-text text-transparent">
                Lost&Found
              </span>
            </div>
            <p className="text-slate-400 mb-6 text-lg">
              Reuniting lost items with their owners through the power of
              community and technology.
            </p>
            <div className="flex gap-4">
              {socialLinks.map(({ icon: Icon, name, hoverBg, hoverShadow }) => (
                <motion.a
                  key={name}
                  href={`https://${name}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`social-btn ${name} w-12 h-12 bg-slate-700 rounded-2xl transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:outline-none flex items-center justify-center cursor-pointer border border-slate-600 hover:border-transparent`}
                  whileHover={{ 
                    scale: 1.2, 
                    y: -5,
                    rotate: [0, -3, 3, 0],
                    transition: { duration: 0.4, ease: "easeOut" }
                  }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            variants={fadeInUpVariants}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-bold mb-6 text-xl text-white">Quick Links</h4>
            <ul className="space-y-3 text-slate-400">
              <li>
                <a
                  href="#how-it-works"
                  className="hover:text-white transition-colors text-lg"
                >
                  How It Works
                </a>
              </li>
              <li>
                <Link
                  to="/services"
                  className="hover:text-white transition-colors text-lg"
                >
                  Our Service
                </Link>
              </li>
              <li>
                <a
                  href="#categories"
                  className="hover:text-white transition-colors text-lg"
                >
                  Categories
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors text-lg"
                >
                  Recent Items
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            variants={fadeInUpVariants}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-bold mb-6 text-xl text-white">Support</h4>
            <ul className="space-y-3 text-slate-400">
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors text-lg"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors text-lg"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors text-lg"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors text-lg"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            variants={fadeInUpVariants}
            transition={{ delay: 0.4 }}
          >
            <h4 className="font-bold mb-6 text-xl text-white">Contact</h4>
            <div className="space-y-4 text-slate-400">
              <motion.a
                href="mailto:meetchauhan9915@gmail.com"
                className="flex items-center gap-3 hover:text-white transition-colors text-lg cursor-pointer hover:scale-105"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Mail className="w-5 h-5" />
                <span>meetchauhan9915@gmail.com</span>
              </motion.a>
              <motion.a
                href="tel:+919265379915"
                className="flex items-center gap-3 hover:text-white transition-colors text-lg cursor-pointer hover:scale-105"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Phone className="w-5 h-5" />
                <span>+91 9265379915</span>
              </motion.a>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="pt-8 border-t border-slate-700/50 text-center text-slate-400 text-lg"
          variants={fadeInUpVariants}
          transition={{ delay: 0.5 }}
        >
          <p>Made with ❤️ by Meet Chauhan • © 2025 Lost&Found</p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
