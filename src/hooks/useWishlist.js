import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useCart } from "./useCart";

const WISHLIST_STORAGE_KEY = "tradehub_wishlist";

export const useWishlist = () => {
  const { addToCart, isInCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState(() => {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (product) => {
    setWishlistItems(prev => {
      const existing = prev.find(item => item.Id === product.Id);
      if (existing) {
        toast.info("Item already in wishlist");
        return prev;
      }
      toast.success("Added to wishlist");
      return [...prev, { ...product, addedAt: new Date().toISOString() }];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems(prev => {
      const filtered = prev.filter(item => item.Id !== productId);
      toast.success("Removed from wishlist");
      return filtered;
    });
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.Id === productId);
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.Id)) {
      removeFromWishlist(product.Id);
    } else {
      addToWishlist(product);
    }
  };

const clearWishlist = () => {
    setWishlistItems([]);
    toast.success("Wishlist cleared");
  };

  const moveToCart = (product) => {
    if (isInCart(product.Id)) {
      toast.info("Item already in cart");
      return;
    }
    
    removeFromWishlist(product.Id);
    addToCart(product);
    toast.success("Moved to cart");
  };

  const getWishlistCount = () => {
    return wishlistItems.length;
  };
return {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    clearWishlist,
    moveToCart,
    getWishlistCount
  };
};