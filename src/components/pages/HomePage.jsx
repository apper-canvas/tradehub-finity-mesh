import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import CategoryCard from "@/components/molecules/CategoryCard";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import productService from "@/services/api/productService";
import categoryService from "@/services/api/categoryService";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [productsData, categoriesData] = await Promise.all([
        productService.getAll(),
        categoryService.getAll()
      ]);
      setProducts(productsData.slice(0, 8));
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading type="grid" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 py-12"
      >
        <h1 className="font-display font-bold text-4xl md:text-6xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Discover Amazing Deals
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Buy and sell with confidence in our trusted marketplace community
        </p>
        <div className="max-w-3xl mx-auto">
          <SearchBar placeholder="Search for products, brands, or categories..." />
        </div>
        <div className="flex items-center justify-center gap-8 pt-4">
          <div className="text-center">
            <div className="font-display font-bold text-3xl text-primary">2,358+</div>
            <div className="text-sm text-gray-600">Active Listings</div>
          </div>
          <div className="w-px h-12 bg-gray-300" />
          <div className="text-center">
            <div className="font-display font-bold text-3xl text-primary">1,847+</div>
            <div className="text-sm text-gray-600">Happy Buyers</div>
          </div>
          <div className="w-px h-12 bg-gray-300" />
          <div className="text-center">
            <div className="font-display font-bold text-3xl text-primary">98%</div>
            <div className="text-sm text-gray-600">Satisfaction</div>
          </div>
        </div>
      </motion.section>

      {/* Categories */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-2xl text-gray-900">
            Browse by Category
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <CategoryCard category={category} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Listings */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-2xl text-gray-900">
            Featured Listings
          </h2>
          <button
            onClick={() => navigate("/search")}
            className="text-primary hover:text-primary/80 font-medium flex items-center gap-2"
          >
            View All
            <ApperIcon name="ArrowRight" size={18} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-primary to-accent rounded-2xl p-8 md:p-12 text-white text-center space-y-6 shadow-xl"
      >
        <h2 className="font-display font-bold text-3xl md:text-4xl">
          Ready to Sell Your Items?
        </h2>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">
          List your products in minutes and reach thousands of potential buyers
        </p>
        <button
          onClick={() => navigate("/sell")}
          className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:shadow-xl transition-shadow inline-flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={20} />
          Start Selling
        </button>
      </motion.section>
    </div>
  );
};

export default HomePage;