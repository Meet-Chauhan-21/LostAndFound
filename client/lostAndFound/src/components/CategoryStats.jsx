import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tag, TrendingUp } from "lucide-react";
import api from "../utils/axiosConfig";

const CategoryStats = () => {
  const [categoryStats, setCategoryStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryStats = async () => {
      try {
        const response = await api.get("/user-reports/category-stats");
        setCategoryStats(response.data);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch category stats:", error);
        setError("Failed to load category statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryStats();
  }, []);

  const categoryLabels = {
    electronics: "Electronics",
    wallet: "Wallet/Purse",
    jewelry: "Jewelry",
    clothing: "Clothing",
    documents: "Documents",
    other: "Other"
  };

  const categoryStyles = {
    electronics: {
      bg: "bg-gradient-to-br from-purple-500/20 to-blue-500/20",
      text: "text-white",
      border: "border-purple-500/30",
      shadow: "shadow-purple-500/20",
      iconBg: "bg-gradient-to-br from-purple-500 to-blue-500"
    },
    wallet: {
      bg: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20",
      text: "text-white",
      border: "border-blue-500/30",
      shadow: "shadow-blue-500/20",
      iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500"
    },
    jewelry: {
      bg: "bg-gradient-to-br from-amber-500/20 to-orange-500/20",
      text: "text-white",
      border: "border-amber-500/30",
      shadow: "shadow-amber-500/20",
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-500"
    },
    clothing: {
      bg: "bg-gradient-to-br from-green-500/20 to-emerald-500/20",
      text: "text-white",
      border: "border-green-500/30",
      shadow: "shadow-green-500/20",
      iconBg: "bg-gradient-to-br from-green-500 to-emerald-500"
    },
    documents: {
      bg: "bg-gradient-to-br from-indigo-500/20 to-purple-500/20",
      text: "text-white",
      border: "border-indigo-500/30",
      shadow: "shadow-indigo-500/20",
      iconBg: "bg-gradient-to-br from-indigo-500 to-purple-500"
    },
    other: {
      bg: "bg-gradient-to-br from-slate-500/20 to-gray-500/20",
      text: "text-white",
      border: "border-slate-500/30",
      shadow: "shadow-slate-500/20",
      iconBg: "bg-gradient-to-br from-slate-500 to-gray-500"
    }
  };

  const categoryIcons = {
    electronics: "📱",
    wallet: "👛",
    jewelry: "💍",
    clothing: "👕",
    documents: "📄",
    other: "📦"
  };

  if (loading) {
    return (
      <section className="container mx-auto px-4 md:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 md:px-8 py-12">
        <div className="text-center">
          <p className="text-red-400">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 md:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        viewport={{ once: false, margin: "-50px" }}
        className="text-center mb-16"
      >
        <h2 className="text-6xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4">
          Category Statistics
        </h2>
        <p className="text-slate-300 max-w-2xl mx-auto text-lg">
          See how many items have been reported in each category across our community
        </p>
      </motion.div>

      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl">
          {Object.keys(categoryLabels).map((category, index) => {
            const style = categoryStyles[category] || categoryStyles.other;
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ 
                  scale: 1.05,
                  y: -10,
                  boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.6)"
                }}
                transition={{ duration: 0.1 }}
                viewport={{ once: false, margin: "-50px" }}
                className={`relative p-6 rounded-2xl border backdrop-blur-sm text-center transition-all duration-200 hover:shadow-2xl cursor-pointer ${style.bg} ${style.border} ${style.text} overflow-hidden min-w-[280px] w-full group`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-12 h-12 rounded-full bg-white opacity-20"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 rounded-full bg-white opacity-20"></div>
                </div>
                
                {/* Icon Container */}
                <div className={`relative w-16 h-16 mx-auto mb-4 rounded-2xl ${style.iconBg} flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-125`}>
                  <div className="text-2xl">{categoryIcons[category]}</div>
                </div>
                
                {/* Category Name */}
                <h3 className="relative font-bold text-lg mb-2 inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-yellow-400 after:to-orange-400 after:transition-all after:duration-500 after:ease-out group-hover:after:w-full">
                  {categoryLabels[category]}
                </h3>
                
                {/* Count */}
                <div className={`relative text-3xl font-bold mb-2 text-yellow-400 transition-all duration-300 group-hover:bg-gradient-to-r ${style.iconBg.replace('bg-gradient-to-br ', '')} group-hover:bg-clip-text group-hover:text-transparent`}>
                  {categoryStats[category] || 0}
                </div>
                
                {/* Label */}
                <p className="relative text-sm opacity-75 font-medium">
                  items
                </p>
                
                {/* Decorative Element */}
                <div className={`absolute bottom-2 right-2 w-3 h-3 rounded-full ${style.iconBg} opacity-50`}></div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {Object.keys(categoryStats).length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
          className="text-center py-8"
        >
          <p className="text-slate-400">No category statistics available yet.</p>
        </motion.div>
      )}
    </section>
  );
};

export default CategoryStats; 