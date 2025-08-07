import { useState, useEffect, useRef } from "react";
import { X, Camera, MapPin, Calendar, FileText, Mail, Phone } from "lucide-react";
import Swal from "sweetalert2";
import api from "../utils/axiosConfig";
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from "framer-motion";

const PostFoundModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    itemType: "found",
    itemName: "",
    category: "",
    locationFound: "",
    dateFound: "",
    description: "",
    email: "",
    phone: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [myEmail, setMyEmail] = useState("");
  const [myPhone, setMyPhone] = useState("");
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user && user.email) {
          const res = await api.get(
            `/lostAndFound/getUser/${encodeURIComponent(user.email)}`
          );

          setMyEmail(res.data.email);
          setMyPhone(res.data.phone);
          setFormData(prev => ({
            ...prev,
            email: res.data.email,
            phone: res.data.phone
          }));
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    if (isOpen && user) {
      fetchUserData();
    }
  }, [isOpen, user]);

  const resetForm = () => {
    setFormData({
      itemType: "found",
      itemName: "",
      category: "",
      locationFound: "",
      dateFound: "",
      description: "",
      email: myEmail,
      phone: myPhone,
    });
    setSelectedImage(null);
    setImageFile(null);
  };

  const validateForm = async () => {
    if (!formData.itemName.trim()) {
      await Swal.fire({
        icon: 'error',
        title: 'Missing Item Name',
        text: 'Please enter the name of the found item',
        confirmButtonColor: '#f59e0b',
        background: '#1e213a',
        backdrop: 'rgba(0,0,0,0.4)',
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-white font-bold',
          htmlContainer: 'text-gray-300',
          confirmButton: 'rounded-lg px-6 py-2 font-medium'
        }
      });
      return false;
    }

    if (!formData.category) {
      await Swal.fire({
        icon: 'error',
        title: 'Missing Category',
        text: 'Please select a category for the found item',
        confirmButtonColor: '#f59e0b',
        background: '#1e213a',
        backdrop: 'rgba(0,0,0,0.4)',
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-white font-bold',
          htmlContainer: 'text-gray-300',
          confirmButton: 'rounded-lg px-6 py-2 font-medium'
        }
      });
      return false;
    }

    if (!formData.locationFound.trim()) {
      await Swal.fire({
        icon: 'error',
        title: 'Missing Location',
        text: 'Please enter where you found the item',
        confirmButtonColor: '#f59e0b',
        background: '#1e213a',
        backdrop: 'rgba(0,0,0,0.4)',
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-white font-bold',
          htmlContainer: 'text-gray-300',
          confirmButton: 'rounded-lg px-6 py-2 font-medium'
        }
      });
      return false;
    }

    if (!formData.dateFound) {
      await Swal.fire({
        icon: 'error',
        title: 'Missing Date',
        text: 'Please enter when you found the item',
        confirmButtonColor: '#f59e0b',
        background: '#1e213a',
        backdrop: 'rgba(0,0,0,0.4)',
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-white font-bold',
          htmlContainer: 'text-gray-300',
          confirmButton: 'rounded-lg px-6 py-2 font-medium'
        }
      });
      return false;
    }

    if (!formData.description.trim()) {
      await Swal.fire({
        icon: 'error',
        title: 'Missing Description',
        text: 'Please describe the found item',
        confirmButtonColor: '#f59e0b',
        background: '#1e213a',
        backdrop: 'rgba(0,0,0,0.4)',
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-white font-bold',
          htmlContainer: 'text-gray-300',
          confirmButton: 'rounded-lg px-6 py-2 font-medium'
        }
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!(await validateForm())) {
      return;
    }

    try {
      // Convert image to base64 if exists
      let base64Image = "";
      if (imageFile) {
        base64Image = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(imageFile);
          reader.onload = () => resolve(reader.result);
        });
      }

      const reportData = {
        itemType: "found",
        itemName: formData.itemName,
        itemCategory: formData.category,
        itemLocation: formData.locationFound,
        itemDate: formData.dateFound,
        itemDescription: formData.description,
        itemPhoto: base64Image,
        email: formData.email,
        phone: formData.phone,
      };

      const contactValue = formData.email;
      const response = await api.post(
        `/user-reports/user-entry/${contactValue}`,
        reportData
      );

      if (response.data.startsWith("Success")) {
        await Swal.fire({
          icon: 'success',
          title: 'Report Submitted!',
          text: 'Your found item has been reported successfully',
          showConfirmButton: false,
          timer: 1000,
          background: '#1e213a',
          backdrop: 'rgba(0,0,0,0.4)',
          customClass: {
            popup: 'rounded-xl shadow-2xl',
            title: 'text-white font-bold',
            htmlContainer: 'text-gray-300'
          }
        });
        resetForm();
        onClose();
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Duplicate Report',
          text: 'This item has already been reported',
          confirmButtonColor: '#f59e0b',
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
    } catch (error) {
      console.error('Error posting found item:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to post found item. Please try again.',
        confirmButtonColor: '#f59e0b',
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
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      resetForm();
      onClose();
      setIsClosing(false);
    }, 100);
  };

  // Reset isClosing when form opens
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="bg-[#0c0e1d] rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-yellow-500/30"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <form onSubmit={handleSubmit} className="h-full flex flex-col">
              {/* Modal Header */}
              <motion.div 
                className="flex-shrink-0 p-6 border-b border-yellow-500/30 flex justify-between items-center bg-gradient-to-r from-yellow-500 to-orange-500 z-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold text-white">Report Found Item</h2>
                <button 
                  type="button"
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-yellow-600 transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </motion.div>

              {/* Modal Content - Split Layout */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid lg:grid-cols-2 gap-0 h-full">
                  {/* Left Section - Item Details */}
                  <motion.div 
                    className="p-6 space-y-4 bg-[#1e213a]/50 backdrop-blur-sm"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {/* Item Details */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-slate-300 mb-2 font-medium">Item Name *</label>
                        <input
                          type="text"
                          value={formData.itemName}
                          onChange={(e) => setFormData({...formData, itemName: e.target.value})}
                          className="w-full p-3 border border-slate-600/50 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all bg-slate-800/60 backdrop-blur-sm text-white placeholder-slate-400"
                          placeholder="What did you find?"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 mb-2 font-medium">Category *</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full p-3 border border-slate-600/50 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all bg-slate-800/60 backdrop-blur-sm text-white"
                        >
                          <option value="">Select a category</option>
                          <option value="electronics">Electronics</option>
                          <option value="wallet">Wallet/Purse</option>
                          <option value="jewelry">Jewelry</option>
                          <option value="clothing">Clothing</option>
                          <option value="documents">Documents</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* Location & Date */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-slate-300 mb-2 font-medium">Location Found *</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                          <input
                            type="text"
                            value={formData.locationFound}
                            onChange={(e) => setFormData({...formData, locationFound: e.target.value})}
                            className="w-full pl-10 p-3 border border-slate-600/50 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all bg-slate-800 text-white placeholder-slate-400"
                            placeholder="Where did you find it?"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-300 mb-2 font-medium">Date Found *</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                          <input
                            type="date"
                            value={formData.dateFound}
                            onChange={(e) => setFormData({...formData, dateFound: e.target.value})}
                            max={new Date().toISOString().split('T')[0]}
                            className="w-full pl-10 p-3 border border-slate-600/50 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all bg-slate-800 text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-slate-300 mb-2 font-medium">Description *</label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 text-slate-400 w-5 h-5 pointer-events-none" />
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          rows={3}
                          className="w-full pl-10 p-3 border border-slate-600/50 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all bg-slate-800 text-white placeholder-slate-400"
                          placeholder="Describe the item in detail (color, brand, distinguishing features)"
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Right Section - Image Upload & Contact Info */}
                  <motion.div 
                    className="p-6 space-y-4 bg-[#0c0e1d]"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    {/* Image Upload */}
                    <div>
                      <label className="block text-slate-300 mb-2 font-medium">Upload Photo</label>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="border-2 border-dashed border-slate-600/50 rounded-lg p-4 text-center hover:border-yellow-400 transition-all bg-slate-800/60 backdrop-blur-sm">
                          {selectedImage ? (
                            <div className="space-y-2">
                              <img 
                                src={selectedImage} 
                                alt="Preview" 
                                className="max-h-32 mx-auto rounded-lg shadow-md"
                              />
                              <button 
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedImage(null);
                                  setImageFile(null);
                                }}
                                className="text-sm text-yellow-400 hover:text-yellow-300 font-medium"
                              >
                                Change Photo
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Camera className="w-8 h-8 mx-auto text-slate-400" />
                              <p className="text-slate-300 font-medium text-sm">Drag & drop a photo or click to browse</p>
                              <p className="text-xs text-slate-500">Supports JPG, PNG (Max 5MB)</p>
                            </div>
                          )}
                        </div>
                      </label>
                      <input 
                        id="file-upload"
                        ref={fileInputRef}
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                              Swal.fire({
                                icon: 'error',
                                title: 'File Too Large',
                                text: 'Please select an image smaller than 5MB',
                                confirmButtonColor: '#f59e0b',
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
                            setImageFile(file);
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setSelectedImage(event.target.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-200 border-b border-slate-700 pb-2">Contact Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-slate-300 mb-2 font-medium">Email</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                            <input
                              type="email"
                              value={formData.email}
                              readOnly
                              className="w-full pl-10 p-3 border border-slate-600/50 rounded-lg bg-slate-800 text-slate-300 cursor-not-allowed"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-300 mb-2 font-medium">Phone Number</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                            <input
                              type="tel"
                              value={formData.phone}
                              readOnly
                              className="w-full pl-10 p-3 border border-slate-600/50 rounded-lg bg-slate-800 text-slate-300 cursor-not-allowed"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all font-medium shadow-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Submit Found Item Report
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PostFoundModal;