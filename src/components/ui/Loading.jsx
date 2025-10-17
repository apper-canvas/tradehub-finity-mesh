import { motion } from "framer-motion";

const Loading = ({ type = "grid" }) => {
  if (type === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="bg-surface rounded-lg shadow-card overflow-hidden"
          >
            <div className="w-full h-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4 animate-pulse" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-24 animate-pulse" />
                <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-20 animate-pulse" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "detail") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="w-full h-[500px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse" />
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-full h-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
            <div className="h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-32 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4 animate-pulse" />
            </div>
            <div className="p-6 bg-surface rounded-lg shadow-card space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-32 animate-pulse" />
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-24 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
      />
    </div>
  );
};

export default Loading;