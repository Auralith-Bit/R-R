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

  const advantages = [
    { title: "Delicious Taste", desc: "Authentic Nepali flavors that keep you coming back" },
    { title: "Multiple Size", desc: "From 12g to 1kg — a size for every need" },
    { title: "Affordable Pricing", desc: "Premium quality snacks at prices everyone can enjoy" },
    { title: "Trusted Quality", desc: "Rigorous testing ensures every pack is perfect" },
  ];

  return (
    <div className="about-page">
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
        mobilePosition="right"
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
          <img src={encodeURI(storySec.image || "/images/abouthome.png")} alt="R&R production line" loading="lazy" decoding="async" style={{ borderRadius: 16, width: "100%" }} />
        </div>

        <div style={{ textAlign: "center", margin: "60px 0 32px" }}>
          <p className="section-tag">{mv.tag || "WHAT DRIVES US"}</p>
          <h2 style={{ marginTop: 0 }}>{mv.heading || "The Core Purpose And Future Aspirations Of Our Company"}</h2>
        </div>
        <div className="mission-vision-grid">
          <div className="mission-card mission">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 22 }}>🎯</span>
              <h3 style={{ margin: 0, fontSize: 18, color: "#fff" }}>{(mv.mission || {}).title || "Our Mission"}</h3>
            </div>
            <p style={{ opacity: 0.9, lineHeight: 2.2, fontSize: 14, margin: "28px 0", color: "#fff" }}>
              {(mv.mission || {}).body || "To become Nepal's most trusted and loved snack brand by delivering high-quality, innovative, and delicious products that create happiness and memorable moments for every customer. We are committed to using the finest ingredients, maintaining the highest standards of hygiene, and continuously innovating to bring flavors that delight every Nepali household. With passion and dedication, we aim to grow alongside our customers, sharing joy in every bite and building lasting relationships rooted in trust and quality."}
            </p>
            <div style={{ display: "flex", gap: 6, paddingTop: 16, flexWrap: "wrap" }}>
              {((mv.mission || {}).tags || ["Tasty", "Convenient", "Affordable"]).map((t) => (
                <span key={t} style={{ background: "rgba(240,185,11,0.2)", color: "#f0b90b", padding: "4px 12px", borderRadius: 999, fontSize: 12 }}>{t}</span>
              ))}
            </div>
          </div>
          <div className="mission-card vision">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 22 }}>🔭</span>
              <h3 style={{ margin: 0, fontSize: 18, color: "#fff" }}>{(mv.vision || {}).title || "Our Vision"}</h3>
            </div>
            <p style={{ opacity: 0.9, lineHeight: 2.2, fontSize: 14, margin: "28px 0", color: "#fff" }}>
              {(mv.vision || {}).body || "To inspire healthier snacking habits across Nepal through innovative, affordable, and tasty products that bring families together and celebrate the joy of sharing. We envision a future where every Nepali can enjoy nutritious and delicious snacks made with love, care, and a deep respect for tradition."}
            </p>
            <div style={{ display: "flex", gap: 6, paddingTop: 16, flexWrap: "wrap" }}>
              {((mv.vision || {}).tags || ["Innovative", "Loved", "Trusted"]).map((t) => (
                <span key={t} style={{ background: "rgba(240,185,11,0.2)", color: "#f0b90b", padding: "4px 12px", borderRadius: 999, fontSize: 12 }}>{t}</span>
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

      <div className="container" style={{ paddingTop: 48, paddingBottom: 48 }}>
        <div className="quality-grid">
          <div className="quality-image" style={{ background: "transparent" }}>
            <video autoPlay muted loop playsInline style={{ width: "100%", borderRadius: 18, display: "block" }}>
              <source src={qualitySec.video || "/videos/RnR video.mp4"} />
            </video>
          </div>
          <div>
            <p className="section-tag">{qualitySec.tag || "QUALITY FIRST"}</p>
            <h2 style={{ marginTop: 0 }}>{qualitySec.heading || "Our Commitment To Quality & Safety"}</h2>
            {(qualitySec.body || [
              "At Riya & Rakshya, quality isn't just a promise — it's our foundation. Every product undergoes rigorous testing at multiple stages of production, from raw material inspection to final packaging, ensuring consistency in taste, texture, and safety.",
              "Our manufacturing facility follows strict hygiene protocols, with regular audits and compliance checks. We use only premium-grade ingredients sourced from trusted suppliers, and our production lines are equipped with modern machinery that maintains precise quality standards.",
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

      <div style={{ background: "#444444", color: "#fff", padding: "48px 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <p style={{ color: "var(--gold)", fontWeight: 700, marginBottom: 6, letterSpacing: 2, textTransform: "uppercase", fontSize: 13 }}>{scaleSec.tag || "OUR SCALE"}</p>
          <h2 style={{ marginTop: 0, marginBottom: 12, color: "#fff", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700 }}>{scaleSec.heading || "Manufacturing At Scale"}</h2>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "clamp(13px, 1.2vw, 16px)", lineHeight: 1.7, maxWidth: 700, margin: "0 auto 28px" }}>
            {scaleSec.body || "From a single production line to a state-of-the-art facility, we've scaled our operations to deliver quality snacks across all 77 districts of Nepal."}
          </p>
          <div className="scale-grid">
            {(scaleSec.stats || [
              ["50+", "Products Manufactured"],
              ["77", "Districts Covered"],
              ["500+", "Retail Partners"],
              ["10K+", "Daily Production (Kg)"],
            ]).map((s) => {
              const [num, label] = Array.isArray(s) ? s : [s.value, s.label];
              return (
                <div key={label} style={{ background: "rgba(255,255,255,0.12)", borderRadius: 12, padding: "16px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: "var(--gold)" }}>{num}</div>
                  <div style={{ fontSize: 12, color: "#FFFFFF" }}>{label}</div>
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
            <div key={a.title} className="adv-card" style={{ borderTop: `4px solid ${["#d32f2f", "#f0b90b", "#25d366", "#1976d2"][i]}` }}>
              <div className="adv-icon" style={{ color: ["#d32f2f", "#f0b90b", "#25d366", "#1976d2"][i], background: ["rgba(211,47,47,0.1)", "rgba(240,185,11,0.1)", "rgba(37,211,102,0.1)", "rgba(25,118,210,0.1)"][i] }}>
                {["🍽", "📦", "💰", "✅"][i]}
              </div>
              <h4>{a.title}</h4>
              <p>{a.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "#f7f2eb", padding: "60px 0" }}>
        <div className="container">
        <div className="about-story-grid" style={{ alignItems: "center" }}>
          <div className="quality-image">
            <video autoPlay muted loop playsInline style={{ width: "100%", borderRadius: 18 }}>
              <source src={peopleSec.video || "/videos/the people behind us.mp4"} />
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
      </div>

      <section style={{ padding: "40px 0", background: "linear-gradient(to right, #D24A40, #DB7A43, #E1B24A)" }}>
        <div className="container" style={{ display: "flex", justifyContent: "center" }}>
          <div className="mfg-cta-card" style={{ position: "relative", overflow: "hidden", borderRadius: 20, boxShadow: "0 30px 80px rgba(0,0,0,0.18)", width: "100%", maxWidth: 960 }}>
            <img
              src={encodeURI(ctaSec.image || "/images/hero/kushal namkeen backgraound CTA.png")}
              alt=""
              loading="lazy"
              decoding="async"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} />
            <div className="mfg-cta-content" style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "56px 40px" }}>
              <h2 style={{ maxWidth: 760, color: "#fff", fontWeight: 700, fontSize: "clamp(24px, 3vw, 36px)", lineHeight: 1.2, margin: 0 }}>
                {ctaSec.heading || "Ready to explore our snacks?"}
              </h2>
              <p style={{ margin: "12px 0 0", maxWidth: 700, fontSize: "clamp(14px, 1.4vw, 17px)", lineHeight: 1.7, color: "rgba(255,255,255,0.95)" }}>
                {ctaSec.body || "Browse our wide collection of freshly crafted snacks, made with quality ingredients and authentic recipes."}
              </p>
              <Link to="/products" className="btn btn-white" style={{ marginTop: 20 }}>{ctaSec.buttonText || "Explore Menu"}</Link>
              <div className="about-cta-divider" />
              <h3 style={{ maxWidth: 700, color: "#fff", margin: 0, fontSize: "clamp(18px, 2vw, 24px)" }}>
                {ctaSec.bulkHeading || "Interested in Bulk Orders or Distribution?"}
              </h3>
              <p style={{ margin: "10px 0 0", maxWidth: 700, lineHeight: 1.65, color: "rgba(255,255,255,0.9)" }}>
                {ctaSec.bulkBody || "We're always looking for retail partners and distributors across Nepal. Get factory-direct pricing and dedicated support."}
              </p>
              <div className="about-cta-actions">
                <Link to="/manufacturing" className="btn btn-red">{ctaSec.bulkButton1 || "Explore Manufacturing"}</Link>
                <Link to="/contact" className="btn btn-whatsapp">
                  <FiMessageCircle /> {ctaSec.bulkButton2 || "Contact Sales team"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div style={{ background: "#f2e6d3", padding: "60px 0" }}>
        <div className="container">
          <div className="team-grid">
            {team.map((m) => (
              <div key={m.id} style={{ textAlign: "center", background: "#fff", borderRadius: 16, padding: "36px 24px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", borderTop: "4px solid #C72D29" }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #C72D29, #D3A836)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", color: "#fff", fontSize: 22, fontWeight: 700, boxShadow: "0 4px 14px rgba(199,45,41,0.25)" }}>
                  {m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <strong style={{ fontSize: 15, display: "block", marginBottom: 4, color: "#262626" }}>{m.name}</strong>
                <div style={{ fontSize: 12, color: "#C72D29", fontWeight: 600 }}>{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
