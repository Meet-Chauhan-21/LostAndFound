import api from '../utils/axiosConfig';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, Shield, Zap, Search, Users, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Swal from 'sweetalert2';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  // Particle animation effect (same as ServicesPage)
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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      valid = false;
    } else {
      newErrors.username = '';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    } else {
      newErrors.email = '';
    }

    // Phone number validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      valid = false;
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
      valid = false;
    } else {
      newErrors.phone = '';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    } else {
      newErrors.password = '';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    } else {
      newErrors.confirmPassword = '';
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await api.post("/lostAndFound/user-register", formData);
        console.log('Form submitted:', formData);

        if(response.data === "Registration successfully") {
          Swal.fire({
            icon: 'success',
            title: 'Registration Successful!',
            text: 'Your account has been created successfully. Please login to continue.',
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
              // set navbar username 
              const userData = {
                name: formData.username,
                email: formData.email,
              };
              localStorage.setItem("user", JSON.stringify(userData));
              navigate("/login");
            }
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: 'Email already exists. Please try with a different email.',
            confirmButtonColor: '#ef4444',
            background: '#1e213a',
            backdrop: 'rgba(0,0,0,0.4)',
            customClass: {
              popup: 'rounded-xl shadow-2xl',
              title: 'text-white font-bold',
              htmlContainer: 'text-gray-300',
              confirmButton: 'rounded-lg px-6 py-2 font-medium'
            }
          });
        }
      } catch(err) {
        console.log("ERROR : " + err);
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: 'Something went wrong. Please try again later.',
          confirmButtonColor: '#ef4444',
          background: '#1e213a',
          backdrop: 'rgba(0,0,0,0.4)',
          customClass: {
            popup: 'rounded-xl shadow-2xl',
            title: 'text-white font-bold',
            htmlContainer: 'text-gray-300',
            confirmButton: 'rounded-lg px-6 py-2 font-medium'
          }
        });
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse?.credential;
      if (!idToken) throw new Error('No credential received from Google');

      const response = await api.post('/lostAndFound/auth/google', { idToken });

      const userData = {
        name: response.data.username || response.data.email?.split('@')[0],
        email: response.data.email,
      };
      login(userData, response.data.token);
      Swal.fire({
        icon: 'success',
        title: 'Signed up with Google',
        timer: 1000,
        showConfirmButton: false,
        background: '#1e213a',
      }).then(() => navigate('/home'));
    } catch (err) {
      console.error('Google signup failed', err);
      Swal.fire({
        icon: 'error',
        title: 'Google Sign-up Failed',
        text: 'Could not continue with Google. Please try again.',
        confirmButtonColor: '#ef4444',
        background: '#1e213a',
      });
    }
  };

  const handleGoogleError = () => {
    Swal.fire({
      icon: 'error',
      title: 'Google Sign-in Cancelled',
      text: 'Please try again.',
      confirmButtonColor: '#ef4444',
      background: '#1e213a',
    });
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
      
      {/* Registration Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-12 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Header Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-3 bg-[#1e213a]/50 border border-purple-500/30 rounded-full px-6 py-3 mb-8 backdrop-blur-sm"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Users className="w-5 h-5 text-purple-400" />
              </motion.div>
              <span className="text-purple-300 font-medium">
                Join Our Community
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-5xl lg:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent"
            >
              Join the Lost&Found Community
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xl text-gray-300 mb-8"
            >
              Create your account and be part of a growing platform that reunites lost items with their owners.
            </motion.p>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">50K+</div>
                <div className="text-slate-300 text-sm">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">25K+</div>
                <div className="text-slate-300 text-sm">Items Reunited</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Registration Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex justify-center lg:justify-end mt-16"
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-[#1e213a]/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 shadow-2xl w-full max-w-md mt-8 lg:mt-0"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                Username
              </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 bg-slate-800/60 backdrop-blur-sm border ${
                        errors.username ? 'border-red-500' : 'border-slate-600/50'
                      } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-white placeholder-slate-400 transition-all duration-300`}
                placeholder="Enter your username"
              />
            </div>
                  {errors.username && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm text-red-400"
                    >
                      {errors.username}
                    </motion.p>
                  )}
                </motion.div>

                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
              </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 bg-slate-800/60 backdrop-blur-sm border ${
                        errors.email ? 'border-red-500' : 'border-slate-600/50'
                      } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-white placeholder-slate-400 transition-all duration-300`}
                placeholder="Enter your email"
              />
            </div>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm text-red-400"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </motion.div>

                {/* Phone Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">
                Phone Number
              </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 bg-slate-800/60 backdrop-blur-sm border ${
                        errors.phone ? 'border-red-500' : 'border-slate-600/50'
                      } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-white placeholder-slate-400 transition-all duration-300`}
                placeholder="Enter your 10-digit phone number"
              />
            </div>
                  {errors.phone && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm text-red-400"
                    >
                      {errors.phone}
                    </motion.p>
                  )}
                </motion.div>

                {/* Password Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 bg-slate-800/60 backdrop-blur-sm border ${
                        errors.password ? 'border-red-500' : 'border-slate-600/50'
                      } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-white placeholder-slate-400 transition-all duration-300`}
                placeholder="Enter your password"
              />
            </div>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm text-red-400"
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </motion.div>

                {/* Confirm Password Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                Confirm Password
              </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 bg-slate-800/60 backdrop-blur-sm border ${
                        errors.confirmPassword ? 'border-red-500' : 'border-slate-600/50'
                      } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-white placeholder-slate-400 transition-all duration-300`}
                placeholder="Confirm your password"
              />
            </div>
                  {errors.confirmPassword && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm text-red-400"
                    >
                      {errors.confirmPassword}
                    </motion.p>
                  )}
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
            <button
              type="submit"
                    className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
                    <Zap className="w-5 h-5" />
                    Create Account
            </button>
                </motion.div>
        </form>

              {/* Divider */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.1 }}
                className="mt-6"
              >
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-[#1e213a]/50 text-slate-400">
                Or continue with
              </span>
            </div>
          </div>
              </motion.div>

              {/* Google Registration */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="mt-6"
              >
                <div className="w-full">
                  <div className="transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg rounded-lg">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      shape="pill"
                      text="continue_with"
                      theme="outline"
                      size="large"
                      logo_alignment="left"
                      width="100%"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Login Link */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.3 }}
                className="mt-6 text-center"
              >
                <p className="text-sm text-slate-400">
              Already have an account?{' '}
                  <Link to="/login" className="font-medium text-purple-400 hover:text-purple-300 transition-colors">
                Login
              </Link>
            </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
              </div>
  );
};

export default RegistrationForm;