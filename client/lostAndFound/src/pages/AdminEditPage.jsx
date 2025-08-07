import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Save, 
  MapPin,
  Calendar,
  Phone,
  Mail,
  Search,
  Package
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/axiosConfig";
import Swal from 'sweetalert2';

const AdminEditPage = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    itemName: "",
    itemCategory: "other",
    itemLocation: "",
    itemDate: "",
    itemDescription: "",
    itemType: "lost",
    email: "",
    phone: "",
    itemPhoto: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [particles, setParticles] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

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

  const categories = [
    { value: "electronics", label: "Electronics" },
    { value: "wallet", label: "Wallet/Purse" },
    { value: "jewelry", label: "Jewelry" },
    { value: "clothing", label: "Clothing" },
    { value: "documents", label: "Documents" },
    { value: "other", label: "Other" }
  ];

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/admin/login");
      return;
    }
    fetchPost();
  }, [id, user, navigate]);

  const fetchPost = async () => {
    try {
      console.log("Fetching post with ID:", id);
      const response = await api.get(`/user-reports/report/${id}`);
      const post = response.data;
      console.log("Received post data:", post);
      setFormData({
        itemName: post.itemName || "",
        itemCategory: post.itemCategory || "other",
        itemLocation: post.itemLocation || "",
        itemDate: post.itemDate ? post.itemDate.split('T')[0] : "",
        itemDescription: post.itemDescription || "",
        itemType: post.itemType || "lost",
        email: post.email || "",
        phone: post.phone || "",
        itemPhoto: post.itemPhoto || ""
      });
    } catch (error) {
      console.error("Error fetching post:", error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to load post: ' + (error.response?.data || error.message || "Please try again."),
        icon: 'error',
        background: '#1e213a',
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-white font-bold',
          htmlContainer: 'text-gray-300'
        }
      }).then(() => {
        navigate("/admin/dashboard");
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          itemPhoto: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      itemPhoto: ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      console.log("Updating post with ID:", id);
      console.log("Form data:", formData);
      const response = await api.put(`/user-reports/report-update/${id}`, formData);
      console.log("Update response:", response.data);
      
      if (response.data && response.data.includes("successfully")) {
        Swal.fire({
          title: 'Updated!',
          text: 'Post has been updated successfully.',
          icon: 'success',
          background: '#1e213a',
          showConfirmButton: false,
          timer: 1000,
          customClass: {
            popup: 'rounded-xl shadow-2xl',
            title: 'text-white font-bold',
            htmlContainer: 'text-gray-300'
          }
        }).then(() => {
          navigate("/admin/dashboard");
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: response.data || "Failed to update post",
          icon: 'error',
          background: '#1e213a',
          customClass: {
            popup: 'rounded-xl shadow-2xl',
            title: 'text-white font-bold',
            htmlContainer: 'text-gray-300'
          }
        });
      }
    } catch (error) {
      console.error("Error updating post:", error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update post: ' + (error.response?.data || error.message || "Please try again."),
        icon: 'error',
        background: '#1e213a',
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-white font-bold',
          htmlContainer: 'text-gray-300'
        }
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0e1d] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
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

      {/* Header */}
      <motion.header 
        className="bg-[#1e213a]/50 backdrop-blur-sm shadow-sm border-b border-purple-500/30 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => navigate("/admin/dashboard")}
                className="text-gray-300 hover:text-purple-300 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <motion.h1 
                className="text-2xl font-bold text-white bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Lost And Found - Edit Post
              </motion.h1>
            </div>
            <span className="bg-purple-500/20 text-purple-300 text-xs font-medium px-2.5 py-0.5 rounded-full border border-purple-500/30">
              Admin
            </span>
          </div>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#1e213a]/50 backdrop-blur-sm rounded-lg shadow-sm border border-purple-500/30"
        >
          <div className="px-6 py-4 border-b border-purple-500/30">
            <h2 className="text-lg font-medium text-white">Edit Post Details</h2>
            <p className="text-sm text-gray-300 mt-1">
              Update the lost or found item post
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Error/Success Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg text-sm"
              >
                {success}
              </motion.div>
            )}

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Enter item name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Item Type *
                </label>
                <select
                  name="itemType"
                  value={formData.itemType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  required
                >
                  <option value="lost">Lost</option>
                  <option value="found">Found</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  name="itemCategory"
                  value={formData.itemCategory}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  required
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="itemDate"
                  value={formData.itemDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="itemLocation"
                  value={formData.itemLocation}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Enter location where item was lost/found"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="itemDescription"
                value={formData.itemDescription}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-600/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                placeholder="Describe the item in detail..."
                required
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contact Email (Read-only)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    className="w-full pl-10 pr-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-white cursor-not-allowed"
                    placeholder="Contact email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contact Phone (Read-only)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    readOnly
                    className="w-full pl-10 pr-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-white cursor-not-allowed"
                    placeholder="Contact phone number"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Item Photo
              </label>
              <div className="space-y-4">
                {formData.itemPhoto ? (
                  <div className="relative">
                    <img
                      src={formData.itemPhoto}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg border border-purple-500/30"
                    />
                    <motion.button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <span className="text-purple-400 hover:text-purple-300 font-medium">
                          Upload a photo
                        </span>
                        <span className="text-gray-400"> or drag and drop</span>
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-purple-500/30">
              <motion.button
                type="button"
                onClick={() => navigate("/admin/dashboard")}
                className="px-6 py-2 border border-slate-600/50 rounded-lg text-gray-300 hover:bg-slate-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Post
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminEditPage; 