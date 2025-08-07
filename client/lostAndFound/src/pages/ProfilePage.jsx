import { useEffect, useState } from 'react';
import api from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import DefaultImage from '../assets/Lost_And_Found.png'
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import {
  User,
  MapPin,
  Calendar,
  Info,
  ArrowLeft,
  Edit,
  Trash2,
  Tag,
  Phone,
  LogOut,
  Mail,
  Search,
  Package
} from 'lucide-react';

const ProfilePage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [phone, setPhone] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [particles, setParticles] = useState([]);

  const navigate = useNavigate();
  const { user, logout } = useAuth();

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
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.email) return;
      try {
        console.log("Fetching history for email:", user.email);
        const res = await api.get(`/lostAndFound/user-history/${user.email}`);
        console.log("History response:", res.data);
        setHistory(res.data);
      } catch (err) {
        console.error("Error fetching history:", err);
        setError('Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  useEffect(() => {
    const fetchPhone = async () => {
      try {
        const res = await api.get(`/lostAndFound/getUser/${encodeURIComponent(user.email)}`);
        console.log("User data response:", res.data);
        setPhone(res.data.phone || "Not provided");
        setCreatedAt(res.data.createdAt);
        console.log("Phone:", res.data.phone);
        console.log("Date:", res.data.createdAt);
      } catch (err) {
        console.error("Failed to fetch user phone:", err);
        setPhone("Not available");
      }
    };

    if (user?.email) {
      fetchPhone();
    }
  }, [user]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const handleEdit = (itemId) => {
    console.log("Editing item with ID:", itemId);
    navigate(`/ItemUpdateForm/${itemId}`);
  };

  const handleDelete = async (itemId) => {
    console.log("Deleting item with ID:", itemId);
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this item?',
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
          await api.delete(`/user-reports/items-delete/${itemId}`);
          setHistory((prev) => prev.filter((item) => (item._id || item.id) !== itemId));
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

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#8b5cf6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!',
      background: '#1e213a',
      backdrop: 'rgba(0,0,0,0.4)',
      customClass: {
        popup: 'rounded-xl shadow-2xl',
        title: 'text-white font-bold',
        htmlContainer: 'text-gray-300',
        confirmButton: 'rounded-lg px-6 py-2 font-medium',
        cancelButton: 'rounded-lg px-6 py-2 font-medium'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate('/login');
      }
    });
  };

  const lostItems = history.filter((item) => item.itemType === 'lost');
  const foundItems = history.filter((item) => item.itemType === 'found');

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
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-white hover:text-purple-300 transition-colors bg-[#1e213a]/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-purple-500/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </motion.button>
          <motion.button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors bg-[#1e213a]/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-red-500/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </motion.button>
        </motion.div>

        {/* Enhanced User Info Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <motion.h1 
            className="text-3xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            My Profile
          </motion.h1>
          <motion.div 
            className="bg-[#1e213a]/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-purple-500/30 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{user?.name}</h1>
                  <p className="text-purple-100">
                    Member since {createdAt ? formatDate(createdAt) : "Unknown"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <motion.div 
                  className="flex items-center gap-4 p-3 bg-[#0c0e1d]/50 backdrop-blur-sm rounded-lg border border-purple-500/30"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="bg-purple-500/20 p-2 rounded-full">
                    <Mail className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-medium text-white">{user?.email}</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-center gap-4 p-3 bg-[#0c0e1d]/50 backdrop-blur-sm rounded-lg border border-purple-500/30"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <div className="bg-purple-500/20 p-2 rounded-full">
                    <Phone className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Phone Number</p>
                    <p className="font-medium text-white">
                      {phone || 'Not provided'}
                    </p>
                  </div>
                </motion.div>
              </div>

              <motion.div 
                className="bg-[#0c0e1d]/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30 flex flex-col justify-center"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <h3 className="text-lg font-semibold text-purple-300 mb-3">Your Activity</h3>
                <div className="grid grid-cols-2 gap-4">
                  <motion.div 
                    className="bg-[#1e213a]/50 backdrop-blur-sm p-3 rounded-lg border border-blue-500/30 text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-2xl font-bold text-blue-400">{lostItems.length}</p>
                    <p className="text-sm text-gray-400">Lost Items</p>
                  </motion.div>
                  <motion.div 
                    className="bg-[#1e213a]/50 backdrop-blur-sm p-3 rounded-lg border border-yellow-500/30 text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-2xl font-bold text-yellow-400">{foundItems.length}</p>
                    <p className="text-sm text-gray-400">Found Items</p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.section>

        {/* History Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-6xl mx-auto mt-12"
        >
          <motion.h2 
            className="text-2xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            My Lost & Found History
          </motion.h2>

          {loading ? (
            <motion.div 
              className="flex justify-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
            </motion.div>
          ) : error ? (
            <motion.div 
              className="bg-[#1e213a]/50 backdrop-blur-sm rounded-xl border border-red-500/30 p-6 text-center text-red-400"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {error}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* LOST Items */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h3 className="text-xl font-semibold text-blue-400 mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Lost Items ({lostItems.length})
                </h3>
                {lostItems.length === 0 ? (
                  <motion.div 
                    className="bg-[#1e213a]/50 backdrop-blur-sm rounded-xl border border-blue-500/30 p-6 text-center text-gray-400"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    No lost items reported yet
                  </motion.div>
                ) : (
                  <AnimatePresence>
                    {lostItems.map((item, index) => (
                      <motion.div
                        key={item._id}
                        className="bg-[#1e213a]/50 backdrop-blur-sm rounded-xl border border-blue-500/30 p-5 mb-4 flex gap-4 relative hover:shadow-lg transition-all"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-blue-500/30">
                          <img
                            src={item.itemPhoto || DefaultImage}
                            alt={item.itemName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between">
                            <h4 className="text-lg font-semibold text-white">{item.itemName}</h4>
                            <span className="bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full text-xs font-medium border border-blue-500/30">
                              LOST
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 flex items-start gap-2">
                            <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                            <span>{item.itemDescription || 'No description'}</span>
                          </p>
                          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                            <p className="text-gray-300 flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-blue-400" />
                              <span>{item.itemLocation || 'Unknown location'}</span>
                            </p>
                            <p className="text-gray-300 flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-blue-400" />
                              <span>{formatDate(item.createdAt)}</span>
                            </p>
                            {item.itemCategory && (
                              <p className="text-gray-300 flex items-center gap-2">
                                <Tag className="w-4 h-4 text-blue-400" />
                                <span>{item.itemCategory}</span>
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-3 pr-1">
                          <motion.button
                            onClick={() => handleEdit(item._id || item.id)}
                            className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-full transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label="Edit item"
                          >
                            <Edit className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(item._id || item.id)}
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-full transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label="Delete item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </motion.div>

              {/* FOUND Items */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <h3 className="text-xl font-semibold text-yellow-400 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Found Items ({foundItems.length})
                </h3>
                {foundItems.length === 0 ? (
                  <motion.div 
                    className="bg-[#1e213a]/50 backdrop-blur-sm rounded-xl border border-yellow-500/30 p-6 text-center text-gray-400"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    No found items posted yet
                  </motion.div>
                ) : (
                  <AnimatePresence>
                    {foundItems.map((item, index) => (
                      <motion.div
                        key={item._id}
                        className="bg-[#1e213a]/50 backdrop-blur-sm rounded-xl border border-yellow-500/30 p-5 mb-4 flex gap-4 relative hover:shadow-lg transition-all"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-yellow-500/30">
                          <img
                            src={item.itemPhoto || DefaultImage}
                            alt={item.itemName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between">
                            <h4 className="text-lg font-semibold text-white">{item.itemName}</h4>
                            <span className="bg-yellow-500/20 text-yellow-300 px-2.5 py-0.5 rounded-full text-xs font-medium border border-yellow-500/30">
                              FOUND
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 flex items-start gap-2">
                            <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-yellow-400" />
                            <span>{item.itemDescription || 'No description'}</span>
                          </p>
                          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                            <p className="text-gray-300 flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-yellow-400" />
                              <span>{item.itemLocation || 'Unknown location'}</span>
                            </p>
                            <p className="text-gray-300 flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-yellow-400" />
                              <span>{formatDate(item.createdAt)}</span>
                            </p>
                            {item.itemCategory && (
                              <p className="text-gray-300 flex items-center gap-2">
                                <Tag className="w-4 h-4 text-yellow-400" />
                                <span>{item.itemCategory}</span>
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-3 pr-1">
                          <motion.button
                            onClick={() => handleEdit(item._id || item.id)}
                            className="p-1.5 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20 rounded-full transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label="Edit item"
                          >
                            <Edit className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(item._id || item.id)}
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-full transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label="Delete item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </motion.div>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
};

export default ProfilePage;