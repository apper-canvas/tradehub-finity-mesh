import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import HomePage from "@/components/pages/HomePage";
import SearchResultsPage from "@/components/pages/SearchResultsPage";
import ProductDetailPage from "@/components/pages/ProductDetailPage";
import CategoryPage from "@/components/pages/CategoryPage";
import CreateListingPage from "@/components/pages/CreateListingPage";
import MyListingsPage from "@/components/pages/MyListingsPage";
import CartPage from "@/components/pages/CartPage";
import ProductsPage from "@/components/pages/ProductsPage";
import WishlistPage from "@/components/pages/WishlistPage";
import LoginPage from "@/components/pages/LoginPage";
import SignUpPage from "@/components/pages/SignUpPage";
import DashboardPage from "@/components/pages/DashboardPage";
import SellerDashboardPage from "@/components/pages/SellerDashboardPage";
import MyOrdersPage from "@/components/pages/MyOrdersPage";
import AccountSettingsPage from "@/components/pages/AccountSettingsPage";
function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
<Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchResultsPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="category/:categoryId" element={<CategoryPage />} />
          <Route path="sell" element={<CreateListingPage />} />
          <Route path="my-listings" element={<MyListingsPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="sign-up" element={<SignUpPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="seller-dashboard" element={<SellerDashboardPage />} />
          <Route path="orders" element={<MyOrdersPage />} />
          <Route path="account-settings" element={<AccountSettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;