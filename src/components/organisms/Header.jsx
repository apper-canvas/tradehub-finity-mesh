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


          {/* Desktop Navigation */}
<nav className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/search")}
              className="gap-2"
            >
              <ApperIcon name="Search" size={18} />
              Browse
            </Button>
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
          </nav>

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
                <span className="font-medium">Browse</span>
              </button>
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