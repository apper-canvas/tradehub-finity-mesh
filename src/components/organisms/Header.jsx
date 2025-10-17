import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import { useCart } from "@/hooks/useCart";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { getCartCount } = useCart();

  const navItems = [
    { label: "Browse", path: "/", icon: "Home" },
    { label: "Sell Item", path: "/sell", icon: "Plus" },
    { label: "My Listings", path: "/my-listings", icon: "Package" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <ApperIcon name="ShoppingBag" size={24} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl text-gray-900 hidden sm:block">
              TradeHub
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <SearchBar size="md" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                onClick={() => navigate(item.path)}
                className="gap-2"
              >
                <ApperIcon name={item.icon} size={18} />
                {item.label}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/cart")}
              className="relative"
            >
              <ApperIcon name="ShoppingCart" size={18} />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {getCartCount()}
                </span>
              )}
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-primary"
          >
            <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <SearchBar size="sm" />
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
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors"
                >
                  <ApperIcon name={item.icon} size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
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
                  <span className="bg-accent text-white text-xs px-2 py-1 rounded-full font-bold">
                    {getCartCount()}
                  </span>
                )}
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex items-center justify-around px-4 py-3">
          <button
            onClick={() => navigate("/")}
            className="flex flex-col items-center gap-1 text-gray-600 hover:text-primary"
          >
            <ApperIcon name="Home" size={20} />
            <span className="text-xs">Browse</span>
          </button>
          <button
            onClick={() => navigate("/search")}
            className="flex flex-col items-center gap-1 text-gray-600 hover:text-primary"
          >
            <ApperIcon name="Search" size={20} />
            <span className="text-xs">Search</span>
          </button>
          <button
            onClick={() => navigate("/sell")}
            className="flex flex-col items-center gap-1 -mt-6"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
              <ApperIcon name="Plus" size={24} className="text-white" />
            </div>
            <span className="text-xs text-primary font-medium">Sell</span>
          </button>
          <button
            onClick={() => navigate("/my-listings")}
            className="flex flex-col items-center gap-1 text-gray-600 hover:text-primary"
          >
            <ApperIcon name="Package" size={20} />
            <span className="text-xs">Listings</span>
          </button>
          <button
            onClick={() => navigate("/cart")}
            className="flex flex-col items-center gap-1 text-gray-600 hover:text-primary relative"
          >
            <ApperIcon name="ShoppingCart" size={20} />
            <span className="text-xs">Cart</span>
            {getCartCount() > 0 && (
              <span className="absolute -top-1 right-2 w-4 h-4 bg-accent text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {getCartCount()}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;