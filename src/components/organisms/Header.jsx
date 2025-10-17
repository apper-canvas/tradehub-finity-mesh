import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Dropdown, { DropdownItem, DropdownDivider } from "@/components/atoms/Dropdown";
import SearchModal from "@/components/molecules/SearchModal";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/hooks/useAuth";
const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const { currentUser, isAuthenticated, logout } = useAuth();

  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();

  const handleSellClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate("/sell");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };
return (
    <>
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
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

            {/* Center-Left Browse Button */}
            <div className="hidden md:flex flex-1 ml-8">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/products")}
                className="gap-2"
              >
                <ApperIcon name="Grid3x3" size={18} />
                Browse
              </Button>
            </div>

            {/* Right Side Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {/* Search Icon */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Search"
              >
                <ApperIcon name="Search" size={20} />
              </button>

              {/* Sell Item Button */}
              <Button
                variant="default"
                size="sm"
                onClick={handleSellClick}
                className="bg-accent hover:bg-accent/90 text-white gap-2"
              >
                <ApperIcon name="Plus" size={18} />
                Sell Item
              </Button>

              {/* Cart Icon with Badge */}
              <button
                onClick={() => navigate("/cart")}
                className="relative p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Cart"
              >
                <ApperIcon name="ShoppingCart" size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>

              {/* Wishlist Icon with Badge */}
              <button
                onClick={() => navigate("/wishlist")}
                className="relative p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Wishlist"
              >
                <ApperIcon name="Heart" size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </button>

              {/* User Profile or Auth Buttons */}
{isAuthenticated && currentUser ? (
                <Dropdown
                  trigger={
                    <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <img
                        src={currentUser?.avatar || 'https://ui-avatars.com/api/?name=User&background=D2691E&color=fff'}
                        alt={currentUser?.name || 'User'}
                        className="w-8 h-8 rounded-full"
                      />
                      <ApperIcon name="ChevronDown" size={16} className="text-gray-600" />
                    </button>
                  }
                  align="right"
                >
                  <div className="px-4 py-2 border-b border-gray-200">
<p className="font-medium text-gray-900">{currentUser?.name || 'User'}</p>
                    <p className="text-sm text-gray-500">{currentUser?.email || 'user@example.com'}</p>
                  </div>
                  <DropdownItem
onClick={() => navigate("/dashboard")}
                    icon={(props) => <ApperIcon name="LayoutDashboard" {...props} />}
                  >
                    My Dashboard
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => navigate("/seller-dashboard")}
                    icon={(props) => <ApperIcon name="Store" {...props} />}
                  >
                    Seller Dashboard
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => navigate("/my-listings")}
                    icon={(props) => <ApperIcon name="Package" {...props} />}
                  >
                    My Listings
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => navigate("/orders")}
                    icon={(props) => <ApperIcon name="ShoppingBag" {...props} />}
                  >
                    My Orders
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => navigate("/account-settings")}
                    icon={(props) => <ApperIcon name="Settings" {...props} />}
                  >
                    Account Settings
                  </DropdownItem>
                  <DropdownDivider />
                  <DropdownItem
                    onClick={handleLogout}
                    icon={(props) => <ApperIcon name="LogOut" {...props} />}
                    className="text-error hover:bg-error/5"
                  >
                    Logout
                  </DropdownItem>
                </Dropdown>
              ) : (
                <>
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
                    onClick={() => navigate("/sign-up")}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    Sign Up
                  </Button>
                </>
              )}
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
                    navigate("/products");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors"
                >
                  <ApperIcon name="Grid3x3" size={20} />
                  <span className="font-medium">Browse</span>
                </button>
                <button
                  onClick={() => {
                    setSearchModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors"
                >
                  <ApperIcon name="Search" size={20} />
                  <span className="font-medium">Search</span>
                </button>
                <button
                  onClick={() => {
                    handleSellClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-white bg-accent hover:bg-accent/90 rounded-lg transition-colors"
                >
                  <ApperIcon name="Plus" size={20} />
                  <span className="font-medium">Sell Item</span>
                </button>
                <button
                  onClick={() => {
                    navigate("/cart");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <ApperIcon name="ShoppingCart" size={20} />
                    <span className="font-medium">Cart</span>
                  </div>
                  {cartCount > 0 && (
                    <Badge variant="primary">{cartCount}</Badge>
                  )}
                </button>
                <button
                  onClick={() => {
                    navigate("/wishlist");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <ApperIcon name="Heart" size={20} />
                    <span className="font-medium">Wishlist</span>
                  </div>
                  {wishlistCount > 0 && (
                    <Badge variant="primary">{wishlistCount}</Badge>
                  )}
                </button>

                <div className="pt-2 border-t border-gray-200 mt-2">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 mb-2">
                        <div className="flex items-center gap-3">
                          <img
src={currentUser?.avatar || 'https://ui-avatars.com/api/?name=User&background=D2691E&color=fff'}
                            alt={currentUser?.name || 'User'}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
<p className="font-medium text-gray-900">{currentUser?.name || 'User'}</p>
                            <p className="text-sm text-gray-500">{currentUser?.email || 'user@example.com'}</p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
navigate("/dashboard");
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors"
                      >
                        <ApperIcon name="LayoutDashboard" size={20} />
                        <span className="font-medium">My Dashboard</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate("/seller-dashboard");
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors"
                      >
                        <ApperIcon name="Store" size={20} />
                        <span className="font-medium">Seller Dashboard</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate("/my-listings");
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors"
                      >
                        <ApperIcon name="Package" size={20} />
                        <span className="font-medium">My Listings</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate("/orders");
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors"
                      >
                        <ApperIcon name="ShoppingBag" size={20} />
                        <span className="font-medium">My Orders</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate("/account-settings");
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors"
                      >
                        <ApperIcon name="Settings" size={20} />
                        <span className="font-medium">Account Settings</span>
                      </button>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-error hover:bg-error/5 rounded-lg transition-colors"
                      >
                        <ApperIcon name="LogOut" size={20} />
                        <span className="font-medium">Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
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
                          navigate("/sign-up");
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
                      >
                        <ApperIcon name="UserPlus" size={20} />
                        <span className="font-medium">Sign Up</span>
                      </button>
                    </>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

</header>
    </>
  );
};

export default Header;