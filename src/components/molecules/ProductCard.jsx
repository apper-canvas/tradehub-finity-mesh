import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { formatDistanceToNow } from "date-fns";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const getConditionVariant = (condition) => {
    switch (condition) {
      case "Like New":
        return "success";
      case "Used":
        return "info";
      case "Refurbished":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={() => navigate(`/product/${product.Id}`)}
      className="bg-surface rounded-lg shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer overflow-hidden group"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <Badge variant={getConditionVariant(product.condition)}>
            {product.condition}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-display font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
          {product.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="MapPin" size={14} />
          <span>{product.location}</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="font-display font-bold text-2xl text-primary">
            ${product.price.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(product.datePosted), { addSuffix: true })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;