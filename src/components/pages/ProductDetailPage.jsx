import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import productService from "@/services/api/productService";
import sellerService from "@/services/api/sellerService";
import { useCart } from "@/hooks/useCart";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    toast.success("Added to cart!");
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
        {/* Images */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-lg">
            <img
              src={product.images[selectedImage]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden transition-all ${
                    selectedImage === index
                      ? "ring-4 ring-primary shadow-lg"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
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
            <div className="flex items-baseline gap-2">
              <span className="font-display font-bold text-5xl text-primary">
                ${product.price.toLocaleString()}
              </span>
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

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="flex-1"
            >
              <ApperIcon name="ShoppingCart" size={20} className="mr-2" />
              Add to Cart
            </Button>
            <Button variant="outline" size="lg">
              <ApperIcon name="Heart" size={20} />
            </Button>
          </div>

          {/* Seller Info */}
          {seller && (
            <div className="p-6 bg-surface rounded-lg shadow-card space-y-4 border-2 border-gray-100">
              <h3 className="font-display font-semibold text-lg">Seller Information</h3>
              <div className="flex items-center gap-4">
                <img
                  src={seller.avatar}
                  alt={seller.name}
                  className="w-16 h-16 rounded-full bg-gray-200"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{seller.name}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ApperIcon name="Star" size={14} className="fill-warning text-warning" />
                    <span>{seller.rating} rating</span>
                    <span>•</span>
                    <span>{seller.totalSales} sales</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <ApperIcon name="MessageSquare" size={18} className="mr-2" />
                Contact Seller
              </Button>
            </div>
          )}

          {/* Description */}
          <div className="space-y-3 pt-6 border-t border-gray-200">
            <h3 className="font-display font-semibold text-lg">Description</h3>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>
        </motion.div>
      </div>

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