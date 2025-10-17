import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/category/${category.id}`)}
      className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-6 cursor-pointer border-2 border-transparent hover:border-primary/20 transition-all duration-200 shadow-card hover:shadow-card-hover"
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-lg">
          <ApperIcon name={category.icon} size={28} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-display font-semibold text-lg text-gray-900">
            {category.name}
          </h3>
          <p className="text-sm text-gray-600">{category.count} items</p>
        </div>
        <ApperIcon name="ChevronRight" size={20} className="text-gray-400" />
      </div>
    </motion.div>
  );
};

export default CategoryCard;