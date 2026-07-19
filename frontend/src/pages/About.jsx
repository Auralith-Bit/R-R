import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMessageCircle, FiChevronDown } from "react-icons/fi";
import { useCatalog } from "../context/CatalogContext";
import PageHero from "../components/PageHero";
import Seo from "../components/Seo";

export default function About() {
  const navigate = useNavigate();
  const { team, categoryGroups, pages } = useCatalog();
  const p = pages.about || {};
  const hero = p.hero || {};
  const storySec = p.story || {};
  const mv = p.missionVision || {};
  const qualitySec = p.quality || {};
  const scaleSec = p.scale || {};
  const advantagesSec = p.advantages || {};
  const peopleSec = p.peopleBehindUs || {};
  const ctaSec = p.cta || {};

  const [openTile, setOpenTile] = useState(null);
  const [imgErrors, setImgErrors] = useState({});

  const manufacture = useMemo(
    () => [
      ...categoryGroups
        .filter((g) => g.label !== "All Products")
        .map((g) => ({ title: g.label, img: g.image, options: g.options })),
      { title: "Bhailpuri Mix", img: "/images/products/bhailpuri.png" },
      { title: "Instant Noodles", img: "/images/products/rnr_noodles.png" },
    ],
    [categoryGroups]
  );

  function goToCategory(label) {
    setOpenTile(null);
    navigate(`/products?category=${encodeURIComponent(label)}`);
  }

  useEffect(() => {
    if (openTile === null) return;
    function onDocClick(e) {
      if (!e.target.closest(".manufacture-tile")) setOpenTile(null);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [openTile]);

  const advantages = advantagesSec.items || [
    { title: "Delicious Taste", desc: "Authentic Nepali flavors that keep you coming back" },
    { title: "Multiple Size", desc: "From 12g to 1kg — a size for every need" },
    { title: "Affordable Pricing", desc: "Premium quality snacks at prices everyone can enjoy" },
    { title: "Trusted Quality", desc: "Rigorous testing ensures every pack is perfect" },
    { title: "Consistent Experience", desc: "Same great taste in every single pack" },
  ];

  return (
    <div>
      <Seo
        title={hero.title || "About Us"}
        description="Learn about R&R Food Products (Riya and Rakshya Food Products) — a Nepali snack manufacturer based in Bhairahawa, crafting authentic namkeen, chips and noodles."
        path="/about"
      />
      <PageHero
        breadcrumb={hero.breadcrumb || "HOME > ABOUT"}
        title={hero.title || "About Riya & Rakshya Food Products"}
        subtitle={hero.subtitle || "From a small kitchen dream to Nepal's beloved snack brand — here's our story."}
        bgImage={hero.bgImage || "/images/aboutherosection.png"}
      />

      <div className="container" style={{ paddingTop: 60, paddingBottom: 60 }}>
        <div className="about-story-grid">
          <div>
            <p className="section-tag">{storySec.tag || "ABOUT US"}</p>
            <h2 style={{ marginTop: 0 }}>{storySec.heading || "The R&R Story"}</h2>
            {(storySec.body || [
              "We started with one goal: make snacks that are fast, tasty, and satisfying. From our kitchen to your table, every bite is crafted with care, using quality ingredients and attention to detail. We believe that great taste comes from consistency and passion in every step of the process.",
              "In a small kitchen in Bhairahawa, two passionate food lovers began experimenting with traditional recipes, blending age-old flavors with modern convenience. What started as a family passion quickly grew into something bigger.",
              "Today, Riya and Rakshya Food Products manufactures over 60 varieties of instant noodles, namkeen, dalmot, chips and bhujiya — loved by thousands across Nepal.",
            ]).map((para, i) => (
              <p key={i} style={{ lineHeight: 1.75, color: "var(--text-muted)" }}>{para}</p>
            ))}
          </div>
          <img src={encodeURI(storySec.image || "/images/abouthome.png")} alt="R&R production line" style={{ borderRadius: 16, width: "100%" }} />
        </div>

        <div style={{ textAlign: "center", margin: "60px 0 32px" }}>
          <p className="section-tag">{mv.tag || "WHAT DRIVES US"}</p>
          <h2 style={{ marginTop: 0 }}>{mv.heading || "The Core Purpose And Future Aspirations Of Our Company"}</h2>
        </div>
        <div className="mission-vision-grid">
          <div className="mission-card mission">
            <span style={{ fontSize: 16, fontWeight: 800, opacity: 0.5 }}>{(mv.mission || {}).number || "01"}</span>
            <h3 style={{ margin: "4px 0 6px", fontSize: 18 }}>{(mv.mission || {}).title || "Our Mission"}</h3>
            <p style={{ opacity: 0.9, lineHeight: 1.5, fontSize: 13, margin: 0 }}>
              {(mv.mission || {}).body || "To become Nepal's most trusted and widely loved snack brand, recognized for quality, innovation, and the happiness we bring to our customers."}
            </p>
            <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
              {((mv.mission || {}).tags || ["Tasty", "Convenient", "Affordable"]).map((t) => (
                <span key={t} style={{ background: "rgba(255,255,255,0.2)", padding: "3px 10px", borderRadius: 999, fontSize: 11 }}>{t}</span>
              ))}
            </div>
          </div>
          <div className="mission-card vision">
            <span style={{ fontSize: 16, fontWeight: 800, opacity: 0.5 }}>{(mv.vision || {}).number || "02"}</span>
            <h3 style={{ margin: "4px 0 6px", fontSize: 18 }}>{(mv.vision || {}).title || "Our Vision"}</h3>
            <p style={{ opacity: 0.9, lineHeight: 1.5, fontSize: 13, margin: 0 }}>
              {(mv.vision || {}).body || "To inspire healthier snacking habits across Nepal by delivering innovative, delicious, and affordable products that bring families together and celebrate the joy of eating well."}
            </p>
            <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
              {((mv.vision || {}).tags || ["Innovative", "Loved", "Trusted"]).map((t) => (
                <span key={t} style={{ background: "rgba(255,255,255,0.2)", padding: "3px 10px", borderRadius: 999, fontSize: 11 }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: "var(--cream)", padding: "60px 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <p className="section-tag">OUR PRODUCTS</p>
          <h2 style={{ marginTop: 0, marginBottom: 32 }}>What We Manufacture</h2>
          <div className="manufacture-grid">
            {manufacture.map((m, i) => {
              if (!m.options) {
                return (
                  <button key={i} className="manufacture-tile" onClick={() => goToCategory(m.title)}>
                    <img src={imgErrors[i] ? "/images/Logo.png" : encodeURI(m.img)} alt={m.title} onError={() => setImgErrors(prev => ({ ...prev, [i]: true }))} />
                    <div className="manufacture-overlay">
                      <span>Namkeen</span>
                      <h4>{m.title}</h4>
                    </div>
                  </button>
                );
              }
              const isOpen = openTile === i;
              return (
                <button key={i} className="manufacture-tile" onClick={() => setOpenTile(isOpen ? null : i)}>
                  <img src={imgErrors[i] ? "/images/Logo.png" : encodeURI(m.img)} alt={m.title} onError={() => setImgErrors(prev => ({ ...prev, [i]: true }))} />
                  <div className="manufacture-overlay">
                    <span>Namkeen</span>
                    <h4>{m.title} <FiChevronDown size={12} /></h4>
                  </div>
                  {isOpen && (
                    <div className="manufacture-tile-menu">
                      {m.options.map((o) => (
                        <button key={o.label} onClick={(e) => { e.stopPropagation(); goToCategory(o.label); }}>{o.label}</button>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 60, paddingBottom: 60 }}>
        <div className="quality-grid">
          <div className="quality-image" style={{ minHeight: 420 }}>
            <video autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 18, display: "block" }}>
              <source src={qualitySec.video || "/videos/RnR video.mp4"} type="video/mp4" />
            </video>
          </div>
          <div>
            <p className="section-tag">{qualitySec.tag || "QUALITY FIRST"}</p>
            <h2 style={{ marginTop: 0 }}>{qualitySec.heading || "Our Commitment To Quality & Safety"}</h2>
            {(qualitySec.body || [
              "At Riya & Rakshya, quality isn't just a promise — it's our foundation. Every product undergoes rigorous testing at multiple stages of production, from raw material inspection to final packaging, ensuring consistency in taste, texture, and safety.",
              "Our manufacturing facility follows strict hygiene protocols, with regular audits and compliance checks. We use only premium-grade ingredients sourced from trusted suppliers, and our production lines are equipped with modern machinery that maintains precise quality standards.",
              "From the moment raw materials arrive at our facility to the final seal on every pack, we leave nothing to chance. Our dedicated quality team monitors each batch, conducting taste tests, texture analysis, and safety evaluations — so you can enjoy every bite with complete confidence.",
            ]).map((para, i) => (
              <p key={i} style={{ lineHeight: 1.75, color: "var(--text-muted)" }}>{para}</p>
            ))}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
              {(qualitySec.tags || ["FSSAI Compliant", "ISO Standards", "Quality Tested", "No Preservatives"]).map((t) => (
                <span key={t} style={{ background: "#e6f4ea", color: "#1b6f3c", padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600 }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: "var(--dark)", color: "#fff", padding: "60px 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <p style={{ color: "var(--gold)", fontWeight: 700, marginBottom: 6 }}>{scaleSec.tag || "OUR SCALE"}</p>
          <h2 style={{ marginTop: 0, marginBottom: 32 }}>{scaleSec.heading || "Manufacturing At Scale"}</h2>
          <div className="scale-grid">
            {(scaleSec.stats || [
              ["50+", "Products Manufactured"],
              ["77", "Districts Covered"],
              ["500+", "Retail Partners"],
              ["10K+", "Daily Production (Kg)"],
            ]).map((s) => {
              const [num, label] = Array.isArray(s) ? s : [s.value, s.label];
              return (
                <div key={label} style={{ background: "#262626", borderRadius: 12, padding: 28 }}>
                  <div style={{ fontSize: 30, fontWeight: 800, color: "var(--gold)" }}>{num}</div>
                  <div style={{ fontSize: 13, opacity: 0.8 }}>{label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 60, paddingBottom: 60 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <p className="section-tag">{advantagesSec.tag || "OUR ADVANTAGES"}</p>
          <h2 style={{ marginTop: 0 }}>{advantagesSec.heading || "Why Choose Riya & Rakshya?"}</h2>
        </div>
        <div className="advantages-grid">
          {advantages.map((a, i) => (
            <div key={a.title} className="adv-card" style={{ borderTop: `4px solid ${["#d32f2f", "#f0b90b", "#25d366", "#1976d2", "#7b1fa2"][i]}` }}>
              <div className="adv-icon" style={{ color: ["#d32f2f", "#f0b90b", "#25d366", "#1976d2", "#7b1fa2"][i], background: ["rgba(211,47,47,0.1)", "rgba(240,185,11,0.1)", "rgba(37,211,102,0.1)", "rgba(25,118,210,0.1)", "rgba(123,31,162,0.1)"][i] }}>
                {["🍽", "📦", "💰", "✅", "⭐"][i]}
              </div>
              <h4>{a.title}</h4>
              <p>{a.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "#f7f2eb", padding: "60px 0" }}>
        <div className="container about-story-grid" style={{ alignItems: "center" }}>
          <div className="quality-image">
            <video autoPlay muted loop playsInline style={{ width: "100%", borderRadius: 18 }}>
              <source src={peopleSec.video || "/videos/the people behind us.mp4"} type="video/mp4" />
            </video>
          </div>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)" }}>
            <p className="section-tag">{peopleSec.tag || "PEOPLE BEHIND US"}</p>
            <h2 style={{ marginTop: 0 }}>{peopleSec.heading || "Meet The People Behind R&R"}</h2>
            {(peopleSec.body || [
              "Behind every pack of Riya & Rakshya snacks is a team of dedicated people who pour their heart into making sure every snack reaches your table with freshness, quality and love. From recipe development to packaging, our people are the strength of this brand.",
              "Our passionate workforce combines traditional craftsmanship with modern food science to create snacks that millions enjoy every day across Nepal.",
            ]).map((para, i) => (
              <p key={i} style={{ lineHeight: 1.75, color: "var(--text-muted)" }}>{para}</p>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "linear-gradient(90deg,#d14b39,#d17d2d,#caa431)", padding: "40px 0" }}>
        <div className="container cta-split-grid">
          <div style={{ color: "#fff" }}>
            <h2 style={{ marginTop: 0 }}>{ctaSec.heading || "Ready to explore our snacks?"}</h2>
            <p style={{ opacity: 0.9, marginBottom: 18 }}>
              {ctaSec.body || "Browse our wide collection of freshly crafted snacks, made with quality ingredients and authentic recipes."}
            </p>
            <Link to="/products" className="btn btn-white">{ctaSec.buttonText || "Explore Menu"}</Link>
          </div>
          <div style={{ background: "#fff", borderRadius: 16, padding: 24 }}>
            <h3 style={{ color: "var(--red)", marginTop: 0 }}>
              {ctaSec.bulkHeading || "Interested in Bulk Orders or Distribution?"}
            </h3>
            <p style={{ color: "var(--text-muted)" }}>
              {ctaSec.bulkBody || "We're always looking for retail partners and distributors across Nepal. Get factory-direct pricing and dedicated support."}
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link to="/manufacturing" className="btn btn-red">{ctaSec.bulkButton1 || "Explore Manufacturing"}</Link>
              <Link to="/contact" className="btn btn-whatsapp">
                <FiMessageCircle /> {ctaSec.bulkButton2 || "Contact Sales team"}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: "#f2e6d3", padding: "60px 0" }}>
        <div className="container">
          <div className="team-grid">
            {team.map((m) => (
              <div key={m.id} style={{ textAlign: "center", background: "#fff", borderRadius: 12, padding: "24px 18px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <div className="team-avatar">
                  {m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <strong style={{ fontSize: 14 }}>{m.name}</strong>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
