import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { useCart } from "@/hooks/useCart";
import categoryService from "@/services/api/categoryService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const isAuthenticated = false; // TODO: Replace with actual auth state

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (error) {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleSellClick = () => {
    if (!isAuthenticated) {
      toast.info("Please login to sell items");
      return;
    }
    navigate("/sell");
  };

return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <ApperIcon name="ShoppingBag" size={24} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl text-gray-900 hidden sm:block">
              TradeHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 flex-1 justify-center">
            {/* Browse Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setBrowseOpen(!browseOpen)}
                className="gap-2"
              >
                Browse
                <ApperIcon name={browseOpen ? "ChevronUp" : "ChevronDown"} size={16} />
              </Button>
              <AnimatePresence>
                {browseOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  >
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          navigate(`/category/${category.id}`);
                          setBrowseOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-left text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                      >
                        <ApperIcon name="Tag" size={18} />
                        <span className="font-medium">{category.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/search")}
              className="gap-2"
            >
              <ApperIcon name="Search" size={18} />
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={handleSellClick}
              disabled={!isAuthenticated}
              className="gap-2 bg-accent hover:bg-accent/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ApperIcon name="Plus" size={18} />
              Sell Item
            </Button>

            <button
              onClick={() => navigate("/cart")}
              className="relative p-2 text-gray-600 hover:text-primary transition-colors"
            >
              <ApperIcon name="ShoppingCart" size={22} />
              {getCartCount() > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {getCartCount()}
                </Badge>
              )}
            </button>

            <button
              onClick={() => navigate("/wishlist")}
              className="relative p-2 text-gray-600 hover:text-primary transition-colors"
            >
              <ApperIcon name="Heart" size={22} />
              {wishlistCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {wishlistCount}
                </Badge>
              )}
            </button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate("/signup")}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Sign Up
            </Button>
          </div>

{/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-primary"
          >
            <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 bg-white"
          >
            <nav className="px-4 py-4 space-y-2">
              <button
                onClick={() => {
                  navigate("/search");
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors"
              >
                <ApperIcon name="Search" size={20} />
                <span className="font-medium">Search</span>
              </button>

              <div className="border-t border-gray-100 my-2"></div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Categories
              </div>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    navigate(`/category/${category.id}`);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors"
                >
                  <ApperIcon name="Tag" size={20} />
                  <span className="font-medium">{category.name}</span>
                </button>
              ))}

              <div className="border-t border-gray-100 my-2"></div>

              <button
                onClick={() => {
                  handleSellClick();
                  if (isAuthenticated) {
                    setMobileMenuOpen(false);
                  }
                }}
                disabled={!isAuthenticated}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-white bg-accent hover:bg-accent/90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ApperIcon name="Plus" size={20} />
                <span className="font-medium">Sell Item</span>
              </button>

              <button
                onClick={() => {
                  navigate("/cart");
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 text-left text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ApperIcon name="ShoppingCart" size={20} />
                  <span className="font-medium">Cart</span>
                </div>
                {getCartCount() > 0 && (
                  <Badge variant="destructive" className="ml-auto">
                    {getCartCount()}
                  </Badge>
                )}
              </button>

              <button
                onClick={() => {
                  navigate("/wishlist");
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 text-left text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ApperIcon name="Heart" size={20} />
                  <span className="font-medium">Wishlist</span>
                </div>
                {wishlistCount > 0 && (
                  <Badge variant="destructive" className="ml-auto">
                    {wishlistCount}
                  </Badge>
                )}
              </button>

              <div className="border-t border-gray-100 my-2"></div>

              <button
                onClick={() => {
                  navigate("/login");
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors"
              >
                <ApperIcon name="LogIn" size={20} />
                <span className="font-medium">Login</span>
              </button>
              <button
                onClick={() => {
                  navigate("/signup");
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
              >
                <ApperIcon name="UserPlus" size={20} />
                <span className="font-medium">Sign Up</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
};

export default Header;