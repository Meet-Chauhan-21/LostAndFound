import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin, RefreshCw } from "lucide-react";
import api from "../utils/axiosConfig";
import DefaultImage from '../assets/Lost_And_Found.png'
import { useNavigate } from "react-router-dom";

const defaultImage = "https://via.placeholder.com/300x200?text=No+Image";

const RecentPosts = () => {
  const [posts, setPosts] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

    const fetchPosts = async () => {
    setLoading(true);
      try {
        const response = await api.get("/user-reports/latest");
      console.log("Recent posts response:", response.data);
        setPosts(response.data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
      }
    };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Refresh posts every 30 seconds to show new posts
  useEffect(() => {
    const interval = setInterval(fetchPosts, 30000);
    return () => clearInterval(interval);
  }, []);

  const visiblePosts = showAll ? posts.slice(0, 16) : posts.slice(0, 8);

    return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: false, margin: "-50px" }}
        className="relative mb-20"
      >
        <h2 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-center">
          Recent Lost & Found Posts
        </h2>
        <button
          onClick={fetchPosts}
          disabled={loading}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Loading...' : 'Refresh'}</span>
        </button>
      </motion.div>

      {loading && posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-300">Loading recent posts...</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16 max-w-7xl mx-auto">
        {visiblePosts.map((post, index) => (
          <motion.div
            key={post._id || post.id || index}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ 
              scale: 1.05, 
              y: -10,
              boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.6)"
            }}
            transition={{ duration: 0.2 }}
            viewport={{ once: false, margin: "-50px" }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-slate-700/50 group cursor-pointer hover:border-blue-500/50 hover:shadow-2xl flex flex-col"
          >
            {/* Image */}
            <div className="h-44 overflow-hidden">
              <img
                src={post.itemPhoto ? post.itemPhoto : DefaultImage}
                alt={post.itemName || "Lost/Found Item"}
                className="w-full h-full object-cover transition-all duration-300 ease-out group-hover:scale-110"
              />
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-white line-clamp-1">
                  {post.itemName}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    post.itemType === "lost"
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : "bg-green-500/20 text-green-400 border border-green-500/30"
                  }`}
                >
                  {post.itemType?.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center text-slate-400 text-sm mb-1">
                <Clock className="w-4 h-4 mr-2 text-green-400" />
                {new Date(post.createdAt).toLocaleDateString()}
              </div>

              <div className="flex items-center text-slate-400 text-sm mb-2">
                <MapPin className="w-4 h-4 mr-2 text-yellow-500" />
                {post.itemLocation}
              </div>

              {/* Description */}
              <p className="text-sm text-slate-300 mb-4 line-clamp-2">
                {post.itemDescription}
              </p>

              {/* View Details */}
              <div className="mt-auto">
                <button
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-sm py-3 rounded-lg transition-all duration-300 hover:scale-105"
                  onClick={() => {
                    navigate(`/detail/${post._id || post.id}`)
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      )}

      {/* Toggle Button */}
      {posts.length > 8 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
          className="text-center mt-10"
        >
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 text-lg font-semibold"
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        </motion.div>
      )}
    </section>
  );
};

export default RecentPosts;
