import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] px-4"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-error to-accent rounded-full flex items-center justify-center mb-6 shadow-lg">
        <ApperIcon name="AlertCircle" size={40} className="text-white" />
      </div>
      <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Oops!</h2>
      <p className="text-gray-600 text-center mb-6 max-w-md">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} className="bg-primary hover:bg-primary/90">
          <ApperIcon name="RefreshCw" size={18} className="mr-2" />
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default Error;