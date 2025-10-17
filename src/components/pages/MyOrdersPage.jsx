import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Empty from "@/components/ui/Empty";
import { useAuth } from "@/hooks/useAuth";

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">
              My Orders
            </h1>
            <p className="text-gray-500 mt-1">View and track your order history</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8">
          <Empty
            icon="ShoppingBag"
            title="No orders yet"
            description="Your order history will appear here once you make a purchase"
          />
          <div className="flex justify-center mt-6">
            <Button
              onClick={() => navigate("/products")}
              className="bg-primary hover:bg-primary/90 gap-2"
            >
              <ApperIcon name="Grid3x3" size={18} />
              Browse Products
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MyOrdersPage;