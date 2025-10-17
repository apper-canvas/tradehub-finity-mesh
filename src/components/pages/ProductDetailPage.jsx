import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { formatDistanceToNow, format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import productService from "@/services/api/productService";
import sellerService from "@/services/api/sellerService";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [zoomOpen, setZoomOpen] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const productData = await productService.getById(id);
      if (!productData) {
        setError("Product not found");
        return;
      }
      setProduct(productData);

      const [sellerData, related] = await Promise.all([
        sellerService.getById(productData.sellerId),
        productService.getByCategory(productData.category)
      ]);
      setSeller(sellerData);
      setRelatedProducts(related.filter(p => p.Id !== productData.Id).slice(0, 4));
    } catch (err) {
      setError(err.message || "Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`Added ${quantity} item(s) to cart!`);
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.Id)) {
      removeFromWishlist(product.Id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist!");
    }
  };

  const handleContactSeller = () => {
    toast.info("Contact seller feature coming soon!");
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out ${product.title} on TradeHub`;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
        break;
      default:
        break;
    }
    setShareMenuOpen(false);
  };

  const handleViewSellerItems = () => {
    navigate(`/search?seller=${seller.Id}`);
  };

  if (loading) return <Loading type="detail" />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!product) return <Error message="Product not found" />;

  const getConditionVariant = (condition) => {
    switch (condition) {
      case "Like New": return "success";
      case "Used": return "info";
      case "Refurbished": return "warning";
      default: return "default";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <button onClick={() => navigate("/")} className="hover:text-primary">
          Home
        </button>
        <ApperIcon name="ChevronRight" size={14} />
        <button onClick={() => navigate(`/category/${product.category}`)} className="hover:text-primary">
          {product.category}
        </button>
        <ApperIcon name="ChevronRight" size={14} />
        <span className="text-gray-900 font-medium">{product.title}</span>
      </div>

      {/* Product Details */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Images Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          {/* Main Image with Zoom */}
          <div 
            className="aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-lg cursor-zoom-in relative group"
            onClick={() => setZoomOpen(true)}
          >
            <img
              src={product.images[selectedImage]}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <ApperIcon name="ZoomIn" size={16} />
              Click to zoom
            </div>
          </div>

          {/* Thumbnail Navigation */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden transition-all ${
                    selectedImage === index
                      ? "ring-4 ring-primary shadow-lg scale-105"
                      : "opacity-70 hover:opacity-100 hover:scale-105"
                  }`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <Badge variant={getConditionVariant(product.condition)}>
                {product.condition}
              </Badge>
              <span className="text-sm text-gray-500">
                Listed {formatDistanceToNow(new Date(product.datePosted), { addSuffix: true })}
              </span>
            </div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-gray-900 mb-4">
              {product.title}
            </h1>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="font-display font-bold text-5xl text-primary">
                ${product.price.toLocaleString()}
              </span>
            </div>

            {/* Category Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => navigate(`/category/${product.category}`)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
              >
                {product.category}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <ApperIcon name="MapPin" size={18} />
            <span>{product.location}</span>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center gap-4 bg-gray-100 rounded-lg w-fit">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-3 hover:bg-gray-200 rounded-l-lg transition-colors"
              >
                <ApperIcon name="Minus" size={18} />
              </button>
              <span className="px-6 font-semibold text-lg">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-3 hover:bg-gray-200 rounded-r-lg transition-colors"
              >
                <ApperIcon name="Plus" size={18} />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="flex-1"
              >
                <ApperIcon name="ShoppingCart" size={20} className="mr-2" />
                Add to Cart
              </Button>
              <Button 
                variant={isInWishlist(product.Id) ? "default" : "outline"}
                size="lg"
                onClick={handleWishlistToggle}
                className={isInWishlist(product.Id) ? "bg-primary hover:bg-primary/90" : ""}
              >
                <ApperIcon 
                  name="Heart" 
                  size={20} 
                  className={isInWishlist(product.Id) ? "fill-white" : ""}
                />
              </Button>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={handleContactSeller}
                className="flex-1"
              >
                <ApperIcon name="MessageSquare" size={20} className="mr-2" />
                Contact Seller
              </Button>
              
              {/* Share Button with Dropdown */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShareMenuOpen(!shareMenuOpen)}
                >
                  <ApperIcon name="Share2" size={20} />
                </Button>
                
                <AnimatePresence>
                  {shareMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-card-hover border border-gray-200 py-2 z-10"
                    >
                      <button
                        onClick={() => handleShare('facebook')}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 transition-colors"
                      >
                        <ApperIcon name="Facebook" size={18} />
                        <span className="text-sm">Facebook</span>
                      </button>
                      <button
                        onClick={() => handleShare('twitter')}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 transition-colors"
                      >
                        <ApperIcon name="Twitter" size={18} />
                        <span className="text-sm">Twitter</span>
                      </button>
                      <button
                        onClick={() => handleShare('whatsapp')}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 transition-colors"
                      >
                        <ApperIcon name="MessageCircle" size={18} />
                        <span className="text-sm">WhatsApp</span>
                      </button>
                      <div className="border-t border-gray-200 my-1"></div>
                      <button
                        onClick={() => handleShare('copy')}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 transition-colors"
                      >
                        <ApperIcon name="Link" size={18} />
                        <span className="text-sm">Copy Link</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Seller Information Card */}
          {seller && (
            <div className="p-6 bg-surface rounded-lg shadow-card space-y-4 border-2 border-gray-100">
              <h3 className="font-display font-semibold text-lg">Seller Information</h3>
              <div className="flex items-center gap-4">
                <img
                  src={seller.avatar}
                  alt={seller.name}
                  className="w-16 h-16 rounded-full bg-gray-200 object-cover"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{seller.name}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <ApperIcon name="Star" size={14} className="fill-warning text-warning" />
                    <span>{seller.rating} rating</span>
                    <span>•</span>
                    <span>{seller.totalSales} sales</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <ApperIcon name="Calendar" size={14} />
                    <span>Member since {format(new Date(seller.memberSince), 'MMM yyyy')}</span>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleViewSellerItems}
              >
                <ApperIcon name="Package" size={18} className="mr-2" />
                View All Seller Items
              </Button>
            </div>
          )}

          {/* Description */}
          <div className="space-y-3 pt-6 border-t border-gray-200">
            <h3 className="font-display font-semibold text-lg">Description</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>
        </motion.div>
      </div>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {zoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setZoomOpen(false)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              onClick={() => setZoomOpen(false)}
            >
              <ApperIcon name="X" size={32} />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={product.images[selectedImage]}
              alt={product.title}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-12 border-t border-gray-200">
          <h2 className="font-display font-bold text-2xl text-gray-900">
            Similar Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.Id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;