import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiFacebook, FiInstagram, FiTwitter, FiArrowRight } from "react-icons/fi";
import { useCatalog } from "../context/CatalogContext";

export default function Footer() {
  const { categories, settings, pages } = useCatalog();
  const footerData = (pages.shared || {}).footer || {};
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  }

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="brand" style={{ marginBottom: 12 }}>
            <img src="/images/Logo.png" alt="Riya & Rakshya logo" className="brand-logo" />
            <span className="brand-text" style={{ color: "#f0b90b" }}>
              Riya &amp; Rakshya
              <small style={{ color: "#d99a00" }}>Food products</small>
            </span>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.6 }}>
            {footerData.tagline || "Bringing the authentic taste of Nepal to your home with our premium quality snacks, tasty noodles and namkeen."}
          </p>
          <div className="footer-social">
            <a href={footerData.socialFacebook || "https://facebook.com"} target="_blank" rel="noreferrer">
              <FiFacebook />
            </a>
            <a href={footerData.socialInstagram || "https://instagram.com"} target="_blank" rel="noreferrer">
              <FiInstagram />
            </a>
            <a href={footerData.socialTwitter || "https://twitter.com"} target="_blank" rel="noreferrer">
              <FiTwitter />
            </a>
          </div>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/manufacturing">Manufacturing</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4>Categories</h4>
          <ul>
            {categories.map((c) => (
              <li key={c}>
                <Link
                  to={c === "All Products" ? "/products" : `/products?category=${encodeURIComponent(c)}`}
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Contact Us</h4>
          <ul>
            <li>{settings?.address || "S.No.-4, SugarMill, Bhairahwa, Rupandehi"}</li>
            <li>{settings?.contactPhone || "+977 982-0299711"}</li>
            <li>{settings?.contactEmail || "Support@riyarakshya.com.np"}</li>
          </ul>
        </div>

        <div className="subscribe-box">
          <h4 style={{ marginBottom: 4 }}>{footerData.subscribeHeading || "Subscribe"}</h4>
          <form className="subscribe-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" aria-label="Subscribe">
              <FiArrowRight />
            </button>
          </form>
          {subscribed ? (
            <p style={{ fontSize: 13, color: "var(--gold)" }}>
              Thanks for subscribing!
            </p>
          ) : (
            <p style={{ fontSize: 13, lineHeight: 1.6 }}>
              {footerData.subscribeDescription || "Subscribe to get the latest snack drops, offers and distributor news straight to your inbox."}
            </p>
          )}
        </div>
      </div>

      <div className="container footer-bottom">
        {footerData.copyright || "\u00a9 2026 Riya & Rakshya Food Products. All rights reserved."}
      </div>
    </footer>
  );
}
