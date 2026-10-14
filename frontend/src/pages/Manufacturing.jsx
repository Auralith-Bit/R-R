import React from "react";
import { Link } from "react-router-dom";
import { FaLeaf, FaBolt, FaIndustry, FaFlask, FaClipboardCheck, FaWarehouse } from "react-icons/fa";
import { ArrowRight, MessageCircle, Truck, BadgeCheck, Award, Check, ShieldCheck, Star, Leaf, Clock3, Shield } from "lucide-react";
import PageHero from "../components/PageHero";
import Seo from "../components/Seo";
import { useCatalog } from "../context/CatalogContext";

const stepIcons = [FaLeaf, FaFlask, FaIndustry, FaBolt, FaClipboardCheck, FaWarehouse];
const stepColors = ["#D88C5B", "#2EB5F5", "#F5C12D", "#9DC7D7", "#0A6C73", "#C49A6C"];
const defaultTimelineSteps = [
  { title: "Quality Ingredients", desc: "We source premium ingredients from trusted suppliers.", color: "#D88C5B" },
  { title: "Cleaning & Sorting", desc: "Ingredients are thoroughly cleaned and sorted for the best quality.", color: "#2EB5F5" },
  { title: "Hygienic Processing", desc: "Prepared using advanced machinery in a clean and safe environment.", color: "#F5C12D" },
  { title: "Flavoring", desc: "Perfectly blended spices and flavors for that authentic taste.", color: "#9DC7D7" },
  { title: "Quality Checking", desc: "Every batch is tested to meet our high quality and safety standards.", color: "#0A6C73" },
  { title: "Packaging", desc: "Sealed fresh to lock in crunch and deliver goodness to you.", color: "#C49A6C" },
];

