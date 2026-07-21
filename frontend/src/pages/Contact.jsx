import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiMessageCircle,
  FiSend,
  FiChevronDown,
  FiAlertTriangle,
  FiFeather,
  FiThermometer,
  FiCalendar,
} from "react-icons/fi";
import PageHero from "../components/PageHero";
import Seo from "../components/Seo";
import { useCatalog } from "../context/CatalogContext";

const FALLBACK_WHATSAPP_NUMBER = "9779857021032";

const CONTACT_ICONS = [FiPhone, FiPhone, FiMail, FiMail, FiMapPin, FiClock];

export default function Contact() {
  const { settings, pages } = useCatalog();
  const p = pages.contact || {};
  const hero = p.hero || {};
  const contactInfo = p.contactInfo || {};
  const whatsappHelp = p.whatsappHelp || {};
  const formSec = p.form || {};
  const quickHelpSec = p.quickHelp || {};
  const ctaSec = p.cta || {};
  const faqSec = p.faq || {};

  const WHATSAPP_NUMBER = settings?.whatsappNumber || FALLBACK_WHATSAPP_NUMBER;
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.message.trim()) errs.message = "Message is required";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      errs.email = "Enter a valid email address";
    }
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      const text = [
        `Name: ${form.name}`,
        form.email && `Email: ${form.email}`,
        form.phone && `Phone: ${form.phone}`,
        form.inquiryType && `Inquiry: ${form.inquiryType}`,
        '',
        form.message,
      ].filter(Boolean).join('\n');
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", inquiryType: "", message: "" });
      setTimeout(() => setSubmitted(false), 4000);
    }
  }

  const defaultContactItems = [
    { label: "Customer Support", value: "+977 982-0299711" },
    { label: "Business/Wholesale", value: "+977 985-7021032" },
    { label: "Support Email", value: "Support@riyarakshya.com.np" },
    { label: "Sales/Distributors", value: "Sales@riyarakshya.com.np" },
    { label: "Address", value: "S.N.P-04, SugarMill Area, Bhairahawa Rupandehi" },
    { label: "Business Hours", value: "Sunday\u2013Friday (9:00 AM \u2013 6:00 PM)" },
  ];

  const contactItems = contactInfo.items || defaultContactItems;

  const defaultQuickHelpItems = [
    { title: "Report a Product Issue", desc: "Noticed a quality concern? Let us know immediately" },
    { title: "Ingredient & Allergy Info", desc: "Check packaging for detailed allergen information" },
    { title: "Storage Instructions", desc: "Store in a cool, dry place away from direct sunlight" },
    { title: "Expiry & Batch Details", desc: "Find batch numbers and expiry dates on the back of the pack" },
  ];
  const quickHelpColors = ["#f8d7da", "#d9f2e3", "#fdf1cf", "#fbdccb"];
  const quickHelpIcons = [FiAlertTriangle, FiFeather, FiThermometer, FiCalendar];

  const defaultFaqs = [
    { q: "Where is Riya & Rakshya Food Products located?", a: "Our manufacturing facility is located in Bhairahawa, Nepal. We operate from S.N.P-04, SugarMill Area and serve customers across all 77 districts of Nepal." },
    { q: "Are your snacks vegetarian?", a: "Yes, all our snacks are 100% vegetarian and prepared in a dedicated vegetarian facility." },
    { q: "How can I become a distributor?", a: "Please reach out via our contact form or call our business line. We will guide you through the distributor onboarding process with competitive pricing and dedicated support." },
    { q: "Do you offer bulk order discounts?", a: "Yes, we offer factory-direct pricing for bulk orders and have dedicated support for retailers and distributors. Contact our sales team for custom quotes based on your order volume." },
    { q: "How can I contact customer support?", a: "You can reach us at +977 982-0299711 for customer support, email us at Support@riyarakshya.com.np, or chat with us on WhatsApp. We are available Sunday-Friday, 9:00 AM to 6:00 PM." },
  ];

  const inquiryOptions = formSec.fields?.inquiryOptions || [
    { value: "general", label: "General Question" },
    { value: "distributor", label: "Become a Distributor" },
    { value: "bulk", label: "Bulk Order" },
    { value: "complaint", label: "Product Issue" },
  ];

  return (
    <div>
      <Seo
        title={hero.title || "Contact Us"}
        description="Get in touch with R&R Food Products (Riya and Rakshya Food Products) in Bhairahawa, Nepal — call, email, or message us on WhatsApp for orders and distributor inquiries."
        path="/contact"
      />
      <div style={{ marginBottom: 24 }}>
        <PageHero
          breadcrumb={hero.breadcrumb || "HOME > CONTACT"}
          title={hero.title || "Let's Get in Touch"}
          subtitle={hero.subtitle || "Got a question about your favorite snack? Want to become a distributor? We'd love to hear from you."}
          bgImage={hero.bgImage || "/images/contactherosection.png"}
        />
      </div>

      <div className="container contact-main-grid" style={{ paddingTop: 48, paddingBottom: 48 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ background: "linear-gradient(135deg, #C72D29, #D3A836)", color: "#fff", borderRadius: 14, padding: 32, flex: 1 }}>
            <h3 style={{ marginTop: 0, fontSize: 22, marginBottom: 14, fontWeight: 700 }}>{contactInfo.heading || "Get in Touch"}</h3>
            {contactItems.map((item, i) => {
              const Icon = CONTACT_ICONS[i] || FiPhone;
              return (
                <div key={i} style={{ display: "flex", gap: 12, padding: "13px 0", borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.25)" }}>
                  <Icon size={20} style={{ marginTop: 2 }} />
                  <div>
                    <strong style={{ display: "block", fontSize: 15, fontWeight: 700 }}>{item.label}:</strong>
                    <span style={{ fontSize: 14, opacity: 1, fontWeight: 500 }}>{item.value}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ background: "#d9f2e3", borderRadius: 14, padding: 24, textAlign: "center" }}>
            <FiMessageCircle size={28} color="#1b6f3c" />
            <h4 style={{ margin: "8px 0 4px", fontSize: 17 }}>{whatsappHelp.heading || "Need Quick Help?"}</h4>
            <p style={{ fontSize: 14, color: "#33613f", margin: "0 0 14px" }}>
              {whatsappHelp.body || "Message us directly on WhatsApp for immediate assistance."}
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-whatsapp"
              style={{ fontSize: 15, padding: "10px 22px" }}
            >
              <FiMessageCircle /> Chat on WhatsApp
            </a>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 16, padding: 40, display: "flex", flexDirection: "column" }}>
          <h3 style={{ marginTop: 0, fontSize: 24 }}>{formSec.heading || "Send us a Message"}</h3>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            {formSec.body || "Fill out the form below and we'll get back to you as soon as possible."}
          </p>
          {submitted && (
            <div style={{ background: "#d9f2e3", color: "#1b6f3c", padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
              {formSec.successMessage || "Thanks! Your message has been sent — we'll be in touch shortly."}
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <label style={{ fontSize: 14, fontWeight: 600 }}>{(formSec.fields || {}).nameLabel || "Name"} *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              style={inputStyle}
            />
            {errors.name && <p style={errorStyle}>{errors.name}</p>}

            <div className="contact-form-row">
              <div>
                <label style={{ fontSize: 14, fontWeight: 600 }}>{(formSec.fields || {}).emailLabel || "Email"}</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  style={inputStyle}
                />
                {errors.email && <p style={errorStyle}>{errors.email}</p>}
              </div>
              <div>
                <label style={{ fontSize: 14, fontWeight: 600 }}>{(formSec.fields || {}).phoneLabel || "Phone"}</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="How can we reach you?"
                  style={inputStyle}
                />
              </div>
            </div>

            <label style={{ fontSize: 14, fontWeight: 600 }}>{(formSec.fields || {}).inquiryLabel || "Inquiry Type"}</label>
            <select
              name="inquiryType"
              value={form.inquiryType}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Select an Option</option>
              {inquiryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <label style={{ fontSize: 14, fontWeight: 600 }}>{(formSec.fields || {}).messageLabel || "Message"} *</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Write your message here..."
              rows={5}
              style={{ ...inputStyle, resize: "vertical", flex: 1 }}
            />
            {errors.message && <p style={errorStyle}>{errors.message}</p>}

            <button type="submit" className="btn btn-red" style={{ width: "100%", marginTop: 8 }}>
              <FiSend /> {(formSec.fields || {}).submitText || "Send Message"}
            </button>
          </form>
        </div>
      </div>

      <div style={{ background: "#fff", padding: "60px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <p style={{ color: "var(--red)", fontWeight: 700, marginBottom: 6 }}>{quickHelpSec.tag || "SUPPORT CENTRE"}</p>
            <h2 style={{ marginTop: 0 }}>{quickHelpSec.heading || "Quick Help & Answers"}</h2>
          </div>
          <div className="quick-help-grid">
            {(quickHelpSec.items || defaultQuickHelpItems).map((q, i) => (
              <div key={q.title} style={{ background: quickHelpColors[i] || "#f5f5f5", borderRadius: 12, padding: 22 }}>
                {React.createElement(quickHelpIcons[i] || FiAlertTriangle, { size: 22 })}
                <h4 style={{ margin: "10px 0 6px" }}>{q.title}</h4>
                <p style={{ fontSize: 13, color: "#333", margin: 0 }}>{q.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "linear-gradient(135deg, #C72D29, #D3A836)", padding: "48px 0" }}>
        <div className="container cta-split-grid">
          <div style={{ color: "#fff" }}>
            <h2 style={{ marginTop: 0, fontSize: "clamp(24px, 3vw, 36px)", color: "#fff", fontWeight: 700 }}>{ctaSec.heading || "Ready to explore our snacks?"}</h2>
            <p style={{ opacity: 0.9, color: "#fff" }}>
              {ctaSec.body || "Browse our wide collection of freshly crafted snacks, made with quality ingredients and authentic recipes."}
            </p>
            <Link to="/products" className="btn btn-white">{ctaSec.buttonText || "Explore Menu"}</Link>
          </div>
          <div style={{ background: "#fff", borderRadius: 16, padding: 24 }}>
            <h3 style={{ color: "var(--red)", marginTop: 0 }}>
              {ctaSec.bulkHeading || "Interested in Bulk Orders or Distribution?"}
            </h3>
            <p style={{ color: "var(--text-muted)" }}>
              {ctaSec.bulkBody || "We're always looking for retail partners and distributors across Nepal."}
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <Link to="/about" className="btn btn-red">{ctaSec.bulkButton1 || "Learn more about us"}</Link>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="btn btn-whatsapp">
                <FiMessageCircle /> {ctaSec.bulkButton2 || "Contact Sales team"}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 60, paddingBottom: 60 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <p style={{ color: "var(--red)", fontWeight: 700, marginBottom: 6 }}>{faqSec.tag || "FREQUENTLY ASKED QUESTIONS"}</p>
          <h2 style={{ marginTop: 0 }}>{faqSec.heading || "Quick Help & Answers"}</h2>
        </div>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {(faqSec.items || defaultFaqs).map((f, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 10, marginBottom: 10, overflow: "hidden" }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: "100%", background: "none", border: "none",
                  padding: "18px 20px", display: "flex",
                  justifyContent: "space-between", alignItems: "center",
                  fontWeight: 600, fontSize: 15, textAlign: "left",
                }}
              >
                {f.q}
                <FiChevronDown style={{ transform: openFaq === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>
              {openFaq === i && (
                <p style={{ padding: "0 20px 18px", color: "var(--text-muted)", margin: 0 }}>{f.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
      <div style={{ paddingTop: 60 }}>
        <div style={{ overflow: "hidden" }}>
          <iframe
            title="Riya & Rakshya Food Products location"
            src="https://www.google.com/maps?q=Bhairahawa,Rupandehi,Nepal&output=embed"
            width="100%"
            height="500"
            style={{ border: 0, display: "block" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: 8,
  border: "1px solid var(--border-color)",
  background: "#fff",
  margin: "6px 0 16px",
  fontFamily: "inherit",
  fontSize: 15,
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
};

const errorStyle = {
  color: "var(--red)",
  fontSize: 12,
  margin: "-10px 0 12px",
};
