import api from '../utils/axiosConfig';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { Eye, EyeOff, Mail, Lock, User, Shield, Zap, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Swal from 'sweetalert2';
import { GoogleLogin } from '@react-oauth/google';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    } else {
      newErrors.email = '';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else {
      newErrors.password = '';
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await api.post("/lostAndFound/user-login", formData);
        console.log("Login response:", response.data);
        
        if (response.data.message === "Login successfully") {
          Swal.fire({
            icon: 'success',
            title: 'Login Successful!',
            text: 'Welcome back! You have been logged in successfully.',
            confirmButtonColor: '#8b5cf6',
            background: '#1e213a',
            backdrop: 'rgba(0,0,0,0.4)',
            showConfirmButton: false,
            timer: 1000,
            customClass: {
              popup: 'rounded-xl shadow-2xl',
              title: 'text-white font-bold',
              htmlContainer: 'text-gray-300',
              confirmButton: 'rounded-lg px-6 py-2 font-medium'
            }
          }).then((result) => {
              const userData = {
                name: response.data.username || formData.email.split('@')[0],
                email: response.data.email
              };

              // Use the auth context to login
              login(userData, response.data.token);

              navigate("/home");
          });
          
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Email or Password is incorrect. Please try again.',
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
          title: 'Login Failed',
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

      // Expecting { token, email, username, message }
      const userData = {
        name: response.data.username || response.data.email?.split('@')[0],
        email: response.data.email,
      };
      login(userData, response.data.token);
      Swal.fire({
        icon: 'success',
        title: 'Logged in with Google',
        timer: 1000,
        showConfirmButton: false,
        background: '#1e213a',
      }).then(() => navigate('/home'));
    } catch (err) {
      console.error('Google auth failed', err);
      Swal.fire({
        icon: 'error',
        title: 'Google Login Failed',
        text: 'Could not sign in with Google. Please try again.',
        confirmButtonColor: '#ef4444',
        background: '#1e213a',
      });
    }
  };

  const handleGoogleError = () => {
    Swal.fire({
      icon: 'error',
      title: 'Google Login Cancelled',
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
      
      {/* Login Section */}
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
                <Shield className="w-5 h-5 text-purple-400" />
              </motion.div>
              <span className="text-purple-300 font-medium">
                Secure Login
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-5xl lg:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent"
            >
              Welcome Back
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xl text-gray-300 mb-8"
            >
              Sign in to your LostAndFound account
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Search className="w-4 h-4 text-white" />
                </div>
                <span>Find your lost items quickly</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span>Secure and private platform</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span>Join our helpful community</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex justify-center lg:justify-end"
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-[#1e213a]/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 shadow-2xl w-full max-w-md"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
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
                required
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

                {/* Password Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                      className={`w-full pl-10 pr-12 py-3 bg-slate-800/60 backdrop-blur-sm border ${
                        errors.password ? 'border-red-500' : 'border-slate-600/50'
                      } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-white placeholder-slate-400 transition-all duration-300`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                  ) : (
                        <Eye className="w-5 h-5" />
                  )}
                </button>
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

                {/* Remember Me & Forgot Password */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="flex items-center justify-between"
                >
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-600 rounded bg-slate-700"
              />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
                    <Link to="/forgot-password" className="font-medium text-purple-400 hover:text-purple-300 transition-colors">
                      Forgot password?
              </Link>
            </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
            <button
              type="submit"
                    className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
                    <Zap className="w-5 h-5" />
                    Sign In
            </button>
                </motion.div>
        </form>

              {/* Divider */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
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

              {/* Google Login */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
                className="mt-6"
              >
                <div className="w-full" style={{ display: 'flex', justifyContent: 'center' }}>
                  <div 
                    className="w-full bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-slate-600/50 rounded-full transition-all duration-300 hover:shadow-xl hover:border-purple-500/30 hover:scale-[1.02]"
                    style={{ 
                      padding: '2px',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        shape="pill"
                        text="continue_with"
                        theme="filled_black"
                        size="large"
                        logo_alignment="left"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Sign Up Link */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
                className="mt-6 text-center"
              >
                <p className="text-sm text-slate-400">
            Don't have an account?{' '}
                  <Link to="/register" className="font-medium text-purple-400 hover:text-purple-300 transition-colors">
              Sign up
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

export default LoginForm;