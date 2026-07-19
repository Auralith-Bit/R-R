import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiSearch, FiHeart, FiShoppingCart, FiMessageCircle, FiMenu, FiX } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useCatalog } from "../context/CatalogContext";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { totalCount } = useCart();
  const { count } = useWishlist();
  const { pages, settings } = useCatalog();
  const navData = (pages.shared || {}).navbar || {};
  const whatsAppNumber = settings?.whatsappNumber || "9779857021032";

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      setMenuOpen(false);
    }
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className={`navbar ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container navbar-inner">
        <NavLink to="/" className="brand" onClick={closeMenu}>
          <img src="/images/Logo.png" alt="Riya & Rakshya logo" className="brand-logo" />
          <span className="brand-text">
            Riya &amp; Rakshya
            <small>Food products</small>
          </span>
        </NavLink>

        <button
          className="nav-burger"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <NavLink to="/" end onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/products" onClick={closeMenu}>
            Products
          </NavLink>
          <NavLink to="/manufacturing" onClick={closeMenu}>
            Manufacturing
          </NavLink>
          <NavLink to="/about" onClick={closeMenu}>
            About
          </NavLink>
          <NavLink to="/contact" onClick={closeMenu}>
            Contact
          </NavLink>

          <form className="search-box mobile-only" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search items"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="search-submit" aria-label="Search">
              <FiSearch />
            </button>
          </form>

          <a
            className="btn btn-whatsapp mobile-only"
            href={`https://wa.me/${whatsAppNumber}`}
            target="_blank"
            rel="noreferrer"
          >
            <FiMessageCircle /> {navData.whatsappText || "WhatsApp"}
          </a>
        </nav>

        <div className="nav-right">
          <form className="search-box desktop-only" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search items"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="search-submit" aria-label="Search">
              <FiSearch />
            </button>
          </form>

          <NavLink to="/wishlist" className="icon-badge" aria-label="Wishlist">
            <FiHeart />
            {count > 0 && <span className="count">{count}</span>}
          </NavLink>

          <NavLink to="/cart" className="icon-badge" aria-label="Cart">
            <FiShoppingCart />
            {totalCount > 0 && <span className="count">{totalCount}</span>}
          </NavLink>

          <a
            className="btn btn-whatsapp desktop-only"
            href={`https://wa.me/${whatsAppNumber}`}
            target="_blank"
            rel="noreferrer"
          >
            <FiMessageCircle /> {navData.whatsappText || "WhatsApp"}
          </a>
        </div>
      </div>
    </header>
  );
}
