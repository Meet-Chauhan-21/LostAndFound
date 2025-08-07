import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/axiosConfig';
import Swal from 'sweetalert2';
import DefaultImage from '../assets/Lost_And_Found.png'
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

import {
  ArrowLeft,
  Image,
  Tag,
  MapPin,
  Calendar,
  Info,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Search,
  Package
} from 'lucide-react';

const ItemUpdateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [particles, setParticles] = useState([]);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    itemName: '',
    itemCategory: '',
    itemLocation: '',
    itemDate: '',
    itemDescription: '',
    itemPhoto: '',
    email: '',
    phone: '',
    itemType: ''
  });

  // Particle animation effect
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 3 + 1,
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
    const fetchReport = async () => {
      try {
        const res = await api.get(`/user-reports/report/${id}`);
        const data = res.data;
        setFormData({
          itemName: data.itemName || '',
          itemCategory: data.itemCategory || '',
          itemLocation: data.itemLocation || '',
          itemDate: data.itemDate || '',
          itemDescription: data.itemDescription || '',
          itemPhoto: data.itemPhoto || '',
          email: data.email || '',
          phone: data.phone || '',
          itemType: data.itemType || 'lost'
        });
      } catch (err) {
        console.error('Failed to fetch report:', err);
      }
    };

    fetchReport();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File too large',
        text: 'Please select an image smaller than 2MB',
        confirmButtonColor: '#8b5cf6',
        background: '#1e213a',
        backdrop: 'rgba(0,0,0,0.4)',
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-white font-bold',
          htmlContainer: 'text-gray-300',
          confirmButton: 'rounded-lg px-6 py-2 font-medium'
        }
      });
      return;
    }

    const base64Image = await convertToBase64(file);
    setFormData(prev => ({ ...prev, itemPhoto: base64Image }));
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await api.put(
        `/user-reports/report-update/${id}`,
        formData
      );

      await Swal.fire({
        icon: 'success',
        title: 'Updated Successfully!',
        showConfirmButton: false,
        timer: 800,
        background: '#1e213a',
        backdrop: 'rgba(0,0,0,0.4)',
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-white font-bold',
          htmlContainer: 'text-gray-300'
        }
      });

      navigate("/profilepage", { state: { refresh: true } });
    } catch (error) {
      console.error("Error updating report:", error);
      setError("Update failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0e1d] relative overflow-hidden">
      {/* Animated Background Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute rounded-full ${
            particle.isStar ? 'bg-yellow-400' : 'bg-purple-400'
          } animate-pulse`}
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
          }}
        />
      ))}

      {/* Nebula Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-blue-900/10 to-transparent"></div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.button
            onClick={() => navigate(-1)}
            className="flex items-center text-white hover:text-purple-300 transition-colors bg-[#1e213a]/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-purple-500/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </motion.button>
          <motion.h1 
            className="text-3xl font-bold text-white bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Update Item Details
          </motion.h1>
          <div className="w-10"></div>
        </motion.div>

        {/* Form Container */}
        <motion.div 
          className="bg-[#1e213a]/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-purple-500/30 overflow-hidden max-w-6xl mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Left Column */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Item Type */}
              <div className="flex items-center space-x-4">
                <motion.button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, itemType: 'lost' }))}
                  className={`flex-1 py-3 px-4 rounded-lg border transition-all ${
                    formData.itemType === 'lost' 
                      ? 'bg-blue-500/20 border-blue-500/30 text-blue-300' 
                      : 'bg-[#0c0e1d]/50 border-slate-600/50 text-gray-400 hover:border-blue-500/30'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Search className="w-4 h-4 inline mr-2" />
                  Lost Item
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, itemType: 'found' }))}
                  className={`flex-1 py-3 px-4 rounded-lg border transition-all ${
                    formData.itemType === 'found' 
                      ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300' 
                      : 'bg-[#0c0e1d]/50 border-slate-600/50 text-gray-400 hover:border-yellow-500/30'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Package className="w-4 h-4 inline mr-2" />
                  Found Item
                </motion.button>
              </div>

              {/* Item Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Item Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600/50 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400"
                    placeholder="e.g. Red Wallet, iPhone 12"
                  />
                  <Tag className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <div className="relative">
                  <select
                    name="itemCategory"
                    value={formData.itemCategory}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600/50 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-white appearance-none"
                  >
                    <option value="">Select a category</option>
                    <option value="electronics">Electronics</option>
                    <option value="wallet">Wallet/Purse</option>
                    <option value="jewelry">Jewelry</option>
                    <option value="clothing">Clothing</option>
                    <option value="documents">Documents</option>
                    <option value="other">Other</option>
                  </select>
                  <Tag className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="itemLocation"
                    value={formData.itemLocation}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600/50 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400"
                    placeholder="Where was it lost/found?"
                  />
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="itemDate"
                    value={formData.itemDate}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600/50 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-white"
                  />
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </motion.div>

            {/* Right Column */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <div className="relative">
                  <textarea
                    name="itemDescription"
                    value={formData.itemDescription}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600/50 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400"
                    placeholder="Provide detailed description..."
                  />
                  <Info className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Item Photo
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-32 h-32 bg-slate-800 rounded-lg overflow-hidden border border-slate-600/50">
                    {formData.itemPhoto ? (
                      <img
                        src={formData.itemPhoto}
                        alt="Item"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Image className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="flex flex-col items-center px-4 py-3 bg-slate-800 rounded-lg border border-slate-600/50 cursor-pointer hover:bg-slate-700 transition-colors">
                      <span className="text-sm font-medium text-gray-300">
                        {formData.itemPhoto ? 'Change Photo' : 'Upload Photo'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      JPEG, PNG (Max 2MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <motion.div 
                className="bg-[#0c0e1d]/50 backdrop-blur-sm p-4 rounded-lg border border-purple-500/30"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-lg font-medium text-purple-300 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Contact Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        readOnly
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 bg-purple-500/20 py-3 border border-purple-500/30 rounded-lg text-white"
                        placeholder="your@email.com"
                      />
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-purple-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        readOnly
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-purple-500/20 border border-purple-500/30 rounded-lg text-white"
                        placeholder="+1234567890"
                      />
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-purple-400" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4">
                <motion.button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 border border-slate-600/50 rounded-lg text-gray-300 hover:bg-slate-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-70 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    'Update Item'
                  )}
                </motion.button>
              </div>

              {error && (
                <motion.div 
                  className="flex items-center gap-2 text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/30"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <XCircle className="w-5 h-5" />
                  <span>{error}</span>
                </motion.div>
              )}
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ItemUpdateForm;