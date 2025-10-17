import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import ProductCard from "@/components/molecules/ProductCard";
import FilterSidebar from "@/components/organisms/FilterSidebar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import productService from "@/services/api/productService";
import categoryService from "@/services/api/categoryService";

const CategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ category: categoryId });
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [productsData, categoryData, categoriesData] = await Promise.all([
        productService.getByCategory(categoryId),
        categoryService.getById(categoryId),
        categoryService.getAll()
      ]);
      setProducts(productsData);
      setCategory(categoryData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || "Failed to load category data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFilters({ category: categoryId });
    loadData();
  }, [categoryId]);

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
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <button onClick={() => navigate("/")} className="hover:text-primary">
          Home
        </button>
        <ApperIcon name="ChevronRight" size={14} />
        <span className="text-gray-900 font-medium">{category?.name}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-lg">
            <ApperIcon name={category?.icon || "Package"} size={32} className="text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl text-gray-900">
              {category?.name}
            </h1>
            <p className="text-gray-600 mt-1">
              {products.length} {products.length === 1 ? "item" : "items"} available
            </p>
          </div>
        </div>

        {/* Sort */}
        <div className="flex justify-end">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border-2 border-gray-300 rounded-md focus:border-primary focus:outline-none bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
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
              title="No products in this category"
              message="Check back soon for new listings!"
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

export default CategoryPage;