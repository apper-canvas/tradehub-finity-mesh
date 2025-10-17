import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No items found",
  message = "Try adjusting your search or filters",
  icon = "Package",
  action,
  actionLabel
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[400px] px-4"
    >
      <div className="w-32 h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={64} className="text-primary" />
      </div>
      <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 text-center mb-8 max-w-md">{message}</p>
      {action && actionLabel && (
        <Button onClick={action} className="bg-primary hover:bg-primary/90">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;