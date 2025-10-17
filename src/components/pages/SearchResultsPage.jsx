import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import ProductCard from "@/components/molecules/ProductCard";
import FilterSidebar from "@/components/organisms/FilterSidebar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import productService from "@/services/api/productService";
import categoryService from "@/services/api/categoryService";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [productsData, categoriesData] = await Promise.all([
        productService.search(query, filters),
        categoryService.getAll()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || "Failed to load search results");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [query, filters]);

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "newest":
        return new Date(b.datePosted) - new Date(a.datePosted);
      default:
        return 0;
    }
  });

  if (loading) return <Loading type="grid" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-gray-900">
              {query ? `Search results for "${query}"` : "All Products"}
            </h1>
            <p className="text-gray-600 mt-1">
              {products.length} {products.length === 1 ? "item" : "items"} found
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 rounded-md focus:border-primary focus:outline-none bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden px-4 py-2 border-2 border-primary text-primary rounded-md font-medium flex items-center gap-2"
            >
              <ApperIcon name="Filter" size={18} />
              Filters
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {Object.entries(filters).filter(([_, v]) => v).length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Active filters:</span>
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null;
              return (
                <motion.button
                  key={key}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => setFilters({ ...filters, [key]: undefined })}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium flex items-center gap-2 hover:bg-primary/20 transition-colors"
                >
                  {value}
                  <ApperIcon name="X" size={14} />
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className={`md:col-span-1 ${showFilters ? "block" : "hidden md:block"}`}>
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            categories={categories}
          />
        </div>

        {/* Products Grid */}
        <div className="md:col-span-3">
          {sortedProducts.length === 0 ? (
            <Empty
              title="No products found"
              message="Try adjusting your search or filters to find what you're looking for"
              icon="Package"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.Id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;