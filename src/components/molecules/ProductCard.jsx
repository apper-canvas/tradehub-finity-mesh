import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

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
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer group"
      onClick={() => navigate(`/product/${product.id}`)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={product.images?.[0] || '/placeholder.png'}
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
            ${product.price?.toLocaleString() || '0'}
          </div>
          <div className="text-xs text-gray-500">
            {(() => {
              try {
                const date = new Date(product.datePosted);
                return isNaN(date.getTime()) ? 'Date unavailable' : formatDistanceToNow(date, { addSuffix: true });
              } catch {
                return 'Date unavailable';
              }
            })()}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;