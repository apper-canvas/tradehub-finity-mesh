import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { useAuth } from "@/hooks/useAuth";
import productService from "@/services/api/productService";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";

const SellerDashboardPage = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    loadData();
  }, [isAuthenticated, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await productService.getMyListings(currentUser.Id.toString());
      setProducts(data);
    } catch (err) {
      setError(err.message || "Failed to load seller data");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const activeItems = products.filter(p => p.status === "active").length;
  const soldItems = products.filter(p => p.status === "sold").length;
  const totalListings = products.length;
  const totalEarnings = products
    .filter(p => p.status === "sold")
    .reduce((sum, p) => sum + p.price, 0);

  const stats = [
    {
      label: "Total Listings",
      value: totalListings,
      icon: "Package",
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20"
    },
    {
      label: "Active Items",
      value: activeItems,
      icon: "ShoppingBag",
      color: "text-success",
      bgColor: "bg-success/10",
      borderColor: "border-success/20"
    },
    {
      label: "Sold Items",
      value: soldItems,
      icon: "TrendingUp",
      color: "text-info",
      bgColor: "bg-info/10",
      borderColor: "border-info/20"
    },
    {
      label: "Total Earnings",
      value: `$${totalEarnings.toLocaleString()}`,
      icon: "DollarSign",
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/20"
    }
  ];

  const quickActions = [
    {
      label: "List New Item",
      icon: "Plus",
      path: "/sell",
      color: "bg-accent hover:bg-accent/90"
    },
    {
      label: "Manage Inventory",
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
      label: "Messages",
      icon: "MessageCircle",
      path: "/dashboard",
      color: "bg-success hover:bg-success/90"
    }
  ];

  const sidebarLinks = [
    { label: "Dashboard", icon: "LayoutDashboard", path: "/seller-dashboard" },
    { label: "My Listings", icon: "Package", path: "/my-listings" },
    { label: "Orders", icon: "ShoppingBag", path: "/orders" },
    { label: "Analytics", icon: "BarChart3", path: "/seller-dashboard" },
    { label: "Messages", icon: "MessageCircle", path: "/dashboard" },
    { label: "Settings", icon: "Settings", path: "/account-settings" }
  ];

  const recentListings = products.slice(0, 5);

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "sold":
        return "default";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-surface rounded-xl shadow-card p-6 sticky top-24"
            >
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-12 h-12 rounded-full border-2 border-primary"
                />
                <div>
                  <h3 className="font-display font-semibold text-gray-900">
                    {currentUser.name}
                  </h3>
                  <p className="text-sm text-gray-500">Seller</p>
                </div>
              </div>

              <nav className="space-y-2">
                {sidebarLinks.map((link) => (
                  <button
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      window.location.pathname === link.path
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <ApperIcon name={link.icon} size={20} />
                    <span className="font-medium">{link.label}</span>
                  </button>
                ))}
              </nav>
            </motion.div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-8">
            {/* Welcome Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white"
            >
              <h1 className="text-3xl font-display font-bold mb-2">
                Welcome to Your Seller Dashboard
              </h1>
              <p className="text-white/90">
                Manage your listings, track earnings, and grow your business
              </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-surface rounded-xl p-6 shadow-card border-2 ${stat.borderColor}`}
                >
                  <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center mb-4`}>
                    <ApperIcon name={stat.icon} size={24} className={stat.color} />
                  </div>
                  <p className="text-2xl font-display font-bold text-gray-900 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-xl font-display font-bold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
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
            </motion.div>

            {/* Recent Listings Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-surface rounded-xl shadow-card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-gray-900">
                  Recent Listings
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/my-listings")}
                >
                  View All
                  <ApperIcon name="ArrowRight" size={16} className="ml-2" />
                </Button>
              </div>

              {recentListings.length === 0 ? (
                <Empty
                  title="No Listings Yet"
                  message="Start selling by creating your first listing"
                  icon="Package"
                  actionLabel="List New Item"
                  onAction={() => navigate("/sell")}
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-display font-semibold text-gray-900">
                          Product
                        </th>
                        <th className="text-left py-3 px-4 font-display font-semibold text-gray-900">
                          Price
                        </th>
                        <th className="text-left py-3 px-4 font-display font-semibold text-gray-900">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-display font-semibold text-gray-900">
                          Listed
                        </th>
                        <th className="text-right py-3 px-4 font-display font-semibold text-gray-900">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentListings.map((product) => (
                        <tr
                          key={product.Id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.images[0]}
                                alt={product.title}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div>
                                <p className="font-medium text-gray-900 line-clamp-1">
                                  {product.title}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {product.condition}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <p className="font-display font-semibold text-gray-900">
                              ${product.price.toLocaleString()}
                            </p>
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant={getStatusBadgeVariant(product.status)}>
                              {product.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <p className="text-sm text-gray-600">
                              {formatDistanceToNow(new Date(product.datePosted), {
                                addSuffix: true
                              })}
                            </p>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/product/${product.Id}`)}
                              >
                                <ApperIcon name="Eye" size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/sell?edit=${product.Id}`)}
                              >
                                <ApperIcon name="Edit" size={16} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>

            {/* Getting Started Guide */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-6 border-2 border-primary/20"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <ApperIcon name="Lightbulb" size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-gray-900 mb-2">
                    Getting Started as a Seller
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Tips and best practices to help you succeed on TradeHub
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 bg-white rounded-lg p-4">
                  <ApperIcon name="Camera" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Use High-Quality Photos
                    </h4>
                    <p className="text-sm text-gray-600">
                      Clear, well-lit photos from multiple angles help buyers make confident decisions
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white rounded-lg p-4">
                  <ApperIcon name="FileText" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Write Detailed Descriptions
                    </h4>
                    <p className="text-sm text-gray-600">
                      Include condition, dimensions, brand, and any defects to set accurate expectations
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white rounded-lg p-4">
                  <ApperIcon name="DollarSign" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Price Competitively
                    </h4>
                    <p className="text-sm text-gray-600">
                      Research similar items to set fair prices that attract buyers quickly
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white rounded-lg p-4">
                  <ApperIcon name="Zap" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Respond Promptly
                    </h4>
                    <p className="text-sm text-gray-600">
                      Quick responses to inquiries build trust and increase your chances of making a sale
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardPage;