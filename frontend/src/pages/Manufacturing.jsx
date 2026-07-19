import React from "react";
import { Link } from "react-router-dom";
import { FiMessageCircle, FiShoppingBag } from "react-icons/fi";
import { FaLeaf, FaBolt, FaIndustry, FaFlask, FaClipboardCheck, FaWarehouse } from "react-icons/fa";
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
    <div>
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

      <section style={{ background: "#F3F3F3", padding: "60px 0", overflow: "hidden" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 920, margin: "0 auto" }}>
            <p style={{ color: "var(--red)", fontWeight: 700, letterSpacing: 2, fontSize: 15, textTransform: "uppercase", marginBottom: 8 }}>
              {processSec.tag || "HOW WE MAKE"}
            </p>
            <h2 style={{ marginTop: 0, fontSize: "clamp(28px, 3.5vw, 48px)", lineHeight: 1.15, fontWeight: 700 }}>
              {processSec.heading || "From Quality Ingredients To Delicious Snacks"}
            </h2>
          </div>
          <div style={{ position: "relative", marginTop: 50 }}>
            <div className="timeline-dashed-line" />
            <div style={{ position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16 }}>
              {(processSec.steps || defaultTimelineSteps).map((step, i) => {
                const Icon = stepIcons[i] || FaLeaf;
                const color = step.color || stepColors[i] || "#D88C5B";
                return (
                  <div key={step.title || i} style={{
                    background: "#fff", borderRadius: 16, padding: "24px 14px", textAlign: "center",
                    display: "flex", flexDirection: "column", alignItems: "center",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.06)", transition: "all 0.3s ease",
                    minHeight: 240,
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.06)"; }}
                  >
                    <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#FCF7E8", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                      <Icon size={26} color={color} />
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "var(--red)", marginBottom: 6 }}>{String(i + 1).padStart(2, "0")}</span>
                    <h3 style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>{step.title}</h3>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .timeline-dashed-line { display: none; }
        @media (min-width: 1200px) {
          .timeline-dashed-line {
            display: block;
            position: absolute;
            top: 56px;
            left: 80px;
            right: 80px;
            border-top: 3px dashed var(--red);
            z-index: 1;
          }
        }
      `}</style>

      <div style={{ background: "#f7f2eb", padding: "60px 0" }}>
        <div className="container about-story-grid">
          <div className="quality-image">
            <img
              src={encodeURI(facilitySec.image || "/images/manufacturingquality.png")}
              alt="Inside R&R manufacturing facility"
              style={{ width: "100%", borderRadius: 18 }}
            />
          </div>
          <div>
            <p style={{ color: "var(--red)", fontWeight: 700, marginBottom: 6 }}>{facilitySec.tag || "INSIDE OUR FACILITY"}</p>
            <h2 style={{ marginTop: 0 }}>{facilitySec.heading || "Built for Quality, Designed for Scale"}</h2>
            <p style={{ lineHeight: 1.7, color: "var(--text-muted)" }}>
              {facilitySec.body || "Our modern manufacturing unit in Bhairahawa combines traditional Nepali recipes with advanced technology to deliver snacks that taste authentic and meet the highest quality standards."}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
              {facilityFeatures.map((item) => (
                <div
                  key={item.title}
                  style={{
                    background: "#fff", borderRadius: 12, padding: "16px",
                    display: "flex", alignItems: "flex-start", gap: 10,
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
                    <FaIndustry />
                  </span>
                  <div>
                    <strong style={{ fontSize: 14, display: "block" }}>{item.title}</strong>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: "linear-gradient(135deg, #C72D29, #D3A836)", padding: "48px 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ marginTop: 0, fontSize: "clamp(24px, 3vw, 36px)", color: "#fff", fontWeight: 700 }}>{ctaSec.heading || "Interested in Bulk Orders?"}</h2>
          <p style={{ maxWidth: 480, margin: "0 auto 20px", opacity: 0.9, fontSize: 15, color: "#fff" }}>
            {ctaSec.body || "We offer competitive pricing for retailers and distributors across Nepal."}
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", marginBottom: 18, flexWrap: "wrap" }}>
            <Link to="/contact" className="btn btn-white">
              <FiShoppingBag /> {ctaSec.button1Text || "Become a Distributor"}
            </Link>
            <a
              href={`https://wa.me/${whatsAppNumber}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-whatsapp"
            >
              <FiMessageCircle /> {ctaSec.button2Text || "Chat on WhatsApp"}
            </a>
          </div>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", fontSize: 13, flexWrap: "wrap" }}>
            {(ctaSec.badges || ["Nationwide Delivery", "FSSAI Certified", "Consistent Quality"]).map((badge) => (
              <span key={badge} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.2)", padding: "6px 14px", borderRadius: 999 }}>
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 60, paddingBottom: 60 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <p style={{ color: "var(--red)", fontWeight: 700, marginBottom: 6 }}>{capSec.tag || "OUR CAPABILITIES"}</p>
          <h2 style={{ marginTop: 0 }}>{capSec.heading || "Why Our Manufacturing Stands Out"}</h2>
        </div>
        <div className="manufacturing-why-grid">
          {capabilities.map((item) => (
            <div key={item.title} style={{ background: "#fff", borderRadius: 12, padding: 24, textAlign: "center", border: "1px solid var(--border-color)" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--cream)", color: "var(--red)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 20 }}>
                <FaIndustry />
              </div>
              <h4 style={{ margin: "0 0 6px" }}>{item.title}</h4>
              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
