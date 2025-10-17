import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import categoryService from "@/services/api/categoryService";
import ApperIcon from "@/components/ApperIcon";
import FilterSidebar from "@/components/organisms/FilterSidebar";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ProductCard from "@/components/molecules/ProductCard";
import Empty from "@/components/ui/Empty";

const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist, clearWishlist, moveToCart } = useWishlist();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: undefined,
    priceRange: { min: "", max: "" },
    condition: undefined,
  });

  useEffect(() => {
    if (!user) {
      toast.info("Please login to view your wishlist");
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAll();
        const categoriesWithCounts = data.map(cat => ({
          ...cat,
          count: wishlistItems.filter(item => item.categoryId === cat.Id).length
        }));
        setCategories(categoriesWithCounts);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, [wishlistItems]);

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all items from your wishlist?")) {
      clearWishlist();
    }
  };

  const handleShareWishlist = async () => {
    const wishlistText = `Check out my wishlist on TradeHub!\n\n${wishlistItems.map(item => `- ${item.name} ($${item.price})`).join('\n')}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My TradeHub Wishlist",
          text: wishlistText,
        });
        toast.success("Wishlist shared successfully");
      } catch (error) {
        if (error.name !== "AbortError") {
          toast.error("Failed to share wishlist");
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(wishlistText);
        toast.success("Wishlist copied to clipboard");
      } catch (error) {
        toast.error("Failed to copy wishlist");
      }
    }
  };

  const handleMoveToCart = (product) => {
    moveToCart(product);
  };

  const handleRemove = (productId) => {
    if (window.confirm("Remove this item from your wishlist?")) {
      removeFromWishlist(productId);
    }
  };

  const filteredItems = wishlistItems.filter(item => {
    if (filters.category && item.categoryId !== filters.category) {
      return false;
    }
    
    if (filters.priceRange?.min && item.price < parseFloat(filters.priceRange.min)) {
      return false;
    }
    
    if (filters.priceRange?.max && item.price > parseFloat(filters.priceRange.max)) {
      return false;
    }
    
    if (filters.condition && item.condition !== filters.condition) {
      return false;
    }
    
    return true;
  });

  if (!user) {
    return null;
  }

  return (
<div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-6">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              categories={categories}
            />
          </div>
        </aside>

        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
      >
<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-display font-bold text-gray-900">
                  My Wishlist
                </h1>
                <p className="text-gray-500 mt-1">
                  {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
                  {filteredItems.length !== wishlistItems.length && (
                    <span className="ml-2">
                      ({filteredItems.length} {filteredItems.length === 1 ? "matches" : "match"} filters)
                    </span>
                  )}
                </p>
              </div>
              
              {wishlistItems.length > 0 && (
                <div className="flex gap-3">
                  <Button
                    onClick={handleShareWishlist}
                    variant="outline"
                    className="gap-2"
                  >
                    <ApperIcon name="Share2" size={18} />
                    Share Wishlist
                  </Button>
                  <Button
                    onClick={handleClearAll}
                    variant="outline"
                    className="gap-2 text-error border-error hover:bg-error hover:text-white"
                  >
                    <ApperIcon name="Trash2" size={18} />
                    Clear All
</Button>
                </div>
              )}
            </div>
          </motion.div>

          {wishlistItems.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-card p-8">
                <Empty
                  icon="Heart"
                  title="Your wishlist is empty"
                  description="Save items you love to buy them later"
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
            ) : filteredItems.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-card p-8">
                <Empty
                  icon="Filter"
                  title="No items match your filters"
                  description="Try adjusting your filters to see more items"
                />
                <div className="flex justify-center mt-6">
                  <Button
                    onClick={() => setFilters({ category: undefined, priceRange: { min: "", max: "" }, condition: undefined })}
                    variant="outline"
                    className="gap-2"
                  >
                    <ApperIcon name="X" size={18} />
                    Clear Filters
</Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredItems.map((product, index) => (
                  <motion.div
                    key={product.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group"
                  >
                    <div className="cursor-pointer" onClick={() => navigate(`/products/${product.Id}`)}>
                      <div className="relative h-56 overflow-hidden bg-gray-100">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge variant={product.condition === "New" ? "success" : product.condition === "Like New" ? "info" : "warning"}>
                            {product.condition}
                          </Badge>
                        </div>
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge variant="error" className="text-sm px-4 py-2">
                              Out of Stock
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-display font-semibold text-gray-900 line-clamp-2 flex-1">
                            {product.name}
                          </h3>
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {product.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-2xl font-bold text-primary">
                              ${product.price.toFixed(2)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {product.inStock ? "In Stock" : "Out of Stock"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0 flex gap-2">
                      <Button
                        onClick={() => handleMoveToCart(product)}
                        disabled={!product.inStock}
                        className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed gap-2"
                      >
                        <ApperIcon name="ShoppingCart" size={16} />
                        Move to Cart
                      </Button>
                      <Button
                        onClick={() => handleRemove(product.Id)}
                        variant="outline"
                        className="gap-2 text-error border-error hover:bg-error hover:text-white"
                      >
                        <ApperIcon name="Trash2" size={16} />
                        Remove
                      </Button>
                    </div>
                  </motion.div>
))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;