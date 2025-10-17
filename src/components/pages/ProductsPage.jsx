import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import productService from "@/services/api/productService";
import categoryService from "@/services/api/categoryService";

const ProductsPage = () => {
const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          productService.getAll(),
          categoryService.getAll()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Create category lookup map
  const categoryMap = categories.reduce((acc, category) => {
    acc[category.Id] = category;
    return acc;
  }, {});

  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    const categoryId = product.categoryId;
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(product);
    return acc;
  }, {});

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
if (products.length === 0) return <Empty title="No products available" message="Check back soon for new listings!" />;

return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Browse Products
          </h1>
          <p className="text-gray-500 mt-1">
            Discover {products.length} amazing items across {categories.length} categories
          </p>
        </div>

        {/* Products grouped by category */}
        <div className="space-y-8">
          {Object.keys(productsByCategory).map((categoryId) => {
            const category = categoryMap[categoryId];
            const categoryProducts = productsByCategory[categoryId];
            
            if (!category) return null;

            return (
              <motion.div
                key={categoryId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Category Header */}
                <div className="flex items-center gap-4 pb-3 border-b-2 border-gray-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-md">
                    <ApperIcon name={category.icon || "Package"} size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display font-bold text-2xl text-gray-900">
                      {category.name}
                    </h2>
                  </div>
                  <Badge variant="secondary" className="px-3 py-1">
                    {categoryProducts.length} {categoryProducts.length === 1 ? "item" : "items"}
                  </Badge>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categoryProducts.map((product, index) => (
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
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default ProductsPage;