import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import productService from "@/services/api/productService";

const MyListingsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;

    try {
      await productService.delete(id);
      setProducts(products.filter(p => p.Id !== id));
      toast.success("Listing deleted successfully");
    } catch (err) {
      toast.error("Failed to delete listing");
    }
  };

  if (loading) return <Loading type="grid" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const totalValue = products
    .filter(p => p.status === "active")
    .reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-gray-900 mb-2">
            My Listings
          </h1>
          <p className="text-gray-600">
            Manage your active and sold listings
          </p>
        </div>
        <Button onClick={() => navigate("/sell")}>
          <ApperIcon name="Plus" size={18} className="mr-2" />
          Create Listing
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-6 border-2 border-primary/20"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="Package" size={24} className="text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Active Listings</div>
              <div className="font-display font-bold text-2xl text-gray-900">
                {products.filter(p => p.status === "active").length}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-success/10 to-success/5 rounded-lg p-6 border-2 border-success/20"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" size={24} className="text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Value</div>
              <div className="font-display font-bold text-2xl text-gray-900">
                ${totalValue.toLocaleString()}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-info/10 to-info/5 rounded-lg p-6 border-2 border-info/20"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-info rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" size={24} className="text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Avg. Price</div>
              <div className="font-display font-bold text-2xl text-gray-900">
                ${products.length > 0 ? Math.round(totalValue / products.filter(p => p.status === "active").length) : 0}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Listings */}
      {products.length === 0 ? (
        <Empty
          title="No listings yet"
          message="Create your first listing to start selling"
          icon="Package"
          action={() => navigate("/sell")}
          actionLabel="Create Listing"
        />
      ) : (
        <div className="space-y-4">
          {products.map((product, index) => (
            <motion.div
              key={product.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-surface rounded-lg shadow-card p-6 hover:shadow-card-hover transition-shadow"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full md:w-48 h-48 object-cover rounded-lg"
                />

                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-display font-semibold text-xl text-gray-900 mb-2">
                        {product.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-2 mb-3">
                        {product.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge variant="primary">{product.condition}</Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <ApperIcon name="MapPin" size={14} />
                          {product.location}
                        </div>
                        <div className="text-sm text-gray-500">
                          Listed {formatDistanceToNow(new Date(product.datePosted), { addSuffix: true })}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-display font-bold text-2xl text-primary mb-2">
                        ${product.price.toLocaleString()}
                      </div>
                      <Badge variant={product.status === "active" ? "success" : "default"}>
                        {product.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-gray-200">
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
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListingsPage;