import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  FileText, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  LogOut, 
  Home,
  Search,
  Filter,
  Calendar,
  MapPin,
  Phone,
  Mail,
  X,
  Shield,
  User,
  Tag,
  Info
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/axiosConfig";
import DefaultImage from "../assets/Lost_And_Found.png";
import Swal from 'sweetalert2';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [adminHistory, setAdminHistory] = useState([]);
  const [adminPhone, setAdminPhone] = useState("9265379915");
  const [adminCreatedAt, setAdminCreatedAt] = useState("");
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
    if (!user || !user.isAdmin) {
      navigate("/admin/login");
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch users, posts, and admin data in parallel
      const [usersResponse, postsResponse, adminPostsResponse, adminUserResponse] = await Promise.all([
        api.get("/lostAndFound/getAllUsers"),
        api.get("/user-reports/all"),
        api.get(`/lostAndFound/user-history/${user.email}`),
        api.get(`/lostAndFound/getUser/${encodeURIComponent(user.email)}`)
      ]);
      
      console.log("Users response:", usersResponse.data);
      console.log("Posts response:", postsResponse.data);
      console.log("Admin posts response:", adminPostsResponse.data);
      console.log("Admin user data:", adminUserResponse.data);
      
      setUsers(usersResponse.data || []);
      setPosts(postsResponse.data || []);
      setAdminHistory(adminPostsResponse.data || []);
      console.log("Admin user response data:", adminUserResponse.data);
      console.log("Admin phone from response:", adminUserResponse.data.phone);
      const phoneFromResponse = adminUserResponse.data.phone;
      console.log("Phone from response:", phoneFromResponse);
      setAdminPhone(phoneFromResponse && phoneFromResponse.trim() !== "" ? phoneFromResponse : "9265379915");
      setAdminCreatedAt(adminUserResponse.data.createdAt);
    } catch (error) {
      console.error("Error fetching data:", error);
      // If admin user fetch fails, keep the default phone number
      if (error.response?.status === 404) {
        console.log("Admin user not found, using default phone number");
        setAdminPhone("9265379915");
      } else {
        console.log("Other error occurred, using default phone number");
        setAdminPhone("9265379915");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this post?",
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
    });

    if (result.isConfirmed) {
      try {
        console.log("Deleting post with ID:", postId);
        const response = await api.delete(`/user-reports/items-delete/${postId}`);
        console.log("Delete response:", response.data);
        if (response.data && response.data.includes("successfully")) {
          setPosts(posts.filter(post => (post._id || post.id) !== postId));
          Swal.fire({
            title: 'Deleted!',
            text: 'Post has been deleted successfully.',
            icon: 'success',
            background: '#1e213a',
            showConfirmButton: false,
            timer: 1000,
            customClass: {
              popup: 'rounded-xl shadow-2xl',
              title: 'text-white font-bold',
              htmlContainer: 'text-gray-300'
            }
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to delete post: ' + (response.data || "Unknown error"),
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
        console.error("Error deleting post:", error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete post: ' + (error.response?.data || error.message),
          icon: 'error',
          background: '#1e213a',
          customClass: {
            popup: 'rounded-xl shadow-2xl',
            title: 'text-white font-bold',
            htmlContainer: 'text-gray-300'
          }
        });
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const handleAdminEdit = (itemId) => {
    console.log("Editing admin post with ID:", itemId);
    navigate(`/admin/edit/${itemId}`);
  };

  const handleAdminDelete = async (itemId) => {
    console.log("Deleting admin post with ID:", itemId);
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this post?",
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
    });

    if (result.isConfirmed) {
      try {
        const response = await api.delete(`/user-reports/items-delete/${itemId}`);
        if (response.data && response.data.includes("successfully")) {
          setAdminHistory(prev => prev.filter(item => (item._id || item.id) !== itemId));
          Swal.fire({
            title: 'Deleted!',
            text: 'Post has been deleted successfully.',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000,
            background: '#1e213a',
            customClass: {
              popup: 'rounded-xl shadow-2xl',
              title: 'text-white font-bold',
              htmlContainer: 'text-gray-300'
            }
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to delete post: ' + (response.data || "Unknown error"),
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
        console.error("Error deleting admin post:", error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete post: ' + (error.response?.data || error.message),
          icon: 'error',
          background: '#1e213a',
          customClass: {
            popup: 'rounded-xl shadow-2xl',
            title: 'text-white font-bold',
            htmlContainer: 'text-gray-300'
          }
        });
      }
    }
  };

  const handleUserClick = async (user) => {
    try {
      // Fetch user's posts
      const response = await api.get(`/lostAndFound/user-history/${user.email}`);
      const userPosts = response.data || [];
      
      setSelectedUser({
        ...user,
        posts: userPosts
      });
      setShowUserModal(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
      alert("Failed to load user details");
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.itemDescription?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || post.itemType === filterType;
    return matchesSearch && matchesFilter;
  });

  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <motion.h1 
                className="text-2xl font-bold text-white bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Lost And Found
              </motion.h1>
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-bold px-4 py-2 rounded-full border border-purple-400/50 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <span className="flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                Admin
              </span>
              </motion.div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">Welcome, {user?.username}</span>
              <motion.button
                onClick={() => navigate("/")}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Home className="w-5 h-5" />
                <span className="text-sm font-medium">Home</span>
              </motion.button>
              <motion.button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Navigation Tabs */}
        <motion.div 
          className="flex space-x-1 bg-[#1e213a]/50 backdrop-blur-sm p-1 rounded-lg shadow-sm mb-8 border border-purple-500/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.button
            onClick={() => setActiveTab("users")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "users"
                ? "bg-purple-500 text-white"
                : "text-gray-300 hover:text-white"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Users ({users.length})
          </motion.button>
          <motion.button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "posts"
                ? "bg-purple-500 text-white"
                : "text-gray-300 hover:text-white"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Posts ({posts.length})
          </motion.button>
          <motion.button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "profile"
                ? "bg-purple-500 text-white"
                : "text-gray-300 hover:text-white"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Shield className="w-4 h-4 inline mr-2" />
            Admin Profile ({adminHistory.length})
          </motion.button>
        </motion.div>

        {/* Search and Filter */}
        <motion.div 
          className="bg-[#1e213a]/50 backdrop-blur-sm rounded-lg shadow-sm p-4 mb-6 border border-purple-500/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>
            {activeTab === "posts" && (
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-slate-600/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
              >
                <option value="all">All Types</option>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            )}
            <motion.button
              onClick={() => navigate("/admin/post")}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Post
            </motion.button>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "users" ? (
            <UsersTab users={filteredUsers} onUserClick={handleUserClick} />
          ) : activeTab === "posts" ? (
            <PostsTab posts={filteredPosts} onDelete={handleDeletePost} />
          ) : (
            <ProfileTab 
              adminHistory={adminHistory} 
              adminPhone={adminPhone} 
              adminCreatedAt={adminCreatedAt}
              onEdit={handleAdminEdit}
              onDelete={handleAdminDelete}
              formatDate={formatDate}
            />
          )}
        </motion.div>
      </div>

             {/* User Detail Modal */}
      <AnimatePresence>
       {showUserModal && selectedUser && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-[#1e213a] rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col border border-purple-500/30"
           >
              <div className="px-6 py-4 border-b border-purple-500/30 bg-[#0c0e1d] rounded-t-xl">
               <div className="flex justify-between items-center">
                 <div>
                    <h3 className="text-xl font-bold text-white">User Details</h3>
                    <p className="text-sm text-gray-300 mt-1">View user information and posts</p>
                 </div>
                  <motion.button
                   onClick={() => setShowUserModal(false)}
                    className="text-gray-400 hover:text-gray-300 p-2 hover:bg-slate-700 rounded-full transition-colors"
                 >
                   <X className="w-6 h-6" />
                  </motion.button>
               </div>
             </div>

              <div className="flex-1 overflow-y-auto p-6 bg-[#1e213a]">
                 <div className="flex gap-8">
                   {/* Left Side - User Details and Summary */}
                   <div className="w-1/2">
                     {/* User Info */}
                     <div className="mb-8">
                       <div className="flex items-center mb-6">
                                                   <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-6 shadow-lg">
                            <span className="text-white font-bold text-2xl">
                              {selectedUser.username?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                         <div>
                          <h4 className="text-2xl font-bold text-white mb-1">{selectedUser.username}</h4>
                          <p className="text-gray-300 text-lg">{selectedUser.email}</p>
                         </div>
                       </div>

                       <div className="grid grid-cols-1 gap-4">
                        <div className="bg-[#0c0e1d] p-4 rounded-lg border border-purple-500/30">
                          <label className="text-sm font-medium text-gray-400 block mb-2">Phone Number</label>
                          <p className="text-white font-medium">{selectedUser.phone || "Not provided"}</p>
                         </div>
                        <div className="bg-[#0c0e1d] p-4 rounded-lg border border-purple-500/30">
                          <label className="text-sm font-medium text-gray-400 block mb-2">Joined Date</label>
                          <p className="text-white font-medium">
                             {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : "Unknown"}
                           </p>
                         </div>
                       </div>
                     </div>

                     {/* Posts Summary */}
                     <div>
                      <h5 className="text-xl font-bold text-white mb-4">Posts Summary</h5>
                       <div className="space-y-4">
                        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-6 rounded-xl border border-blue-500/30">
                          <div className="text-3xl font-bold text-blue-400 mb-2">
                             {selectedUser.posts?.length || 0}
                           </div>
                          <div className="text-sm font-medium text-blue-300">Total Posts</div>
                         </div>
                        <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 p-6 rounded-xl border border-red-500/30">
                          <div className="text-3xl font-bold text-red-400 mb-2">
                             {selectedUser.posts?.filter(p => p.itemType === "lost").length || 0}
                           </div>
                          <div className="text-sm font-medium text-red-300">Lost Items</div>
                         </div>
                        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 p-6 rounded-xl border border-green-500/30">
                          <div className="text-3xl font-bold text-green-400 mb-2">
                             {selectedUser.posts?.filter(p => p.itemType === "found").length || 0}
                           </div>
                          <div className="text-sm font-medium text-green-300">Found Items</div>
                         </div>
                       </div>
                     </div>
                   </div>

                   {/* Right Side - Recent Posts */}
                   <div className="w-1/2">
                    <h5 className="text-xl font-bold text-white mb-4">Recent Posts</h5>
                     
                     {selectedUser.posts && selectedUser.posts.length > 0 ? (
                       <div className="space-y-4">
                         {selectedUser.posts.slice(0, 10).map((post) => {
                           const userPostId = post._id || post.id;
                           return (
                            <motion.div 
                              key={userPostId} 
                              className="bg-[#0c0e1d] border border-purple-500/30 rounded-xl p-4 hover:shadow-md transition-shadow"
                              whileHover={{ scale: 1.01 }}
                              transition={{ duration: 0.1 }}
                            >
                               <div className="flex justify-between items-start mb-3">
                                <h6 className="font-bold text-white text-lg">{post.itemName}</h6>
                                 <span
                                   className={`px-3 py-1 rounded-full text-xs font-bold ${
                                     post.itemType === "lost"
                                      ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                      : "bg-green-500/20 text-green-300 border border-green-500/30"
                                   }`}
                                 >
                                   {post.itemType?.toUpperCase()}
                                 </span>
                               </div>
                               
                              <div className="space-y-2 text-sm text-gray-300 mb-3">
                                 <div className="flex items-center">
                                   <MapPin className="w-4 h-4 mr-2" />
                                   <span>{post.itemLocation}</span>
                                 </div>
                                 <div className="flex items-center">
                                   <Calendar className="w-4 h-4 mr-2" />
                                   <span>{post.itemDate ? new Date(post.itemDate).toLocaleDateString() : "No date"}</span>
                                 </div>
                               </div>
                               
                              <p className="text-sm text-gray-400 line-clamp-2">
                                 {post.itemDescription}
                               </p>
                            </motion.div>
                           );
                         })}
                       </div>
                     ) : (
                       <div className="text-center py-8">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                           <FileText className="w-8 h-8 text-gray-400" />
                         </div>
                        <h5 className="text-lg font-medium text-white mb-2">No Posts Yet</h5>
                        <p className="text-gray-400">This user hasn't created any posts yet.</p>
                       </div>
                     )}
                   </div>
                 </div>
               </div>
           </motion.div>
         </div>
       )}
      </AnimatePresence>
    </div>
  );
};

const UsersTab = ({ users, onUserClick }) => (
  <div className="space-y-6">
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <motion.div 
        className="bg-[#1e213a]/50 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-purple-500/30"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center">
          <div className="bg-purple-500/20 p-3 rounded-full">
            <Users className="w-6 h-6 text-purple-400" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-400">Total Users</p>
            <p className="text-2xl font-bold text-white">{users.length}</p>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className="bg-[#1e213a]/50 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-purple-500/30"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center">
          <div className="bg-green-500/20 p-3 rounded-full">
            <User className="w-6 h-6 text-green-400" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-400">Active Users</p>
            <p className="text-2xl font-bold text-green-400">{users.length}</p>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className="bg-[#1e213a]/50 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-purple-500/30"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center">
          <div className="bg-blue-500/20 p-3 rounded-full">
            <Calendar className="w-6 h-6 text-blue-400" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-400">This Month</p>
            <p className="text-2xl font-bold text-blue-400">
              {users.filter(user => {
                const userDate = new Date(user.createdAt);
                const now = new Date();
                return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
              }).length}
            </p>
          </div>
        </div>
      </motion.div>
    </div>

    {/* Users Grid */}
    <div className="bg-[#1e213a]/50 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden border border-purple-500/30">
      <div className="px-6 py-4 border-b border-purple-500/30 bg-[#0c0e1d]/50 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white">Registered Users</h3>
        <p className="text-sm text-gray-300 mt-1">Click on any user to view their details and posts</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {users.map((user) => (
          <motion.div
            key={user._id}
            whileHover={{ scale: 1.02 }}
            className="bg-[#0c0e1d]/50 backdrop-blur-sm rounded-xl border border-purple-500/30 p-6 hover:shadow-lg transition-all cursor-pointer hover:border-purple-400"
            onClick={() => onUserClick(user)}
          >
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">
                  {user.username?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-lg font-semibold text-white">{user.username}</h4>
                <p className="text-sm text-purple-400">{user.email}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-300">
                <Phone className="w-4 h-4 mr-2 text-purple-400" />
                <span>{user.phone || "No phone provided"}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-300">
                <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                <span>
                  Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }) : "Unknown"}
                </span>
              </div>
              
              <div className="flex items-center text-sm text-gray-300">
                <Mail className="w-4 h-4 mr-2 text-purple-400" />
                <span className="truncate">{user.email}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-purple-500/30">
              <button 
                className="w-full bg-purple-500/20 text-purple-300 py-2 px-4 rounded-lg hover:bg-purple-500/30 transition-colors text-sm font-medium flex items-center justify-center border border-purple-500/30"
                onClick={(e) => {
                  e.stopPropagation();
                  onUserClick(user);
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

const PostsTab = ({ posts, onDelete }) => {
  const navigate = useNavigate();
  
  console.log("Posts in PostsTab:", posts);
  
  return (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => {
      console.log("Individual post:", post);
      const postId = post._id || post.id;
      console.log("Post ID:", postId);
      return (
        <motion.div
          key={postId}
          whileHover={{ scale: 1.02 }}
          className="bg-[#1e213a]/50 backdrop-blur-sm rounded-lg shadow-sm border border-purple-500/30 overflow-hidden"
        >
        {/* Image */}
        <div className="h-48 overflow-hidden">
          <img
            src={post.itemPhoto || DefaultImage}
            alt={post.itemName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-white line-clamp-1">
              {post.itemName}
            </h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                post.itemType === "lost"
                  ? "bg-red-500/20 text-red-300 border border-red-500/30"
                  : "bg-green-500/20 text-green-300 border border-green-500/30"
              }`}
            >
              {post.itemType?.toUpperCase()}
            </span>
          </div>

          <div className="space-y-2 text-sm text-gray-300 mb-4">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              {post.itemLocation}
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {post.itemDate ? new Date(post.itemDate).toLocaleDateString() : "N/A"}
            </div>
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              {post.email}
            </div>
            {post.phone && (
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                {post.phone}
              </div>
            )}
          </div>

          <p className="text-sm text-gray-400 mb-4 line-clamp-2">
            {post.itemDescription}
          </p>

                     {/* Actions */}
           <div className="flex justify-between items-center">
             <button
               onClick={() => navigate(`/detail/${postId}`, { state: { fromAdmin: true } })}
               className="text-purple-400 hover:text-purple-300 text-sm font-medium"
             >
               View Details
             </button>
             <div className="flex space-x-2">
               <button
                 onClick={() => navigate(`/admin/edit/${postId}`)}
                 className="text-gray-400 hover:text-gray-300"
               >
                 <Edit className="w-4 h-4" />
               </button>
               <button
                 onClick={() => onDelete(postId)}
                 className="text-red-400 hover:text-red-300"
               >
                 <Trash2 className="w-4 h-4" />
               </button>
             </div>
           </div>
        </div>
      </motion.div>
    );
    })}
  </div>
  );
};

const ProfileTab = ({ adminHistory, adminPhone, adminCreatedAt, onEdit, onDelete, formatDate }) => {
  const navigate = useNavigate();
  

  
  const lostItems = adminHistory.filter((item) => item.itemType === 'lost');
  const foundItems = adminHistory.filter((item) => item.itemType === 'found');

  return (
    <div className="space-y-8">
      {/* Admin Info Section */}
      <div className="bg-[#1e213a]/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-purple-500/30">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Lost And Found Admin</h1>
              <p className="text-purple-100">
                Admin since ∞
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-[#0c0e1d]/50 backdrop-blur-sm rounded-lg border border-purple-500/30">
              <div className="bg-purple-500/20 p-2 rounded-full">
                <Mail className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="font-medium text-white">laf@admin.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-[#0c0e1d]/50 backdrop-blur-sm rounded-lg border border-purple-500/30">
              <div className="bg-purple-500/20 p-2 rounded-full">
                <Phone className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Phone Number</p>
                <p className="font-medium text-white">
                  9265379915
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#0c0e1d]/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30 flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-purple-300 mb-3">Admin Activity</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1e213a]/50 backdrop-blur-sm p-3 rounded-lg border border-red-500/30 text-center">
                <p className="text-2xl font-bold text-red-400">{lostItems.length}</p>
                <p className="text-sm text-gray-400">Lost Items</p>
              </div>
              <div className="bg-[#1e213a]/50 backdrop-blur-sm p-3 rounded-lg border border-green-500/30 text-center">
                <p className="text-2xl font-bold text-green-400">{foundItems.length}</p>
                <p className="text-sm text-gray-400">Found Items</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Admin Lost & Found Posts</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LOST Items */}
          <div>
            <h3 className="text-xl font-semibold text-red-400 mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              Lost Items ({lostItems.length})
            </h3>
            {lostItems.length === 0 ? (
              <div className="bg-[#1e213a]/50 backdrop-blur-sm rounded-xl shadow-sm p-6 text-center text-gray-400 border border-red-500/30">
                No lost items posted yet
              </div>
            ) : (
              lostItems.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#1e213a]/50 backdrop-blur-sm rounded-xl shadow-sm p-5 mb-4 flex gap-4 relative border border-red-500/30 hover:shadow-md transition-all"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-red-500/30">
                    <img
                      src={item.itemPhoto || DefaultImage}
                      alt={item.itemName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between">
                      <h4 className="text-lg font-semibold text-white">{item.itemName}</h4>
                      <span className="bg-red-500/20 text-red-300 px-2.5 py-0.5 rounded-full text-xs font-medium border border-red-500/30">
                        LOST
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 flex items-start gap-2">
                      <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-400" />
                      <span>{item.itemDescription || 'No description'}</span>
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                      <p className="text-gray-300 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-purple-400" />
                        <span>{item.itemLocation || 'Unknown location'}</span>
                      </p>
                      <p className="text-gray-300 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-400" />
                        <span>{formatDate(item.createdAt)}</span>
                      </p>
                      {item.itemCategory && (
                        <p className="text-gray-300 flex items-center gap-2">
                          <Tag className="w-4 h-4 text-purple-400" />
                          <span>{item.itemCategory}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-3 pr-1">
                    <button
                      onClick={() => navigate(`/detail/${item._id || item.id}`, { state: { fromAdmin: true } })}
                      className="p-1.5 text-purple-400 hover:text-purple-300 hover:bg-purple-500/20 rounded-full transition-colors"
                      aria-label="View item"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onEdit(item._id || item.id)}
                      className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-full transition-colors"
                      aria-label="Edit item"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDelete(item._id || item.id)}
                      className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-full transition-colors"
                      aria-label="Delete item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* FOUND Items */}
          <div>
            <h3 className="text-xl font-semibold text-green-400 mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              Found Items ({foundItems.length})
            </h3>
            {foundItems.length === 0 ? (
              <div className="bg-[#1e213a]/50 backdrop-blur-sm rounded-xl shadow-sm p-6 text-center text-gray-400 border border-green-500/30">
                No found items posted yet
              </div>
            ) : (
              foundItems.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#1e213a]/50 backdrop-blur-sm rounded-xl shadow-sm p-5 mb-4 flex gap-4 relative border border-green-500/30 hover:shadow-md transition-all"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-green-500/30">
                    <img
                      src={item.itemPhoto || DefaultImage}
                      alt={item.itemName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between">
                      <h4 className="text-lg font-semibold text-white">{item.itemName}</h4>
                      <span className="bg-green-500/20 text-green-300 px-2.5 py-0.5 rounded-full text-xs font-medium border border-green-500/30">
                        FOUND
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 flex items-start gap-2">
                      <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-400" />
                      <span>{item.itemDescription || 'No description'}</span>
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                      <p className="text-gray-300 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-purple-400" />
                        <span>{item.itemLocation || 'Unknown location'}</span>
                      </p>
                      <p className="text-gray-300 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-400" />
                        <span>{formatDate(item.createdAt)}</span>
                      </p>
                      {item.itemCategory && (
                        <p className="text-gray-300 flex items-center gap-2">
                          <Tag className="w-4 h-4 text-purple-400" />
                          <span>{item.itemCategory}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-3 pr-1">
                    <button
                      onClick={() => navigate(`/detail/${item._id || item.id}`, { state: { fromAdmin: true } })}
                      className="p-1.5 text-purple-400 hover:text-purple-300 hover:bg-purple-500/20 rounded-full transition-colors"
                      aria-label="View item"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onEdit(item._id || item.id)}
                      className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-full transition-colors"
                      aria-label="Edit item"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDelete(item._id || item.id)}
                      className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-full transition-colors"
                      aria-label="Delete item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 