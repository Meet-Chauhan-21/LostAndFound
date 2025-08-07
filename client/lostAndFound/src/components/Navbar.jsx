import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Package, User, Shield, Search } from "lucide-react";
import PostFoundModal from "./PostFoundModal";
import PostLostModal from "./PostLostModal";
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import { createPortal } from 'react-dom';

const RippleButton = ({ children, className, onClick, ...props }) => {
  const [ripples, setRipples] = useState([]);
  const rippleId = useRef(0);

  const addRipple = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newRipple = { x, y, id: rippleId.current++ };
    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 600);

    if (onClick) onClick(event);
  };

  return (
    <button
      className={`relative overflow-hidden focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 focus:outline-none ${className}`}
      onClick={addRipple}
      {...props}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white opacity-30 animate-ripple pointer-events-none"
          style={{
            left: ripple.x - 20,
            top: ripple.y - 20,
            width: 40,
            height: 40,
          }}
        />
      ))}
    </button>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showFoundModal, setShowFoundModal] = useState(false);
  const [showLostModal, setShowLostModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const closeModals = () => {
    setShowFoundModal(false);
    setShowLostModal(false);
  };

const handleLogout = () => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you really want to logout?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#8b5cf6',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, logout',
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
  }).then((result) => {
    if (result.isConfirmed) {
      logout();
      navigate("/login");
      Swal.fire({
        title: 'Logged out!',
        text: 'You have been successfully logged out.',
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
    }
  });
};

  // Function to check if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Function to get active link styles
  const getActiveStyles = (path) => {
    return isActive(path) 
      ? "text-white bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-semibold" 
      : "text-slate-300 hover:text-white transition-colors";
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
          {/* Logo */}
            <Link to="/home" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-400 bg-clip-text text-transparent">
                Lost&Found
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link
                to="/HowItWorksPage"
                className={getActiveStyles("/HowItWorksPage")}
              >
                How It Works
              </Link>
              <Link
                to="/ServicesPage"
                className={getActiveStyles("/ServicesPage")}
              >
                Our Service
            </Link>
              <Link
                to="/ContactPage"
                className={getActiveStyles("/ContactPage")}
              >
              Contact
            </Link>
            </nav>

            {/* Interactive Post Buttons */}
            <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated() ? (
              <>
                  <RippleButton
                  onClick={() => setShowLostModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg"
                  >
                    <Package className="w-4 h-4" />
                    <span className="hidden lg:block">Post Lost</span>
                  </RippleButton>
                  <RippleButton
                  onClick={() => setShowFoundModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg"
                >
                    <Search className="w-4 h-4" />
                    <span className="hidden lg:block">Post Found</span>
                  </RippleButton>
              </>
            ) : (
              <>
                  <RippleButton 
                    onClick={() => {
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
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg"
                  >
                    <Package className="w-4 h-4" />
                    <span className="hidden lg:block">Post Lost</span>
                  </RippleButton>
                  <RippleButton 
                    onClick={() => {
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
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg"
                  >
                    <Search className="w-4 h-4" />
                    <span className="hidden lg:block">Post Found</span>
                  </RippleButton>
              </>
            )}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-3">
            {user ? (
                <div className="flex items-center gap-3 text-slate-300">
                {user.isAdmin ? (
                    <RippleButton
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg"
                      onClick={() => navigate("/admin/dashboard")}
                    >
                      <Shield className="w-4 h-4" />
                      <span className="hidden lg:block">Admin Dashboard</span>
                    </RippleButton>
                  ) : (
                    <RippleButton
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg"
                      onClick={() => navigate("/ProfilePage")}
                    >
                      <User className="w-4 h-4" />
                      <span className="hidden lg:block">{user.name}</span>
                    </RippleButton>
                  )}
                <button
                  onClick={handleLogout}
                    className="px-3 py-2 text-red-400 hover:text-red-300 transition-colors text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                    to="/login"
                    className="px-3 py-2 text-slate-300 hover:text-white transition-colors text-sm"
                >
                    Sign In
                  </Link>
                  <Link to="/register">
                    <RippleButton className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 text-sm">
                  Get Started
                    </RippleButton>
                </Link>
                {/* Admin Link - Only show for non-logged in users */}
                <Link 
                  to="/admin/login" 
                  className="px-3 py-2 text-slate-400 hover:text-slate-300 transition-colors text-sm"
                  title="Admin Access"
                >
                  Admin
                </Link>
              </>
            )}
          </div>

            {/* Mobile Menu Button */}
          <button
              className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-slate-700">
              <nav className="flex flex-col space-y-4 pt-4">
                <Link
                  to="/HowItWorksPage"
                  className={getActiveStyles("/HowItWorksPage")}
                  onClick={() => setIsOpen(false)}
                >
                  How It Works
                </Link>
                <Link
                  to="/ServicesPage"
                  className={getActiveStyles("/ServicesPage")}
                  onClick={() => setIsOpen(false)}
                >
                  Our Service
                </Link>
                <Link
                  to="/ContactPage"
                  className={getActiveStyles("/ContactPage")}
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </Link>
                <div className="flex flex-col space-y-3 pt-4">
                  {isAuthenticated() ? (
                    <div className="flex gap-3">
                      <RippleButton
                        onClick={() => {
                          setShowLostModal(true);
                          setIsOpen(false);
                        }}
                        className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium flex items-center justify-center gap-2"
                      >
                        <Package className="w-4 h-4" />
                        Post Lost
                      </RippleButton>
                      <RippleButton
                        onClick={() => {
                          setShowFoundModal(true);
                          setIsOpen(false);
                        }}
                        className="flex-1 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-medium flex items-center justify-center gap-2"
                      >
                        <Search className="w-4 h-4" />
                        Post Found
                      </RippleButton>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <RippleButton 
                        onClick={() => {
                          setIsOpen(false);
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
                        }}
                        className="w-full py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium flex items-center justify-center gap-2"
                      >
                        <Package className="w-4 h-4" />
                        Post Lost
                      </RippleButton>
                      <RippleButton 
                        onClick={() => {
                          setIsOpen(false);
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
                        }}
                        className="w-full py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-medium flex items-center justify-center gap-2"
                      >
                        <Search className="w-4 h-4" />
                        Post Found
                      </RippleButton>
                    </div>
                  )}
                  {user ? (
                    <div className="flex flex-col space-y-2">
                      {user.isAdmin ? (
                        <RippleButton
                          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium w-fit flex items-center gap-2"
                          onClick={() => {
                            navigate("/admin/dashboard");
                            setIsOpen(false);
                          }}
                        >
                          <Shield className="w-4 h-4" />
                          Admin Dashboard
                        </RippleButton>
                      ) : (
                        <RippleButton
                          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium w-fit flex items-center gap-2"
                          onClick={() => {
                            navigate("/ProfilePage");
                            setIsOpen(false);
                          }}
                        >
                          <User className="w-4 h-4" />
                          {user.name}
                        </RippleButton>
                      )}
                  <button
                    onClick={handleLogout}
                        className="text-left text-red-400 hover:text-red-300 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                        className="text-left text-slate-300 hover:text-white transition-colors"
                        onClick={() => setIsOpen(false)}
                  >
                        Sign In
                  </Link>
                      <Link to="/register" onClick={() => setIsOpen(false)}>
                        <RippleButton className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium w-fit">
                    Get Started
                        </RippleButton>
                  </Link>
                </>
              )}
            </div>
              </nav>
          </div>
        )}
      </div>
    </header>

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

export default Navbar;
