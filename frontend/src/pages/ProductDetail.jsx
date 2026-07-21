import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiMessageCircle, FiShield, FiClock } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";
import { getProductById, priceForSize, defaultSize, isAvailable } from "../utils/catalogHelpers";
import { useCart } from "../context/CartContext";
import { useCatalog } from "../context/CatalogContext";
import ProductCard from "../components/ProductCard";
import PageHero from "../components/PageHero";
import Seo from "../components/Seo";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, settings } = useCatalog();
  const product = getProductById(products, id);
  const { addItem } = useCart();
  const [size, setSize] = useState(defaultSize(product));
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!product) {
    return (
      <div className="container" style={{ paddingTop: 60, paddingBottom: 60, textAlign: "center" }}>
        <Seo title="Product Not Found" description="This product could not be found." path={`/products/${id}`} noindex />
        <h2>Product not found</h2>
        <button className="btn btn-red" onClick={() => navigate("/products")}>
          Back to Products
        </button>
      </div>
    );
  }

  const price = priceForSize(product, size);
  const available = isAvailable(product);
  const related = products.filter(
    (p) => p.id !== product.id && p.category === product.category
  ).slice(0, 3);
  const relatedFallback =
    related.length > 0
      ? related
      : products.filter((p) => p.id !== product.id).slice(0, 3);

  function handleAddToCart() {
    if (!available) return;
    addItem(product, size, price, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div>
      <Seo
        title={`${product.name} — ${product.category}`}
        description={(product.description || `${product.name}, an authentic Nepali snack from R&R Food Products.`).slice(0, 160)}
        path={`/products/${product.id}`}
        image={product.image}
      />
      <PageHero
        breadcrumb={`HOME > PRODUCTS > ${product.category.toUpperCase()}`}
        title={product.name}
        subtitle={product.description?.slice(0, 120)}
        bgImage="/images/productswishlisthero.png"
      />

      <div className="container" style={{ paddingTop: 60, paddingBottom: 60 }}>
        <div className="product-detail-grid" style={{ gridTemplateColumns: "0.8fr 1.2fr" }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <img
              src={imgError ? "/images/Logo.png" : encodeURI(product.image)}
              alt={product.name}
              style={{ maxWidth: "80%", maxHeight: 360, borderRadius: 12, objectFit: "contain" }}
              onError={() => setImgError(true)}
            />
          </div>
          <div>
            <span
              style={{
                background: "#fdeed0",
                color: "#b8860b",
                padding: "6px 14px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {product.category}
            </span>
            <h1 style={{ margin: "14px 0 6px" }}>{product.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--gold)", marginBottom: 14 }}>
              {Array.from({ length: 5 }).map((_, i) =>
                i < (product.rating || 0) ? <FaStar key={i} /> : <FaRegStar key={i} />
              )}
              <span style={{ color: "var(--text-muted)", fontSize: 13, marginLeft: 6 }}>
                ({product.reviews || 0} Customer Reviews)
              </span>
            </div>
            <p style={{ lineHeight: 1.7, color: "var(--text-muted)" }}>
              {product.description}
            </p>
            <div style={{ fontSize: 28, fontWeight: 700, color: "var(--red)", margin: "14px 0" }}>
              {available ? (
                <>
                  Rs. {price}{" "}
                  <span style={{ fontSize: 14, fontWeight: 400, color: "var(--text-muted)" }}>
                    / {size}
                  </span>
                </>
              ) : (
                <span style={{ fontSize: 16, color: "var(--text-muted)" }}>
                  Price on request — message us on WhatsApp
                </span>
              )}
            </div>

            {product.sizes?.length > 1 && (
              <>
                <p style={{ fontWeight: 600, marginBottom: 8 }}>Select Size</p>
                <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      style={{
                        padding: "10px 18px",
                        borderRadius: 8,
                        border: `1px solid ${size === s ? "var(--red)" : "var(--border-color)"}`,
                        background: size === s ? "var(--red)" : "#fff",
                        color: size === s ? "#fff" : "#333",
                        fontWeight: 600,
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button
                className="btn btn-red"
                onClick={handleAddToCart}
                disabled={!available}
                style={{ flex: 1, minWidth: 160 }}
              >
                <FiShoppingCart /> {added ? "Added to Cart!" : "Add to Cart"}
              </button>
              <a
                href={`https://wa.me/${settings?.whatsappNumber || "9779820299711"}?text=${encodeURIComponent(
                  `Hi, I'm interested in ${product.name} (${size})`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-whatsapp"
                style={{ flex: 1, minWidth: 160 }}
              >
                <FiMessageCircle /> Chat via WhatsApp
              </a>
            </div>

            <div style={{ display: "flex", gap: 24, marginTop: 20, fontSize: 13, color: "var(--text-muted)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <FiShield color="#2e7d32" /> Secure Checkout
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <FiClock color="#e69500" /> Fast Delivery
              </span>
            </div>
          </div>
        </div>

        <div className="product-detail-info-grid">
          <div style={{ background: "#fff", borderRadius: 16, padding: 28 }}>
            <h3>Customer Reviews</h3>
            {(product.reviews || 0) > 0 ? (
              <div style={{ borderTop: "1px solid var(--border-color)", padding: "16px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ color: "var(--gold)", display: "flex" }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                  <strong>Verified Buyer</strong>
                </div>
                <p style={{ color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>
                  "Absolutely love this! The flavor is authentic and it's my
                  go-to evening snack. Always keep a few packets in the
                  pantry."
                </p>
                <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 10 }}>
                  Based on {product.reviews} customer reviews
                </p>
              </div>
            ) : (
              <p style={{ color: "var(--text-muted)" }}>
                No reviews yet — be the first to try {product.name}!
              </p>
            )}
          </div>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28 }}>
            <h3>Ingredients</h3>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
              {product.ingredients || "Ingredient details available on packaging."}
            </p>
            <h4>Allergy Information</h4>
            <div
              style={{
                background: "#fdeee0",
                borderRadius: 10,
                padding: 14,
                fontSize: 13,
                color: "#8a4b12",
              }}
            >
              {product.allergy || "Please check packaging for allergen details."}
            </div>
          </div>
        </div>

        <section style={{ marginTop: 60 }}>
          <p style={{ color: "var(--red)", fontWeight: 700, marginBottom: 6 }}>
            EXPLORE MORE
          </p>
          <h2 style={{ marginTop: 0 }}>You Might Also Like</h2>
          <div className="product-grid">
            {relatedFallback.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
