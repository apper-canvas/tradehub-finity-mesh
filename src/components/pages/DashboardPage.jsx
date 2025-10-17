import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const stats = [
    {
      label: "Cart Items",
      value: getCartCount(),
      icon: "ShoppingCart",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      label: "Wishlist",
      value: getWishlistCount(),
      icon: "Heart",
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      label: "Active Listings",
      value: 0,
      icon: "Package",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      label: "Orders",
      value: 0,
      icon: "ShoppingBag",
      color: "text-info",
      bgColor: "bg-info/10"
    }
  ];

  const quickActions = [
    {
      label: "Sell Item",
      icon: "Plus",
      path: "/sell",
      color: "bg-accent hover:bg-accent/90"
    },
    {
      label: "My Listings",
      icon: "Package",
      path: "/my-listings",
      color: "bg-primary hover:bg-primary/90"
    },
    {
      label: "View Orders",
      icon: "ShoppingBag",
      path: "/orders",
      color: "bg-info hover:bg-info/90"
    },
    {
      label: "Browse Products",
      icon: "Grid3x3",
      path: "/products",
      color: "bg-success hover:bg-success/90"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
            />
            <div>
              <h1 className="text-3xl font-display font-bold">
                Welcome back, {currentUser.name}!
              </h1>
              <p className="text-white/90 mt-1">{currentUser.email}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-card"
            >
              <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center mb-4`}>
                <ApperIcon name={stat.icon} size={24} className={stat.color} />
              </div>
              <p className="text-3xl font-display font-bold text-gray-900">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-display font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Button
                  onClick={() => navigate(action.path)}
                  className={`w-full ${action.color} text-white gap-2 py-6`}
                >
                  <ApperIcon name={action.icon} size={20} />
                  {action.label}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;