import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiMessageCircle, FiTruck, FiCheckCircle, FiThumbsUp, FiShoppingBag } from "react-icons/fi";
import { FaMedal, FaLeaf, FaBolt, FaHeart } from "react-icons/fa";
import { useCatalog } from "../context/CatalogContext";
import PageHero from "../components/PageHero";
import Seo from "../components/Seo";

export default function Varieties() {
  const { varieties } = useCatalog();
  const [imgErrors, setImgErrors] = useState({});

  return (
    <div>
      <Seo
        title="Our Snack Varieties"
        description="Explore the full range of R&R Food Products (Riya and Rakshya Food Products, RNR Food Products) — authentic Nepali namkeen, chips, noodles and snacks made in Bhairahawa, Nepal."
        path="/varieties"
      />
      <PageHero
        breadcrumb="HOME > VARIETIES"
        title="Our Snack Varieties"
        subtitle="Explore our wide range of authentic, mouth-watering snacks crafted to satisfy every mood."
      />

      <div style={{ background: "var(--cream)", padding: "60px 0" }}>
        <div className="container varieties-grid">
          {varieties.map((v) => (
            <Link
              key={v.id}
              to={`/products?category=${encodeURIComponent(v.name)}`}
              className="variety-tile"
            >
              <img
                src={imgErrors[v.id] ? "/images/Logo.png" : encodeURI(v.image)}
                alt={v.name}
                loading="lazy"
                onError={() => setImgErrors(prev => ({ ...prev, [v.id]: true }))}
              />
              <div className="variety-tile-overlay" />
              <div className="variety-tile-text">
                <h3 style={{ margin: "0 0 4px" }}>{v.name}</h3>
                <p style={{ margin: "0 0 8px", fontSize: 13, opacity: 0.9 }}>
                  {v.description}
                </p>
                <span style={{ fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}>
                  Explore <FiArrowRight />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="container" style={{ paddingTop: 60, paddingBottom: 60 }}>
        <div className="varieties-feature" style={{ minHeight: 240 }}>
          <img
            src={encodeURI("/images/products/Korean_Hot_Spicy.png")}
            alt="Featured chips collection"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)" }} />
          <div style={{ position: "relative", padding: 40, color: "#fff", maxWidth: 600 }}>
            <span
              style={{
                background: "var(--gold)",
                color: "#333",
                fontSize: 11,
                fontWeight: 700,
                padding: "4px 12px",
                borderRadius: 999,
              }}
            >
              Featured
            </span>
            <h2 style={{ margin: "14px 0" }}>The Ultimate Crunchy Chips Experience</h2>
            <p style={{ marginBottom: 20, opacity: 0.9 }}>
              Discover our best-selling instant chips. Perfect texture, bold
              flavours, ready to enjoy anytime.
            </p>
            <Link to="/products" className="btn btn-red">
              View Collection <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>

      <div style={{ background: "linear-gradient(120deg,#d94b2b,#f0b90b)", padding: "10px 0" }}>
        <div className="container varieties-cta">
          <h2 style={{ marginTop: 0, fontSize: 22 }}>Not Sure What to Try?</h2>
          <p style={{ maxWidth: 480, margin: "0 auto 14px", opacity: 0.85, fontSize: 14 }}>
            Explore our full catalog and discover snacks crafted for every taste.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 14, flexWrap: "wrap" }}>
            <Link to="/products" className="btn btn-white">
              <FiShoppingBag /> Explore all Products
            </Link>
            <a
              href="https://wa.me/9779857021032"
              target="_blank"
              rel="noreferrer"
              className="btn btn-whatsapp"
            >
              <FiMessageCircle /> Chat on WhatsApp
            </a>
          </div>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", fontSize: 13, flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.2)", padding: "6px 14px", borderRadius: 999 }}>
              <FiTruck /> Free Delivery
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.2)", padding: "6px 14px", borderRadius: 999 }}>
              <FiCheckCircle /> Quality Ingredients
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.2)", padding: "6px 14px", borderRadius: 999 }}>
              <FiThumbsUp /> Great Taste
            </span>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 60, paddingBottom: 60 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <p style={{ color: "var(--red)", fontWeight: 700, marginBottom: 6 }}>WHY CHOOSE US</p>
          <h2 style={{ marginTop: 0 }}>Snacks You Can Trust</h2>
        </div>
        <div className="varieties-why-grid">
          {[
            { icon: <FaMedal />, title: "10+ Years", desc: "Trusted experience in crafting authentic Nepali snacks" },
            { icon: <FaLeaf />, title: "Pure Vegetarian", desc: "100% vegetarian products made with natural ingredients" },
            { icon: <FaBolt />, title: "Fresh & Fast", desc: "Quick production and delivery to keep snacks fresh" },
            { icon: <FaHeart />, title: "Loved by All", desc: "Trusted by thousands of families across 77 districts" },
          ].map((item) => (
            <div key={item.title} style={{ background: "#fff", borderRadius: 12, padding: 24, textAlign: "center", border: "1px solid var(--border-color)" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--cream)", color: "var(--red)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 20 }}>
                {item.icon}
              </div>
              <h4 style={{ margin: "0 0 6px" }}>{item.title}</h4>
              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