export default function Manufacturing() {
  const { pages, settings } = useCatalog();
  const p = pages.manufacturing || {};
  const hero = p.hero || {};
  const processSec = p.processSteps || {};
  const facilitySec = p.facility || {};
  const ctaSec = p.cta || {};
  const capSec = p.capabilities || {};

  const whatsAppNumber = settings?.whatsappNumber || "9779857021032";

  const defaultCapabilities = [
    { title: "Modern Facility", desc: "Our state-of-the-art manufacturing plant in Bhairahawa is equipped with automated production lines for maximum efficiency." },
    { title: "In-House Lab", desc: "A fully equipped quality control laboratory monitors every stage of production to maintain the highest standards." },
    { title: "Large Capacity", desc: "With expanded production capacity, we efficiently fulfil bulk orders for retailers and distributors across all 77 districts." },
    { title: "FSSAI Certified", desc: "Our facility meets all national food safety standards, ensuring every product is safe, hygienic, and trustworthy." },
  ];

  const capabilities = capSec.items || defaultCapabilities;

  const defaultFacilityFeatures = [
    { title: "Modern Plant", desc: "Automated production lines for maximum efficiency" },
    { title: "In-House Lab", desc: "Quality control at every stage of production" },
    { title: "Large Capacity", desc: "Bulk orders fulfilled across all 77 districts" },
    { title: "FSSAI Certified", desc: "Meets all national food safety standards" },
  ];

  const facilityFeatures = facilitySec.features || defaultFacilityFeatures;

  return (
    <div className="manufacturing-page">
      <Seo
        title={hero.title || "Manufacturing Process"}
        description="See how R&R Food Products (Riya and Rakshya Food Products) makes its snacks — from quality ingredient sourcing to FSSAI-certified packaging in Bhairahawa, Nepal."
        path="/manufacturing"
      />
      <PageHero
        breadcrumb={hero.breadcrumb || "HOME > MANUFACTURING"}
        title={hero.title || "Our Manufacturing Process"}
        subtitle={hero.subtitle || "State-of-the-art production facilities crafting authentic Nepali snacks with precision and care."}
        bgImage={hero.bgImage || "/images/manufacturinghero.png"}
      />

      {/* ── Process Steps ── */}
      <section style={{ background: "var(--gray-bg)", padding: "64px 0", overflow: "hidden" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 920, margin: "0 auto" }}>
            <p style={{ color: "var(--red)", fontWeight: 700, letterSpacing: 2, fontSize: 13, textTransform: "uppercase", marginBottom: 6 }}>
              {processSec.tag || "HOW WE MAKE"}
            </p>
            <h2 style={{ marginTop: 0, fontSize: "clamp(22px, 3vw, 38px)", lineHeight: 1.15, fontWeight: 700 }}>
              {processSec.heading || "From Quality Ingredients To Delicious Snacks"}
            </h2>
          </div>
          <div style={{ position: "relative", marginTop: 36 }}>
            <div className="timeline-dashed-line" />
            <div className="process-steps-grid" style={{ position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14 }}>
              {(processSec.steps || defaultTimelineSteps).map((step, i) => {
                const Icon = stepIcons[i] || FaLeaf;
                const color = step.color || stepColors[i] || "#D88C5B";
                return (
                  <div key={step.title || i} style={{
                    background: "#fff", borderRadius: "var(--radius)", padding: "18px 10px", textAlign: "center",
                    display: "flex", flexDirection: "column", alignItems: "center",
                    boxShadow: "var(--shadow-sm)", transition: "var(--transition)",
                    minHeight: 200,
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "var(--shadow-lg)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}
                  >
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                      <Icon size={22} color={color} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--red)", marginBottom: 4 }}>{String(i + 1).padStart(2, "0")}</span>
                    <h3 style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>{step.title}</h3>
                    <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0, lineHeight: 1.45 }}>{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Inside Our Facility ── */}
      <section style={{ background: "#FDF5F5", padding: "56px 0" }}>
        <div className="container">
          <div className="facility-grid" style={{ alignItems: "stretch" }}>
            <div>
              <img
                className="facility-photo"
                src={encodeURI(facilitySec.image || "/images/manufacturingquality.png")}
                alt="Manufacturing Facility"
                loading="lazy"
                decoding="async"
                style={{ width: "100%", borderRadius: 16, boxShadow: "var(--shadow-lg)" }}
              />
            </div>
            <div>
              <span style={{ letterSpacing: 2, color: "var(--red)", fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>
                {facilitySec.tag || "INSIDE OUR FACILITY"}
              </span>
              <h2 style={{ marginTop: 6, fontSize: "clamp(22px, 2.5vw, 34px)", fontWeight: 700, lineHeight: 1.15, color: "var(--text-dark)" }}>
                {facilitySec.heading || "Clean. Safe. Advanced."}
              </h2>
              <p style={{ marginTop: 10, maxWidth: 700, fontSize: "clamp(13px, 1.2vw, 16px)", lineHeight: 1.7, color: "var(--text-muted)" }}>
                {facilitySec.body || "Our state-of-the-art manufacturing unit is designed to maintain the highest standards of hygiene, safety and efficiency."}
              </p>
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                {(facilityFeatures.length > 4 ? facilityFeatures : [
                  { title: "SS Food Grade Machinery", desc: "Modern machines that ensure precision and hygiene" },
                  { title: "Hygienic and Safe Environment", desc: "Regular sanitation and strict cleanliness protocols." },
                  { title: "Trained & Certified Staff", desc: "Our team follows global food safety practices." },
                  { title: "Quality at Every Step", desc: "Multiple quality checks to deliver nothing but the best." },
                ]).map((item) => (
                  <div
                    key={item.title}
                    style={{
                      background: "#fff", border: "1px solid var(--border-color)", borderRadius: 10,
                      padding: "12px 16px", display: "flex", alignItems: "center", gap: 14,
                      transition: "var(--transition)",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Check size={20} strokeWidth={2.6} style={{ color: "var(--red)" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "var(--text-dark)" }}>{item.title}</h3>
                      <p style={{ marginTop: 2, fontSize: 12, lineHeight: 1.5, color: "var(--text-muted)", marginBottom: 0 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section style={{ background: "var(--gray-bg)", padding: "56px 0" }}>
        <div className="container">
          <div className="why-choose-grid">
            <div style={{ background: "var(--dark)", borderRadius: 16, padding: "32px 24px", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", color: "#fff" }}>
              <div style={{ margin: "0 auto", width: 64, height: 64, borderRadius: "50%", background: "#474747", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ShieldCheck size={30} strokeWidth={2} style={{ color: "var(--gold)" }} />
              </div>
              <h3 style={{ marginTop: 16, fontSize: 20, fontWeight: 700, color: "#fff" }}>Quality Assured</h3>
              <p style={{ marginTop: 12, fontSize: 14, lineHeight: 1.7, color: "#d1d5db" }}>
                Manufactured in our state-of-the-art ISO certified facility. We adhere to the highest standards of food safety and hygiene to ensure every pack delivers premium quality.
              </p>
            </div>
            <div style={{ background: "#fff", borderRadius: 16, boxShadow: "var(--shadow-sm)", padding: "28px 32px" }}>
              <h2 style={{ marginTop: 0, fontSize: "clamp(20px, 2.2vw, 28px)", fontWeight: 700, color: "var(--text-dark)" }}>Why You'll Love It</h2>
              <div className="why-choose-benefits">
                {[
                  { icon: Star, title: "Authentic Flavor", desc: "Crafted with care using time-tested flavor profiles.", bg: "#FFF4D9", color: "#F4B400" },
                  { icon: Clock3, title: "Handmade Touch", desc: "Each item is carefully handcrafted for unique character.", bg: "#FFE8E1", color: "#FF6A3D" },
                  { icon: Leaf, title: "Fresh Ingredients", desc: "Sourced locally to ensure peak freshness and quality.", bg: "#DDF7E3", color: "#18A44C" },
                  { icon: Shield, title: "Sustainable Practices", desc: "Committed to eco-friendly methods throughout production.", bg: "#FFDCDC", color: "#E53935" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <div style={{ width: 48, height: 48, borderRadius: "50%", background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon size={22} style={{ color: item.color }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "var(--text-dark)", lineHeight: 1.35, overflowWrap: "break-word" }}>{item.title}</h3>
                        <p style={{ marginTop: 4, fontSize: 12, lineHeight: 1.5, color: "var(--text-muted)", overflowWrap: "break-word", marginBottom: 0 }}>{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{ padding: "40px 0", background: "linear-gradient(to right, #D24A40, #DB7A43, #E1B24A)" }}>
        <div className="container" style={{ display: "flex", justifyContent: "center" }}>
          <div className="mfg-cta-card" style={{ position: "relative", overflow: "hidden", borderRadius: 20, boxShadow: "0 30px 80px rgba(0,0,0,0.18)", width: "100%", maxWidth: 960 }}>
            <img
              src={encodeURI(ctaSec.image || "/images/hero/kushal namkeen backgraound CTA.png")}
              alt="Banner"
              loading="lazy"
              decoding="async"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} />
            <div className="mfg-cta-content" style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "72px 40px" }}>
              <h2 style={{ maxWidth: 960, color: "#fff", fontWeight: 700, fontSize: "clamp(20px, 2.5vw, 36px)", lineHeight: 1.2, marginTop: 0 }}>
                {ctaSec.heading || "The Ultimate Crunchy Chips Experience"}
              </h2>
              <p style={{ marginTop: 12, maxWidth: 700, fontSize: "clamp(13px, 1.2vw, 16px)", lineHeight: 1.7, color: "rgba(255,255,255,0.95)" }}>
                {ctaSec.body || "Discover our best-selling instant chips crafted with premium ingredients, bold flavours and unbeatable crunch that everyone loves."}
              </p>
              <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
                <Link
                  to={ctaSec.button1Link || "/products"}
                  style={{
                    height: 44, paddingInline: 24, borderRadius: 999,
                    background: "var(--red)", color: "#fff", fontSize: 14, fontWeight: 600,
                    display: "flex", alignItems: "center", gap: 8, textDecoration: "none",
                    transition: "var(--transition)", border: "none", cursor: "pointer",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--red-dark)"; e.currentTarget.style.transform = "scale(1.05)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "var(--red)"; e.currentTarget.style.transform = "scale(1)"; }}
                >
                  {ctaSec.button1Text || "View Collection"} <ArrowRight size={18} />
                </Link>
                <Link
                  to={ctaSec.button2Link || "/contact"}
                  style={{
                    height: 44, paddingInline: 24, borderRadius: 999,
                    background: "var(--green)", color: "#fff", fontSize: 14, fontWeight: 600,
                    display: "flex", alignItems: "center", gap: 8, textDecoration: "none",
                    transition: "var(--transition)",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#21BF5B"; e.currentTarget.style.transform = "scale(1.05)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "var(--green)"; e.currentTarget.style.transform = "scale(1)"; }}
                >
                  {ctaSec.button2Text || "Become a Distributor"} <ArrowRight size={18} />
                </Link>
              </div>
              <div style={{ width: "100%", maxWidth: 800, marginTop: 24 }}>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.2)" }} />
                <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
                  {(ctaSec.badges || ["Free Delivery", "Premium Quality", "Authentic Taste"]).map((badge, i) => {
                    const icons = [<Truck size={18} />, <BadgeCheck size={18} />, <Award size={18} />];
                    return (
                      <div
                        key={badge}
                        style={{
                          height: 36, paddingInline: 18, borderRadius: 999,
                          border: "1px solid rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.1)",
                          backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", display: "flex", alignItems: "center", gap: 6, color: "#fff",
                        }}
                      >
                        {icons[i] || <Truck size={16} />}
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{badge}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Capabilities ── */}
      <div className="container" style={{ paddingTop: 56, paddingBottom: 56 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <p style={{ color: "var(--red)", fontWeight: 700, marginBottom: 4 }}>{capSec.tag || "OUR CAPABILITIES"}</p>
          <h2 style={{ marginTop: 0, fontSize: "clamp(20px, 2.5vw, 32px)" }}>{capSec.heading || "Why Our Manufacturing Stands Out"}</h2>
        </div>
        <div className="manufacturing-why-grid">
          {capabilities.map((item) => (
            <div key={item.title} style={{ background: "#fff", borderRadius: 14, padding: "24px 20px", textAlign: "center", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)", transition: "var(--transition)" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}
            >
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "var(--cream)", color: "var(--red)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 22 }}>
                <FaIndustry />
              </div>
              <h4 style={{ margin: "0 0 6px", fontSize: 16 }}>{item.title}</h4>
              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
