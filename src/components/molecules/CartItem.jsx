import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const { product, quantity } = item;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex gap-4 p-4 bg-surface rounded-lg shadow-card"
    >
      <img
        src={product.images[0]}
        alt={product.title}
        className="w-24 h-24 object-cover rounded-md"
      />
      
      <div className="flex-1 space-y-2">
        <h4 className="font-display font-semibold text-gray-900 line-clamp-1">
          {product.title}
        </h4>
        <p className="text-sm text-gray-600">{product.condition}</p>
        <div className="font-display font-bold text-lg text-primary">
          ${product.price.toLocaleString()}
        </div>
      </div>

      <div className="flex flex-col items-end justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(product.Id)}
          className="text-error hover:bg-error/10"
        >
          <ApperIcon name="X" size={16} />
        </Button>

        <div className="flex items-center gap-2 bg-gray-100 rounded-md">
          <button
            onClick={() => onUpdateQuantity(product.Id, quantity - 1)}
            className="px-2 py-1 hover:bg-gray-200 rounded-l-md transition-colors"
            disabled={quantity <= 1}
          >
            <ApperIcon name="Minus" size={16} />
          </button>
          <span className="px-3 font-medium">{quantity}</span>
          <button
            onClick={() => onUpdateQuantity(product.Id, quantity + 1)}
            className="px-2 py-1 hover:bg-gray-200 rounded-r-md transition-colors"
          >
            <ApperIcon name="Plus" size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;