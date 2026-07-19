import React from "react";
import { Link } from "react-router-dom";
import { FiMessageCircle, FiTruck, FiCheckCircle, FiThumbsUp, FiShoppingBag } from "react-icons/fi";
import { FaMedal, FaLeaf, FaBolt, FaHeart, FaIndustry, FaFlask, FaClipboardCheck, FaWarehouse } from "react-icons/fa";
import PageHero from "../components/PageHero";
import Seo from "../components/Seo";
import { useCatalog } from "../context/CatalogContext";

const STEP_ICONS = [FaClipboardCheck, FaFlask, FaIndustry, FaWarehouse, FaMedal, FaLeaf];

export default function Manufacturing() {
  const { pages, settings } = useCatalog();
  const p = pages.manufacturing || {};
  const hero = p.hero || {};
  const processSec = p.processSteps || {};
  const facilitySec = p.facility || {};
  const ctaSec = p.cta || {};
  const capSec = p.capabilities || {};

  const whatsAppNumber = settings?.whatsappNumber || "9779857021032";

  const defaultSteps = [
    { title: "Quality Ingredients", desc: "Premium flour, spices, and seasonings sourced from trusted suppliers across Nepal." },
    { title: "Quality Testing", desc: "Rigorous in-lab testing to ensure purity and safety of every batch." },
    { title: "Precision Mixing", desc: "Traditional recipes combined with modern precision for consistent taste." },
    { title: "Cooking & Processing", desc: "Automated frying, roasting, and seasoning for authentic crunch and flavour." },
    { title: "Final Quality Check", desc: "Every product passes taste, texture, and packaging inspection before dispatch." },
    { title: "Packaging", desc: "Food-grade materials lock in freshness and crunch in a hygienic facility." },
  ];

  const steps = processSec.steps || defaultSteps;

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

      <div style={{ background: "#fff", padding: "60px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <p style={{ color: "var(--red)", fontWeight: 700, marginBottom: 6 }}>{processSec.tag || "HOW IT'S MADE"}</p>
            <h2 style={{ marginTop: 0 }}>{processSec.heading || "From Raw Ingredients to Your Favourite Snack"}</h2>
            <p style={{ maxWidth: 600, margin: "0 auto", color: "var(--text-muted)", lineHeight: 1.7 }}>
              {processSec.intro || "Every packet of Riya & Rakshya snacks goes through a carefully managed 6-step process \u2014 from selecting the finest ingredients to the final quality check before dispatch."}
            </p>
          </div>
          <div className="process-steps-row">
            {steps.map((step, i) => {
              const Icon = STEP_ICONS[i] || FaClipboardCheck;
              return (
                <div key={step.title} className="process-step-card">
                  <div style={{ position: "absolute", top: -12, left: 16, background: "var(--red)", color: "#fff", width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
                    {i + 1}
                  </div>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--cream)", color: "var(--red)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", fontSize: 18 }}>
                    <Icon />
                  </div>
                  <h4 style={{ margin: "0 0 6px", fontSize: 14 }}>{step.title}</h4>
                  <p style={{ fontSize: 11.5, color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

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

      <div style={{ background: "linear-gradient(120deg,#d94b2b,#f0b90b)", padding: "10px 0" }}>
        <div className="container manufacturing-cta">
          <h2 style={{ marginTop: 0, fontSize: 22 }}>{ctaSec.heading || "Interested in Bulk Orders?"}</h2>
          <p style={{ maxWidth: 480, margin: "0 auto 14px", opacity: 0.85, fontSize: 14 }}>
            {ctaSec.body || "We offer competitive pricing for retailers and distributors across Nepal."}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 14, flexWrap: "wrap" }}>
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
