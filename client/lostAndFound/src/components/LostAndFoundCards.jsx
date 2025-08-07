import { motion } from "framer-motion";
import { Package, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PostFoundModal from "./PostFoundModal";
import PostLostModal from "./PostLostModal";
import { useAuth } from "../context/AuthContext";
import { createPortal } from 'react-dom';
import Swal from 'sweetalert2';

const LostAndFoundCards = () => {
  const [showFoundModal, setShowFoundModal] = useState(false);
  const [showLostModal, setShowLostModal] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const closeModals = () => {
    setShowFoundModal(false);
    setShowLostModal(false);
  };

  return (
    <>
      <section className="w-full py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          viewport={{ once: false, margin: "-50px" }}
          className="text-center mb-16"
        >
          <h2 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
            Report Lost & Found Items
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">
            Help reunite lost items with their owners or report items you've found
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 px-4">
          {/* Post Lost Card - Left Side */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ 
              scale: 1.05, 
              y: -10,
              boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.6)"
            }}
            transition={{ duration: 0.1 }}
            viewport={{ once: false, margin: "-50px" }}
            className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm p-10 rounded-3xl border border-slate-600/50 hover:border-blue-400 transition-all duration-200 hover:shadow-2xl hover:shadow-blue-400/20 group cursor-pointer"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-150">
                <Package className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Post a Lost Item</h3>
              <p className="text-slate-300 mb-8 text-lg">
                Lost something valuable? Let our caring community help you find it quickly and safely.
              </p>
              <button 
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
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-2xl font-semibold text-xl transition-all duration-150 hover:scale-105"
              >
                Report Lost Item
              </button>
            </div>
          </motion.div>

          {/* Post Found Card - Right Side */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ 
              scale: 1.05, 
              y: -10,
              boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.6)"
            }}
            transition={{ duration: 0.1 }}
            viewport={{ once: false, margin: "-50px" }}
            className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 backdrop-blur-sm p-10 rounded-3xl border border-slate-600/50 hover:border-yellow-400 transition-all duration-200 hover:shadow-2xl hover:shadow-yellow-400/20 group cursor-pointer"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-150">
                <Search className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Post a Found Item</h3>
              <p className="text-slate-300 mb-8 text-lg">
                Found something? Help reunite it with its rightful owner and make someone's day.
              </p>
              <button 
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
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-slate-900 rounded-2xl font-semibold text-xl transition-all duration-150 hover:scale-105"
              >
                Report Found Item
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Render modals using Portal to ensure they appear above everything */}
      {showLostModal && createPortal(
        <PostLostModal
          isOpen={showLostModal}
          onClose={closeModals}
        />,
        document.body
      )}

      {showFoundModal && createPortal(
        <PostFoundModal
          isOpen={showFoundModal}
          onClose={closeModals}
        />,
        document.body
      )}
    </>
  );
};

export default LostAndFoundCards;