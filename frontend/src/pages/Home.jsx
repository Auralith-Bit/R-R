import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingBag, FiMessageCircle, FiArrowRight, FiCheck, FiStar, FiZap, FiHeart } from "react-icons/fi";
import { FaStar, FaMedal, FaBuilding, FaShieldAlt, FaUsers, FaTruck, FaPlay, FaHome } from "react-icons/fa";
import ProductCard from "../components/ProductCard";
import { useCatalog } from "../context/CatalogContext";
import Seo from "../components/Seo";

const testimonialsPerPage = 6;

export default function Home() {
  const navigate = useNavigate();
  const { products, testimonials, pages, settings } = useCatalog();
  const p = pages.home || {};
  const hero = p.hero || {};
  const newArrivalsSec = p.newArrivals || {};
  const storySec = p.story || {};
  const featuredSec = p.featuredProducts || {};
  const perksData = p.perks || [];
  const aboutStorySec = p.aboutStory || {};
  const ctaBanner = p.ctaBanner || {};
  const testimonialsSec = p.testimonials || {};
  const howWeMakeItSec = p.howWeMakeIt || {};

  const newArrivals = products.filter((p) => !p.badge).slice(-4);
  const featured = products.filter((p) =>
    [1, 2, 19, 21, 23, 26, 27, 37].includes(p.id)
  );
  const [testimonialPage, setTestimonialPage] = useState(1);
  const testimonialTotalPages = Math.ceil(testimonials.length / testimonialsPerPage);

  const whatsAppNumber = settings?.whatsappNumber || "9779820299711";
  const defaultStats = [
    ["500+", "Happy Retailers", "var(--red)"],
    ["10+", "Product Lines", "var(--gold)"],
    ["77", "Districts", "#fff"],
  ];
  const heroStats = hero.stats || null;

  return (
    <div>
      <Seo
        title={hero.heading || "Authentic Nepali Snacks"}
        description={hero.subtitle || "R&R Food Products (Riya and Rakshya Food Products) — authentic Nepali namkeen, chips, noodles, and snacks manufactured in Bhairahawa, Nepal. Order online or via WhatsApp."}
        path="/"
      />
      {/* ── Hero slideshow ── */}
      <section className="home-hero">
        <div className="home-hero__content">
          <div className="home-hero__badge">
            <FaHome size={16} /> {hero.badge || "नेपालको स्वाद"}
          </div>
          <h1 className="home-hero__h1">
            {hero.heading || "One Bite & You Won't Stop"} <span>{hero.headingHighlight || "Craving"}</span>
          </h1>
          <p className="home-hero__sub" style={{ color: '#000' }}>
            {hero.subtitle || "Instant noodles, crunchy snacks, and bulk packs delivered straight to your door. Freshness guaranteed in every bite."}
          </p>
          <div className="home-hero__btns">
            <button className="home-hero__btn-shop" onClick={() => navigate(hero.cta1Link || '/products')}>
              <FiShoppingBag size={17} /> {hero.cta1Text || "Shop Now"}
            </button>
            <button className="home-hero__btn-dist" onClick={() => navigate(hero.cta2Link || '/contact')}>
              {hero.cta2Text || "Become a Distributor"} <FiArrowRight size={16} />
            </button>
          </div>
          <div className="home-hero__stats">
            {(heroStats || defaultStats).map((s, i, arr) => {
              const val = heroStats ? [s.value, s.label, ["var(--red)", "var(--gold)", "#fff"][i] || "var(--red)"] : s;
              return (
                <React.Fragment key={val[1]}>
                  <div className="home-hero__stat">
                    <span className="home-hero__stat-num" style={{ color: val[2] }}>{val[0]}</span>
                    <span className="home-hero__stat-label">{val[1]}</span>
                  </div>
                  {i < arr.length - 1 && <div className="home-hero__stat-divider" />}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {(hero.slides || [
          "/images/hero/hero-bg.png",
          "/images/hero/home hero kushal namkeen.png",
          "/images/hero/home hero makai and diet.png",
          "/images/hero/home hero cheese balls.png",
          "/images/hero/home hero aone chips green.png",
        ]).map((slide, i) => {
          const classes = ["slide-title", "slide-namkeen", "slide-makai", "slide-cheese", "slide-aone"];
          const alts = ["", "Kushal Namkeen", "Makai Diet", "Cheese Balls", "Aone Chips Green"];
          return i === 0 ? (
            <div key={i} className={`hero-slideshow-slide ${classes[i] || ""}`}>
              <img src={encodeURI(slide)} alt="" />
              <div className="hero-slide-overlay" />
            </div>
          ) : (
            <div key={i} className={`hero-slideshow-slide ${classes[i] || ""}`}>
              <div className="hero-slide-product">
                <img src={encodeURI(slide)} alt={alts[i] || ""} />
              </div>
            </div>
          );
        })}

        <div className="hero-dots">
          {(hero.slides || [1,2,3,4,5]).map((_, i) => (
            <button key={i} className={`hero-dot ${i === 0 ? "active" : ""}`} aria-label={`Slide ${i + 1}`} />
          ))}
        </div>
      </section>

      <section className="container" style={{ paddingTop: 60, paddingBottom: 60 }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "var(--red)", fontWeight: 700, marginBottom: 6 }}>
            {newArrivalsSec.tag || "NEW ARRIVALS"}
          </p>
          <h2 style={{ marginTop: 0 }}>{newArrivalsSec.heading || "Fresh From Our Kitchen"}</h2>
        </div>
        <div className="product-grid featured-grid">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} hidePrice />
          ))}
        </div>
      </section>

      <section style={{ background: "#fff", padding: "60px 0" }}>
        <div className="container about-story-grid" style={{ alignItems: "stretch" }}>
          <div style={{ height: "100%", minHeight: 400 }}>
            <img
              src={encodeURI(storySec.image || "/images/home page below new arrivals.png")}
              alt="R&R production facility"
              style={{ borderRadius: 16, width: "100%", height: "100%", minHeight: 400, objectFit: "cover" }}
            />
          </div>
          <div>
            <p style={{ color: "var(--red)", fontWeight: 700, marginBottom: 6 }}>
              {storySec.tag || "HEALTHY LIVING"}
            </p>
            <h2 style={{ marginTop: 0 }}>{storySec.heading || "Nepal's Most Trusted Snack Brand"}</h2>
            {(storySec.body || [
              "With over a decade of experience, Riya & Rakshya Food Products has grown from a small kitchen in Bhairahawa to one of Nepal's leading snack manufacturers. Our commitment to quality, taste, and innovation has earned the trust of thousands of customers across all 77 districts.",
              "Every product is crafted using the finest ingredients, prepared in a hygienic facility, and tested to meet the highest quality standards before reaching your hands.",
            ]).map((para, i) => (
              <p key={i} style={{ lineHeight: 1.7, color: "var(--text-muted)" }}>{para}</p>
            ))}
            <p style={{ lineHeight: 1.7, color: "var(--text-muted)" }}>
              Also known as <strong>RNR Food Products</strong>, <strong>R&R Food Products</strong> and{" "}
              <strong>Riya and Rakshya Food Products</strong>, we are a trusted name for authentic Nepali
              snacks, namkeen, dalmot, chips and instant noodles across Nepal.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
              {(storySec.features || [
                { title: "100% Vegetarian", desc: "Pure vegetarian snacks" },
                { title: "Premium Quality", desc: "Best raw materials" },
                { title: "Fast Delivery", desc: "Quick nationwide shipping" },
                { title: "Trusted Brand", desc: "Loved by thousands" },
              ]).map((item, i) => {
                const icons = [<FiCheck />, <FiStar />, <FiZap />, <FiHeart />];
                return (
                  <div
                    key={item.title}
                    style={{
                      background: "#fff",
                      borderRadius: 12,
                      padding: "16px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    <span
                      style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: "var(--cream)", color: "var(--red)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, fontSize: 16,
                      }}
                    >
                      {icons[i] || <FiCheck />}
                    </span>
                    <div>
                      <strong style={{ fontSize: 14, display: "block" }}>{item.title}</strong>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{item.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <Link to="/about" className="btn btn-red" style={{ marginTop: 24 }}>
              {storySec.ctaText || "Learn more about us"} <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <section className="container" style={{ paddingTop: 60, paddingBottom: 60 }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "var(--red)", fontWeight: 700, marginBottom: 6 }}>
            {featuredSec.tag || "FEATURED PRODUCTS"}
          </p>
          <h2 style={{ marginTop: 0 }}>{featuredSec.heading || "Our Top Picks For You"}</h2>
        </div>
        <div className="product-grid featured-grid">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div style={{ textAlign: "center" }}>
          <Link
            to="/products"
            className="btn btn-outline"
            style={{ marginTop: 32, borderColor: "var(--red)", color: "var(--red)" }}
          >
            {featuredSec.ctaText || "View All Products"}
          </Link>
        </div>
      </section>

      <section className="perks-marquee-section">
        <div className="perks-marquee-track">
          {[...(perksData.length ? perksData : [
            { title: "10+", desc: "Years Of Experience" },
            { title: "Modern", desc: "Manufacturing Unit" },
            { title: "Best Quality", desc: "Raw Materials" },
            { title: "Happy", desc: "Customers" },
            { title: "Wide", desc: "Distribution Network" },
          ]), ...(perksData.length ? perksData : [
            { title: "10+", desc: "Years Of Experience" },
            { title: "Modern", desc: "Manufacturing Unit" },
            { title: "Best Quality", desc: "Raw Materials" },
            { title: "Happy", desc: "Customers" },
            { title: "Wide", desc: "Distribution Network" },
          ]), ...(perksData.length ? perksData : [
            { title: "10+", desc: "Years Of Experience" },
            { title: "Modern", desc: "Manufacturing Unit" },
            { title: "Best Quality", desc: "Raw Materials" },
            { title: "Happy", desc: "Customers" },
            { title: "Wide", desc: "Distribution Network" },
          ])].map((perk, i) => (
            <div key={`${perk.desc}-${i}`} className="perk-item">
              <div>
                <h4 style={{ marginBottom: 2 }}>{perk.title}</h4>
                <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>{perk.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: "#f7f2eb", padding: "60px 0" }}>
        <div className="container about-story-grid" style={{ alignItems: "stretch" }}>
          <div style={{ height: "100%", minHeight: 400 }}>
            <img
              src={encodeURI(aboutStorySec.image || "/images/abouthome.png")}
              alt="The R&R Story"
              style={{ borderRadius: 16, width: "100%", height: "100%", minHeight: 400, objectFit: "cover" }}
            />
          </div>
          <div>
            <p style={{ color: "var(--red)", fontWeight: 700, marginBottom: 6 }}>
              {aboutStorySec.tag || "ABOUT US"}
            </p>
            <h2 style={{ marginTop: 0 }}>{aboutStorySec.heading || "The R&R Story"}</h2>
            {(aboutStorySec.body || [
              "We started with one goal: make snacks that are fast, tasty, and satisfying. From our kitchen to your table, every bite is crafted with care, using quality ingredients and attention to detail. We believe that great taste comes from consistency and passion in every step of the process.",
              "In a small kitchen in Bhairahawa, two passionate food lovers began experimenting with traditional recipes, blending age-old flavors with modern convenience. What started as a family passion quickly grew into something bigger.",
              "Today, Riya and Rakshya Food Products manufactures over 60 varieties of instant noodles, namkeen, dalmot, chips and bhujiya — loved by thousands across Nepal.",
            ]).map((para, i) => (
              <p key={i} style={{ lineHeight: 1.7, color: "var(--text-muted)" }}>{para}</p>
            ))}
            <Link to="/about" className="btn btn-red" style={{ marginTop: 16 }}>
              {aboutStorySec.ctaText || "Learn more about us"} <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <section style={{ background: "var(--red)", color: "#fff", padding: "60px 0", textAlign: "center", marginTop: 40 }}>
        <div className="container">
          <h2 style={{ marginTop: 0 }}>{ctaBanner.heading || "Ready to stock up on Nepal's favorite snacks?"}</h2>
          <p style={{ maxWidth: 560, margin: "0 auto 24px", opacity: 0.9 }}>
            {ctaBanner.body || "Whether you're treating yourself or stocking your store, ordering is just a message away. Fast delivery guaranteed."}
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to={ctaBanner.button1Link || "/products"} className="btn btn-white">
              {ctaBanner.button1Text || "View Full Menu"}
            </Link>
            <a href={ctaBanner.button2Link || `https://wa.me/${whatsAppNumber}`} target="_blank" rel="noreferrer" className="btn btn-whatsapp">
              <FiMessageCircle /> {ctaBanner.button2Text || "Chat on WhatsApp"}
            </a>
          </div>
        </div>
      </section>

      <section className="container" style={{ paddingTop: 60, paddingBottom: 60 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <p style={{ color: "var(--red)", fontWeight: 700, marginBottom: 6 }}>
            {testimonialsSec.tag || "CUSTOMER'S LOVE"}
          </p>
          <h2 style={{ marginTop: 0 }}>{testimonialsSec.heading || "Loved By Our Customers"}</h2>
        </div>
        <div className="testimonial-grid">
          {testimonials.slice((testimonialPage - 1) * 6, testimonialPage * 6).map((t) => (
            <div key={t.id} className="testimonial-card">
              <div style={{ color: "var(--gold)", display: "flex", gap: 2, marginBottom: 10 }}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <p style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>{t.text}</p>
              <strong>{t.name}</strong>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{t.location}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 28 }}>
          {Array.from({ length: testimonialTotalPages }).map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setTestimonialPage(i + 1)}
              style={{
                width: 36, height: 36, borderRadius: 8,
                border: "1px solid var(--border-color)",
                background: testimonialPage === i + 1 ? "var(--red)" : "#fff",
                color: testimonialPage === i + 1 ? "#fff" : "var(--text-dark)",
                fontWeight: 600, fontSize: 14, cursor: "pointer",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </section>

      <div style={{ background: "#fff", padding: "60px 0" }}>
        <div className="container">
          <div className="about-story-grid">
            <div>
              <p style={{ color: "var(--red)", fontWeight: 700, marginBottom: 6 }}>{howWeMakeItSec.tag || "HOW WE MAKE IT"}</p>
              <h2 style={{ marginTop: 0 }}>{howWeMakeItSec.heading || "Crafted With Care, Delivered With Trust"}</h2>
              {(howWeMakeItSec.body || [
                "Every packet of Riya & Rakshya snacks goes through a carefully managed process — from selecting the finest ingredients to precision mixing, cooking, and packaging. Our modern facility in Bhairahawa ensures hygiene and consistency at every step.",
                "We combine traditional Nepali recipes with advanced manufacturing technology to deliver snacks that taste authentic yet meet the highest quality standards. Watch how we bring your favourite snacks to life.",
              ]).map((para, i) => (
                <p key={i} style={{ lineHeight: 1.75, color: "var(--text-muted)" }}>{para}</p>
              ))}
              <Link to="/about" className="btn btn-red" style={{ marginTop: 16 }}>
                {howWeMakeItSec.ctaText || "See How It's Made"} <FiArrowRight />
              </Link>
            </div>
            <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", background: "#f5f5f5", border: "1px solid var(--border-color)" }}>
              <div style={{ position: "relative", paddingTop: "56.25%" }}>
                <video
                  src={howWeMakeItSec.video || "/videos/RnR video.mp4"}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "contain", background: "#f5f5f5" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
