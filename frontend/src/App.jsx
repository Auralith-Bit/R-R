import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Manufacturing from "./pages/Manufacturing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CatalogProvider } from "./context/CatalogContext";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  return (
    <HelmetProvider>
      <CatalogProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/manufacturing" element={<Manufacturing />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route
                  path="*"
                  element={
                    <div className="container" style={{ paddingTop: 60, paddingBottom: 60, textAlign: "center" }}>
                      <h2>404 — Page Not Found</h2>
                    </div>
                  }
                />
              </Routes>
              <Footer />
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </CatalogProvider>
    </HelmetProvider>
  );
}
