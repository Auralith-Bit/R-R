import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiTrash2, FiArrowRight } from "react-icons/fi";
import { useWishlist } from "../context/WishlistContext";
import { useCatalog } from "../context/CatalogContext";
import PageHero from "../components/PageHero";
import Seo from "../components/Seo";

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist();
  const { pages } = useCatalog();
  const productsHero = (pages.products || {}).hero || {};
  const [imgErrors, setImgErrors] = useState({});

  return (
    <div>
      <Seo title="Your Wishlist" description="Your saved favorite snacks from R&R Food Products." path="/wishlist" noindex />
      <PageHero
        breadcrumb="HOME &gt; Wishlist"
        title="Your Wishlist"
        subtitle="Keep track of your favorite snacks and treats, discover new flavors you'll love, and never miss out."
        bgImage={productsHero.bgImage || "/images/productswishlisthero.png"}
        mobileBgImage="/images/hero/home hero kushal namkeen.png"
      />

      <div className="container" style={{ paddingTop: 60, paddingBottom: 60 }}>
        {items.length === 0 ? (
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "80px 30px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "#fde3e3",
                color: "var(--red)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: 32,
              }}
            >
              <FiHeart />
            </div>
            <h2 style={{ marginBottom: 10 }}>Your wishlist is empty</h2>
            <p style={{ color: "var(--text-muted)", maxWidth: 420, margin: "0 auto 24px" }}>
              We haven't saved any items yet. Browse our products and click
              the heart icon to add them here.
            </p>
            <Link to="/products" className="btn btn-red">
              Browse Products <FiArrowRight />
            </Link>
          </div>
        ) : (
          <div>
            <h2 style={{ marginBottom: 6 }}>Your Wishlist</h2>
            <p style={{ color: "var(--text-muted)", marginTop: 0 }}>
              Showing <strong>{items.length}</strong> products
            </p>
            <div className="product-grid">
              {items.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-media">
                    <Link to={`/products/${product.id}`}>
                      <img
                        src={imgErrors[product.id] ? "/images/Logo.png" : encodeURI(product.image)}
                        alt={product.name}
                        onError={() => setImgErrors(prev => ({ ...prev, [product.id]: true }))}
                      />
                    </Link>
                    <span className="tag-pill">{product.category}</span>
                    <button
                      className="wish-btn active"
                      onClick={() => removeFromWishlist(product.id)}
                      aria-label="Remove from wishlist"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                  <div className="product-body">
                    <Link to={`/products/${product.id}`}>
                      <h3>{product.name}</h3>
                    </Link>
                    <p className="tagline">{product.category}</p>
                    <div className="price-row">
                      {typeof product.price === "number" ? (
                        <>
                          Rs.{product.price}{" "}
                          <span className="unit">/ {product.unit}</span>
                        </>
                      ) : (
                        <span className="unit">Price on request</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
