import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiMessageCircle } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useCatalog } from "../context/CatalogContext";
import { priceForSize, defaultSize, isAvailable } from "../utils/catalogHelpers";

export default function ProductCard({ product, hidePrice }) {
  const [size, setSize] = useState(defaultSize(product));
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { settings } = useCatalog();
  const [justAdded, setJustAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const price = priceForSize(product, size);
  const wishlisted = isWishlisted(product.id);
  const available = isAvailable(product);

  function handleAddToCart() {
    if (!available) return;
    addItem(product, size, price, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  }

  return (
    <div className="product-card">
      <div className="product-media">
        <Link to={`/products/${product.id}`}>
          <img
            src={imgError ? "/images/Logo.png" : encodeURI(product.image)}
            alt={product.name}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        </Link>
        {product.badge && <span className="tag-pill">{product.badge}</span>}
        <button
          className={`wish-btn ${wishlisted ? "active" : ""}`}
          onClick={() => toggleWishlist(product)}
          aria-label="Toggle wishlist"
        >
          <FiHeart />
        </button>
      </div>
      <div className="product-body">
        <Link to={`/products/${product.id}`}>
          <h3>{product.name}</h3>
        </Link>
        <p className="tagline">{product.category}</p>
        {!hidePrice && (
          <>
            <div className="price-row">
              {available ? (
                <>
                  Rs.{price} <span className="unit">/ {size}</span>
                </>
              ) : (
                <span className="unit">Price on request</span>
              )}
            </div>
            {product.sizes?.length > 1 && (
              <div className="size-pills">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    className={`size-pill ${size === s ? "selected" : ""}`}
                    onClick={() => setSize(s)}
                    type="button"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
        <div className="card-actions">
          <button
            className="btn btn-red"
            onClick={handleAddToCart}
            disabled={!available}
          >
            <FiShoppingCart /> {justAdded ? "Added!" : "Add to Cart"}
          </button>
          <a
            className="btn btn-whatsapp"
            href={`https://wa.me/${settings?.whatsappNumber || "9779857021032"}?text=${encodeURIComponent(
              `Hi, I'm interested in ${product.name} (${size})`
            )}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Chat via WhatsApp"
          >
            <FiMessageCircle />
          </a>
        </div>
      </div>
    </div>
  );
}
