import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/axiosConfig';
import DefaultImage from '../assets/Lost_And_Found.png';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  Mail,
  Phone,
  ShieldAlert,
  Edit,
  Trash2,
  Tag,
  Search,
  Package
} from 'lucide-react';
import logo from '../assets/Lost_And_Found.png';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';

const ItemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const { user } = useAuth();

  // Get the previous path from location state or default to home
  const getPreviousPath = () => {
    // Check if user is admin and came from admin context
    if (user?.isAdmin && location.state?.fromAdmin) {
      return '/admin/dashboard';
    }
    
    if (location.state?.from) {
      return location.state.from;
    }
    // Check if we came from search results
    if (location.state?.searchResults) {
      return '/search-results';
    }
    // Default to home page
    return '/';
  };

  // Particle animation effect
  const [particles, setParticles] = useState([]);

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
    if (user && user.email) {
      setUserEmail(user.email);
    }

    api
      .get(`/user-reports/item/${id}`)
      .then((res) => {
        setItem(res.data);
        setLoading(false);
        
        if (user && user.email === res.data.email) {
          setIsOwner(true);
        }
      })
      .catch((err) => {
        console.error('Error fetching item:', err);
        setLoading(false);
      });
  }, [id, user]);

  const handleDelete = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#8b5cf6',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: '#1e213a',
      backdrop: 'rgba(0,0,0,0.4)',
      customClass: {
        popup: 'rounded-xl shadow-2xl',
        title: 'text-white font-bold',
        htmlContainer: 'text-gray-300',
        confirmButton: 'rounded-lg px-6 py-2 font-medium',
        cancelButton: 'rounded-lg px-6 py-2 font-medium'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/user-reports/items-delete/${id}`);
          Swal.fire({
            title: 'Deleted!',
            text: 'Item deleted successfully.',
            icon: 'success',
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
          });
          navigate(getPreviousPath());
        } catch (err) {
          console.error("Error deleting item:", err);
          Swal.fire({
            title: 'Error!',
            text: 'Failed to delete item.',
            icon: 'error',
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
    });
  };

  const handleEdit = () => {
    // Check if user is admin and redirect accordingly
    if (user?.isAdmin) {
      navigate(`/admin/edit/${id}`, { state: { fromAdmin: true } });
    } else {
    navigate(`/ItemUpdateForm/${id}`);
    }
  };

  const getImageSource = () => {
    if (item.itemPhoto && item.itemPhoto.startsWith('data:image')) {
      return item.itemPhoto;
    }
    return item.itemPhoto || DefaultImage;
  };

  const capitalizeWords = (str) => {
    return str?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || '';
  };

  const getCategoryColor = (category) => {
    const colors = {
      electronics: 'text-blue-400',
      wallet: 'text-yellow-400',
      jewelry: 'text-purple-400',
      clothing: 'text-green-400',
      documents: 'text-red-400',
      other: 'text-gray-400'
    };
    return colors[category] || 'text-gray-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0e1d] flex items-center justify-center">
        <motion.div 
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-[#0c0e1d] flex items-center justify-center">
        <motion.div 
          className="text-white text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-2xl font-bold mb-4">Item not found</h2>
          <p className="text-gray-400">The item you're looking for doesn't exist.</p>
        </motion.div>
      </div>
    );
  }

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

      <div
        onClick={() => navigate(getPreviousPath())}
        className="fixed top-6 left-6 text-white hover:text-purple-300 transition-colors flex items-center z-[9999] bg-[#1e213a]/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-purple-500/30 cursor-pointer shadow-lg"
        style={{ pointerEvents: 'auto' }}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to results
      </div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        <motion.div 
          className="w-full max-w-6xl mx-auto bg-[#1e213a]/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-purple-500/30 p-6 flex gap-8 mt-16"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Image Section */}
          <motion.div 
            className="flex-1 flex items-center justify-center bg-[#0c0e1d] rounded-xl p-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
          {item.itemPhoto ? (
            <img
              src={getImageSource()}
              alt={item.itemName}
              className="w-full h-full max-w-[450px] max-h-[450px] object-contain rounded-xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = logo;
              }}
            />
          ) : (
            <img
              src={DefaultImage}
              alt="Default item"
              className="w-full h-full max-w-[450px] max-h-[450px] object-contain rounded-xl"
            />
          )}
          </motion.div>

          {/* Content Section */}
          <motion.div 
            className="flex-1 flex flex-col justify-between text-white"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="space-y-4">
            <div className="flex justify-between items-start">
                <motion.span 
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                    item.itemType === 'lost' 
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                      : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                  }`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {item.itemType === 'lost' ? <Search className="w-3 h-3" /> : <Package className="w-3 h-3" />}
                {item.itemType?.toUpperCase()}
                </motion.span>
                {(isOwner || user?.isAdmin) && (
                  <motion.div 
                    className="flex gap-2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <motion.button 
                      onClick={handleEdit}
                      className="p-2 text-purple-400 hover:bg-purple-500/20 rounded-full transition-colors border border-purple-500/30"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Edit"
                  >
                    <Edit className="w-5 h-5" />
                    </motion.button>
                    <motion.button 
                    onClick={handleDelete}
                      className="p-2 text-red-400 hover:bg-red-500/20 rounded-full transition-colors border border-red-500/30"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </motion.div>
              )}
            </div>
            
              <motion.h1 
                className="text-3xl font-bold capitalize bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                {item.itemName}
              </motion.h1>
            
            {item.itemCategory && (
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <Tag className={`w-4 h-4 ${getCategoryColor(item.itemCategory)}`} />
                  <span className={`text-sm font-medium ${getCategoryColor(item.itemCategory)}`}>
                  {capitalizeWords(item.itemCategory)}
                </span>
                </motion.div>
              )}

              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <motion.h3 
                  className="text-lg font-semibold text-purple-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
              Description
                </motion.h3>
                <motion.p 
                  className="text-gray-300 leading-relaxed"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  {item.itemDescription || 'No description provided.'}
                </motion.p>
              </motion.div>

              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
              >
                <motion.div 
                  className="flex items-center gap-3 text-gray-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  <MapPin className="w-5 h-5 text-purple-400" />
                  <span>{item.itemLocation || 'Location not specified'}</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-3 text-gray-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.3 }}
                >
                  <CalendarDays className="w-5 h-5 text-purple-400" />
                  <span>{item.itemDate ? new Date(item.itemDate).toLocaleDateString() : 'Date not specified'}</span>
                </motion.div>
              </motion.div>
          </div>

            {/* Contact Information */}
            <motion.div 
              className="bg-[#0c0e1d]/50 backdrop-blur-sm p-4 rounded-xl mt-6 space-y-3 border border-purple-500/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.4 }}
            >
              <motion.h3 
                className="text-lg font-semibold text-purple-300 mb-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.5 }}
              >
                Contact Information
              </motion.h3>
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.6 }}
              >
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail className="w-5 h-5 text-purple-400" />
                  <span>{item.email}</span>
                </div>
                {item.phone && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <Phone className="w-5 h-5 text-purple-400" />
                    <span>{item.phone}</span>
            </div>
                )}
              </motion.div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              className="flex gap-3 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.7 }}
            >
              {/* Show Send Message button only if user is NOT the owner */}
              {!isOwner && (
                <motion.button
                  onClick={() => {
                    // Open email client with pre-filled message
                    const subject = encodeURIComponent(`Regarding your ${item.itemType} item: ${item.itemName}`);
                    const body = encodeURIComponent(`Hello,\n\nI'm contacting you about your ${item.itemType} item "${item.itemName}".\n\nPlease provide more details.\n\nBest regards`);
                    window.open(`mailto:${item.email}?subject=${subject}&body=${body}`);
                  }}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Send Message
                </motion.button>
              )}
              
              {/* Show Edit/Delete buttons only if user IS the owner or is admin */}
              {(isOwner || user?.isAdmin) && (
                <>
                  <motion.button
                    onClick={handleEdit}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Edit Item
                  </motion.button>
                  <motion.button
                    onClick={handleDelete}
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6 rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Delete Item
                  </motion.button>
                </>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ItemDetailPage;