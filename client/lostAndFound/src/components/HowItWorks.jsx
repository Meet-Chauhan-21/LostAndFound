import { motion } from "framer-motion";
import { Upload, Search, MessageSquare, CheckCircle } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      title: "1. Post",
      description: "Report your lost item or post a found item with details and photos",
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-500/20 to-teal-500/20",
      borderColor: "border-emerald-500/30",
      shadowColor: "shadow-emerald-500/20"
    },
    {
      icon: Search,
      title: "2. Search",
      description: "Our system matches lost and found items based on descriptions and locations",
      gradient: "from-blue-500 to-indigo-500",
      bgGradient: "from-blue-500/20 to-indigo-500/20",
      borderColor: "border-blue-500/30",
      shadowColor: "shadow-blue-500/20"
    },
    {
      icon: MessageSquare,
      title: "3. Contact",
      description: "Get connected through our secure messaging system",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/30",
      shadowColor: "shadow-purple-500/20"
    },
    {
      icon: CheckCircle,
      title: "4. Reunite",
      description: "Arrange a safe meeting to return the item to its owner",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-500/20 to-red-500/20",
      borderColor: "border-orange-500/30",
      shadowColor: "shadow-orange-500/20"
    }
  ];

  return (
    <section className="container mx-auto px-4 py-12 bg-gradient-to-br from-slate-800/30 to-slate-700/30 rounded-3xl backdrop-blur-sm border border-slate-600/50">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        viewport={{ once: false, margin: "-50px" }}
        className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-20 text-center"
      >
        How It Works
      </motion.h2>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ 
              scale: 1.05, 
              y: -10,
              boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.6)"
            }}
            transition={{ duration: 0.1 }}
            viewport={{ once: false, margin: "-50px" }}
            className={`bg-gradient-to-br ${step.bgGradient} backdrop-blur-sm p-8 rounded-2xl shadow-xl border ${step.borderColor} transition-all duration-200 hover:shadow-2xl text-center group cursor-pointer`}
          >
            <div className={`w-20 h-20 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transition-all duration-300 group-hover:scale-125`}>
              <step.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 transition-all duration-300 group-hover:text-yellow-400">{step.title}</h3>
            <p className="text-slate-300 leading-relaxed">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
