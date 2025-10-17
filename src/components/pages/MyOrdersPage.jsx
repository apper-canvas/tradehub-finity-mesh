import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import orderService from "@/services/api/orderService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    dateFrom: "",
    dateTo: "",
    minPrice: "",
    maxPrice: ""
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    loadOrders();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [orders, searchTerm, filters]);

  async function loadOrders() {
    try {
      setLoading(true);
      setError(null);
      const [ordersData, statsData] = await Promise.all([
        orderService.getByUserId(user.Id),
        orderService.getOrderStats(user.Id)
      ]);
      setOrders(ordersData);
      setStats(statsData);
    } catch (err) {
      setError(err.message || "Failed to load orders");
      toast.error("Failed to load your orders");
    } finally {
      setLoading(false);
    }
  }

  async function applyFiltersAndSearch() {
    if (!user) return;

    try {
      let result = [...orders];

      if (searchTerm.trim()) {
        const searchResults = await orderService.searchOrders(user.Id, searchTerm);
        result = searchResults;
      }

      const hasActiveFilters = 
        filters.status !== "all" ||
        filters.dateFrom ||
        filters.dateTo ||
        filters.minPrice ||
        filters.maxPrice;

      if (hasActiveFilters) {
        result = await orderService.filterOrders(user.Id, filters);
      }

      setFilteredOrders(result);
    } catch (err) {
      toast.error("Failed to apply filters");
    }
  }

  function handleFilterChange(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }));
  }

  function handleClearFilters() {
    setFilters({
      status: "all",
      dateFrom: "",
      dateTo: "",
      minPrice: "",
      maxPrice: ""
    });
    setSearchTerm("");
    toast.success("Filters cleared");
  }

  function handleContactSeller(order) {
    toast.info(`Opening chat with ${order.seller.name}`);
  }

  function handleLeaveReview(order) {
    toast.info(`Review form for ${order.product.title} - Coming soon`);
  }

  function handleReportIssue(order) {
    toast.info(`Report issue for order ${order.orderNumber} - Coming soon`);
  }

  function handleBuyAgain(order) {
    navigate(`/product/${order.productId}`);
    toast.success("Redirecting to product page");
  }

  function getStatusBadgeVariant(status) {
    const variants = {
      delivered: "success",
      in_transit: "info",
      processing: "warning",
      pending: "default",
      cancelled: "error"
    };
    return variants[status] || "default";
  }

  function getStatusLabel(status) {
    const labels = {
      delivered: "Delivered",
      in_transit: "In Transit",
      processing: "Processing",
      pending: "Pending",
      cancelled: "Cancelled"
    };
    return labels[status] || status;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Error message={error} onRetry={loadOrders} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">
              My Orders
            </h1>
            <p className="text-gray-500 mt-1">View and track your order history</p>
          </div>
        </div>

        {orders.length > 0 ? (
          <>
            {/* Statistics Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl shadow-card p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <ApperIcon name="ShoppingBag" size={24} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Purchases</p>
                      <p className="text-2xl font-display font-bold text-gray-900">
                        {stats.totalPurchases}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl shadow-card p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                      <ApperIcon name="DollarSign" size={24} className="text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Spent</p>
                      <p className="text-2xl font-display font-bold text-gray-900">
                        ${stats.totalSpent.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl shadow-card p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                      <ApperIcon name="Clock" size={24} className="text-warning" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pending Orders</p>
                      <p className="text-2xl font-display font-bold text-gray-900">
                        {stats.pendingOrders}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Search and Filter Controls */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Search orders by number, product, or seller..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      icon="Search"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="gap-2"
                  >
                    <ApperIcon name="Filter" size={18} />
                    Filters
                  </Button>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t pt-4 space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      {/* Status Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status
                        </label>
                        <select
                          value={filters.status}
                          onChange={(e) => handleFilterChange("status", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                          <option value="all">All Statuses</option>
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="in_transit">In Transit</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      {/* Date From */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date From
                        </label>
                        <Input
                          type="date"
                          value={filters.dateFrom}
                          onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                        />
                      </div>

                      {/* Date To */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date To
                        </label>
                        <Input
                          type="date"
                          value={filters.dateTo}
                          onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                        />
                      </div>

                      {/* Min Price */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Min Price
                        </label>
                        <Input
                          type="number"
                          placeholder="$0"
                          value={filters.minPrice}
                          onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                        />
                      </div>

                      {/* Max Price */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Price
                        </label>
                        <Input
                          type="number"
                          placeholder="Any"
                          value={filters.maxPrice}
                          onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        onClick={handleClearFilters}
                        className="gap-2"
                      >
                        <ApperIcon name="X" size={18} />
                        Clear Filters
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length > 0 ? (
              <div className="space-y-4">
                {filteredOrders.map((order, index) => (
                  <motion.div
                    key={order.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-shadow overflow-hidden"
                  >
                    <div className="p-6">
                      {/* Order Header */}
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-display font-bold text-gray-900">
                              {order.orderNumber}
                            </h3>
                            <Badge variant={getStatusBadgeVariant(order.status)}>
                              {getStatusLabel(order.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">
                            Ordered on {format(new Date(order.orderDate), "MMM dd, yyyy")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-display font-bold text-primary">
                            ${order.price.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Order Content */}
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Product Image */}
                        <div className="w-full md:w-32 h-32 flex-shrink-0">
                          <img
                            src={order.product.image}
                            alt={order.product.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>

                        {/* Order Details */}
                        <div className="flex-1 space-y-3">
                          <div>
                            <h4 className="font-display font-semibold text-gray-900 mb-1">
                              {order.product.title}
                            </h4>
                            <p className="text-sm text-gray-500 capitalize">
                              Condition: {order.product.condition}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <ApperIcon name="Store" size={16} />
                            <span>{order.seller.name}</span>
                            <span className="text-gray-400">•</span>
                            <div className="flex items-center gap-1">
                              <ApperIcon name="Star" size={14} className="text-warning fill-warning" />
                              <span>{order.seller.rating}</span>
                            </div>
                          </div>

                          {order.trackingNumber && (
                            <div className="flex items-center gap-2 text-sm">
                              <ApperIcon name="Package" size={16} className="text-primary" />
                              <span className="text-gray-600">Tracking:</span>
                              <a
                                href={order.trackingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline font-medium"
                              >
                                {order.trackingNumber}
                              </a>
                            </div>
                          )}

                          {order.estimatedDelivery && order.status !== "delivered" && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <ApperIcon name="Calendar" size={16} />
                              <span>
                                Est. delivery: {format(new Date(order.estimatedDelivery), "MMM dd, yyyy")}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleContactSeller(order)}
                          className="gap-2"
                        >
                          <ApperIcon name="MessageCircle" size={16} />
                          Contact Seller
                        </Button>

                        {order.status === "delivered" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleLeaveReview(order)}
                            className="gap-2"
                          >
                            <ApperIcon name="Star" size={16} />
                            Leave Review
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReportIssue(order)}
                          className="gap-2"
                        >
                          <ApperIcon name="AlertCircle" size={16} />
                          Report Issue
                        </Button>

                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleBuyAgain(order)}
                          className="gap-2 ml-auto"
                        >
                          <ApperIcon name="ShoppingCart" size={16} />
                          Buy Again
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-card p-8">
                <Empty
                  icon="Search"
                  title="No orders found"
                  description="Try adjusting your search or filters"
                />
                <div className="flex justify-center mt-6">
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="gap-2"
                  >
                    <ApperIcon name="X" size={18} />
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
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
        )}
</motion.div>
    </div>
  );
};

export default MyOrdersPage;