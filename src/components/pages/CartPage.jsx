import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import CartItem from "@/components/molecules/CartItem";
import Empty from "@/components/ui/Empty";
import { useCart } from "@/hooks/useCart";

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();

  const handleCheckout = () => {
    toast.success("Checkout successful! (Demo)");
    clearCart();
    navigate("/");
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 15 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Empty
          title="Your cart is empty"
          message="Browse our marketplace and add items to your cart"
          icon="ShoppingCart"
          action={() => navigate("/")}
          actionLabel="Start Shopping"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-display font-bold text-3xl text-gray-900 mb-8">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {cartItems.map((item) => (
              <CartItem
                key={item.productId}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface rounded-lg shadow-card p-6 sticky top-24 space-y-6"
          >
            <h2 className="font-display font-semibold text-xl text-gray-900">
              Order Summary
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="pt-3 border-t-2 border-gray-200">
                <div className="flex justify-between items-baseline">
                  <span className="font-display font-semibold text-lg text-gray-900">
                    Total
                  </span>
                  <span className="font-display font-bold text-3xl text-primary">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <Button onClick={handleCheckout} className="w-full" size="lg">
              <ApperIcon name="CreditCard" size={20} className="mr-2" />
              Proceed to Checkout
            </Button>

            <button
              onClick={() => navigate("/")}
              className="w-full text-center text-primary hover:text-primary/80 font-medium"
            >
              Continue Shopping
            </button>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <ApperIcon name="Shield" size={18} className="flex-shrink-0 text-success" />
                <div>
                  <div className="font-semibold text-gray-900 mb-1">
                    Secure Checkout
                  </div>
                  <p>Your payment information is encrypted and secure</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;