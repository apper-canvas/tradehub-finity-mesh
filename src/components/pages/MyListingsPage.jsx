import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import productService from "@/services/api/productService";

function MyListingsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filter and view state
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("card"); // card or table
  
  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await productService.getMyListings("1");
      setProducts(data);
    } catch (err) {
      setError(err.message || "Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter and sort products
  const filteredProducts = products
    .filter(p => {
      // Status filter
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.datePosted) - new Date(a.datePosted);
        case "oldest":
          return new Date(a.datePosted) - new Date(b.datePosted);
        case "price-high":
          return b.price - a.price;
        case "price-low":
          return a.price - b.price;
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "views":
          return (b.views || 0) - (a.views || 0);
        default:
          return 0;
      }
    });

  // Calculate statistics
  const stats = {
    active: products.filter(p => p.status === "active").length,
    sold: products.filter(p => p.status === "sold").length,
    pending: products.filter(p => p.status === "pending").length,
    draft: products.filter(p => p.status === "draft").length,
    totalValue: products
      .filter(p => p.status === "active")
      .reduce((sum, p) => sum + p.price, 0),
    totalViews: products.reduce((sum, p) => sum + (p.views || 0), 0),
    totalFavorites: products.reduce((sum, p) => sum + (p.favorites || 0), 0),
    avgPrice: products.filter(p => p.status === "active").length > 0
      ? products.filter(p => p.status === "active").reduce((sum, p) => sum + p.price, 0) / products.filter(p => p.status === "active").length
      : 0,
engagementRate: products.length > 0
      ? ((products.reduce((sum, p) => sum + (p.views || 0) + (p.favorites || 0), 0)) / products.length).toFixed(1)
      : 0,
    conversionRate: products.length > 0
      ? ((products.filter(p => p.status === "sold").length) / products.length * 100).toFixed(1)
      : 0
  };

  // Action handlers
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      await productService.delete(id);
      setProducts(products.filter(p => p.Id !== id));
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
      toast.success("Listing deleted successfully");
    } catch (err) {
      toast.error("Failed to delete listing");
    }
  };

  const handleMarkAsSold = async (id) => {
    try {
      await productService.markAsSold(id);
      setProducts(products.map(p => 
        p.Id === id ? { ...p, status: "sold" } : p
      ));
      toast.success("Listing marked as sold");
    } catch (err) {
      toast.error("Failed to update listing");
    }
  };

  const handlePromote = async (id) => {
    try {
      await productService.promote(id);
      setProducts(products.map(p => 
        p.Id === id ? { ...p, promoted: true } : p
      ));
      toast.success("Listing promoted successfully");
    } catch (err) {
      toast.error("Failed to promote listing");
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const newProduct = await productService.duplicate(id);
      setProducts([newProduct, ...products]);
      toast.success("Listing duplicated successfully");
    } catch (err) {
      toast.error("Failed to duplicate listing");
    }
  };

  // Bulk actions
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p.Id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectItem = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} listing(s)?`)) return;

    try {
      await productService.bulkDelete(selectedIds);
      setProducts(products.filter(p => !selectedIds.includes(p.Id)));
      setSelectedIds([]);
      setSelectAll(false);
      toast.success(`${selectedIds.length} listing(s) deleted successfully`);
    } catch (err) {
      toast.error("Failed to delete listings");
    }
  };

  const handleBulkMarkAsSold = async () => {
    try {
      await productService.bulkMarkAsSold(selectedIds);
      setProducts(products.map(p => 
        selectedIds.includes(p.Id) ? { ...p, status: "sold" } : p
      ));
      setSelectedIds([]);
      setSelectAll(false);
      toast.success(`${selectedIds.length} listing(s) marked as sold`);
    } catch (err) {
      toast.error("Failed to update listings");
    }
  };

  const handleBulkPromote = async () => {
    try {
      await productService.bulkPromote(selectedIds);
      setProducts(products.map(p => 
        selectedIds.includes(p.Id) ? { ...p, promoted: true } : p
      ));
      setSelectedIds([]);
      setSelectAll(false);
      toast.success(`${selectedIds.length} listing(s) promoted successfully`);
    } catch (err) {
      toast.error("Failed to promote listings");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-gray-900 mb-2">
            My Listings
          </h1>
          <p className="text-gray-600">
            Manage and track your marketplace listings
          </p>
        </div>
        <Button onClick={() => navigate("/sell")}>
          <ApperIcon name="Plus" size={18} className="mr-2" />
          Create Listing
        </Button>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-6 border-2 border-primary/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="Package" size={20} className="text-white" />
            </div>
            <div>
              <div className="text-xs text-gray-600">Active Listings</div>
              <div className="font-display font-bold text-xl text-gray-900">
                {stats.active}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-gradient-to-br from-info/10 to-info/5 rounded-lg p-6 border-2 border-info/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-info rounded-lg flex items-center justify-center">
              <ApperIcon name="Eye" size={20} className="text-white" />
            </div>
            <div>
              <div className="text-xs text-gray-600">Total Views</div>
              <div className="font-display font-bold text-xl text-gray-900">
                {stats.totalViews.toLocaleString()}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-error/10 to-error/5 rounded-lg p-6 border-2 border-error/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-error rounded-lg flex items-center justify-center">
              <ApperIcon name="Heart" size={20} className="text-white" />
            </div>
            <div>
              <div className="text-xs text-gray-600">Total Favorites</div>
              <div className="font-display font-bold text-xl text-gray-900">
                {stats.totalFavorites}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-br from-warning/10 to-warning/5 rounded-lg p-6 border-2 border-warning/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" size={20} className="text-white" />
            </div>
            <div>
              <div className="text-xs text-gray-600">Engagement Rate</div>
              <div className="font-display font-bold text-xl text-gray-900">
                {stats.engagementRate}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-success/10 to-success/5 rounded-lg p-6 border-2 border-success/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" size={20} className="text-white" />
            </div>
            <div>
              <div className="text-xs text-gray-600">Conversion Rate</div>
              <div className="font-display font-bold text-xl text-gray-900">
                {stats.conversionRate}%
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-surface rounded-lg shadow-card p-6 space-y-4">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === "all"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All ({products.length})
          </button>
          <button
            onClick={() => setStatusFilter("active")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === "active"
                ? "bg-success text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Active ({stats.active})
          </button>
          <button
            onClick={() => setStatusFilter("sold")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === "sold"
                ? "bg-info text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Sold ({stats.sold})
          </button>
          <button
            onClick={() => setStatusFilter("pending")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === "pending"
                ? "bg-warning text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Pending ({stats.pending})
          </button>
          <button
            onClick={() => setStatusFilter("draft")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === "draft"
                ? "bg-gray-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Draft ({stats.draft})
          </button>
        </div>

        {/* Search, Sort, and View Toggle */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <ApperIcon 
                name="Search" 
                size={18} 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
            <option value="title-asc">Title: A-Z</option>
            <option value="title-desc">Title: Z-A</option>
            <option value="views">Most Viewed</option>
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("card")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "card"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <ApperIcon name="LayoutGrid" size={20} />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "table"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <ApperIcon name="List" size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/10 border-2 border-primary rounded-lg p-4 flex items-center justify-between flex-wrap gap-4"
        >
          <div className="font-medium text-gray-900">
            {selectedIds.length} listing(s) selected
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkMarkAsSold}
            >
              <ApperIcon name="CheckCircle" size={16} className="mr-2" />
              Mark as Sold
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkPromote}
            >
              <ApperIcon name="TrendingUp" size={16} className="mr-2" />
              Promote
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBulkDelete}
              className="text-error hover:bg-error/10"
            >
              <ApperIcon name="Trash2" size={16} className="mr-2" />
              Delete
            </Button>
          </div>
        </motion.div>
      )}

      {/* Listings */}
      {filteredProducts.length === 0 ? (
        <Empty
          title={products.length === 0 ? "No listings yet" : "No listings found"}
          message={products.length === 0 ? "Create your first listing to start selling" : "Try adjusting your filters or search query"}
          icon="Package"
          action={products.length === 0 ? () => navigate("/sell") : undefined}
          actionLabel={products.length === 0 ? "Create Listing" : undefined}
        />
      ) : viewMode === "card" ? (
        <div className="space-y-4">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-surface rounded-lg shadow-card hover:shadow-card-hover transition-shadow"
            >
              <div className="p-6">
                <div className="flex gap-4">
                  {/* Checkbox */}
                  <div className="flex items-start pt-1">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(product.Id)}
                      onChange={() => handleSelectItem(product.Id)}
                      className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer"
                    />
                  </div>

                  {/* Image */}
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-semibold text-xl text-gray-900 mb-1 truncate">
                          {product.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                          {product.description}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-display font-bold text-2xl text-primary mb-1">
                          ${product.price.toLocaleString()}
                        </div>
                        <Badge 
                          variant={
                            product.status === "active" ? "success" :
                            product.status === "sold" ? "default" :
                            product.status === "pending" ? "warning" :
                            "default"
                          }
                        >
                          {product.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <Badge variant="primary">{product.condition}</Badge>
                      {product.promoted && (
                        <Badge variant="warning">
                          <ApperIcon name="Star" size={12} className="mr-1" />
                          Promoted
                        </Badge>
                      )}
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <ApperIcon name="Eye" size={14} />
                        {product.views || 0} views
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <ApperIcon name="Heart" size={14} />
                        {product.favorites || 0} favorites
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <ApperIcon name="MapPin" size={14} />
                        {product.location}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(product.datePosted), { addSuffix: true })}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/product/${product.Id}`)}
                      >
                        <ApperIcon name="Eye" size={16} className="mr-2" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/sell?edit=${product.Id}`)}
                      >
                        <ApperIcon name="Edit" size={16} className="mr-2" />
                        Edit
                      </Button>
                      {product.status !== "sold" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAsSold(product.Id)}
                        >
                          <ApperIcon name="CheckCircle" size={16} className="mr-2" />
                          Mark as Sold
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePromote(product.Id)}
                        disabled={product.promoted}
                      >
                        <ApperIcon name="TrendingUp" size={16} className="mr-2" />
                        {product.promoted ? "Promoted" : "Promote"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDuplicate(product.Id)}
                      >
                        <ApperIcon name="Copy" size={16} className="mr-2" />
                        Duplicate
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(product.Id)}
                        className="text-error hover:bg-error/10 ml-auto"
                      >
                        <ApperIcon name="Trash2" size={16} className="mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-surface rounded-lg shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Listing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Favorites
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Posted
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.Id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(product.Id)}
                        onChange={() => handleSelectItem(product.Id)}
                        className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {product.title}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                            <Badge variant="primary" className="text-xs">
                              {product.condition}
                            </Badge>
                            {product.promoted && (
                              <Badge variant="warning" className="text-xs">
                                <ApperIcon name="Star" size={10} className="mr-1" />
                                Promoted
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-display font-bold text-lg text-primary">
                        ${product.price.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={
                          product.status === "active" ? "success" :
                          product.status === "sold" ? "default" :
                          product.status === "pending" ? "warning" :
                          "default"
                        }
                      >
                        {product.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <ApperIcon name="Eye" size={14} />
                        {product.views || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <ApperIcon name="Heart" size={14} />
                        {product.favorites || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDistanceToNow(new Date(product.datePosted), { addSuffix: true })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/product/${product.Id}`)}
                          className="text-gray-600 hover:text-primary p-1"
                          title="View"
                        >
                          <ApperIcon name="Eye" size={18} />
                        </button>
                        <button
                          onClick={() => navigate(`/sell?edit=${product.Id}`)}
                          className="text-gray-600 hover:text-primary p-1"
                          title="Edit"
                        >
                          <ApperIcon name="Edit" size={18} />
                        </button>
                        {product.status !== "sold" && (
                          <button
                            onClick={() => handleMarkAsSold(product.Id)}
                            className="text-gray-600 hover:text-success p-1"
                            title="Mark as Sold"
                          >
                            <ApperIcon name="CheckCircle" size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handlePromote(product.Id)}
                          disabled={product.promoted}
                          className="text-gray-600 hover:text-warning p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                          title={product.promoted ? "Already Promoted" : "Promote"}
                        >
                          <ApperIcon name="TrendingUp" size={18} />
                        </button>
                        <button
                          onClick={() => handleDuplicate(product.Id)}
                          className="text-gray-600 hover:text-info p-1"
                          title="Duplicate"
                        >
                          <ApperIcon name="Copy" size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.Id)}
                          className="text-gray-600 hover:text-error p-1"
                          title="Delete"
                        >
                          <ApperIcon name="Trash2" size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyListingsPage;