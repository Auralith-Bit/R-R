import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiTrash2, FiArrowLeft, FiArrowRight, FiMessageCircle, FiFileText, FiShoppingCart } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useCatalog } from "../context/CatalogContext";
import PageHero from "../components/PageHero";
import Seo from "../components/Seo";

export default function Cart() {
  const { items, subtotal, increaseQty, decreaseQty, removeItem, clearCart } = useCart();
  const { settings } = useCatalog();
  const navigate = useNavigate();

  const [delivery, setDelivery] = useState({
    fullName: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("whatsapp");
  const [errors, setErrors] = useState({});
  const [imgErrors, setImgErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setDelivery((d) => ({ ...d, [name]: value }));
  }

  function validate() {
    const errs = {};
    if (!delivery.fullName.trim()) errs.fullName = "Full name is required";
    if (!delivery.phone.trim()) errs.phone = "Phone number is required";
    if (!delivery.address.trim()) errs.address = "Delivery address is required";
    return errs;
  }

  function handlePlaceOrder() {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0 || items.length === 0) return;

    const lines = items
      .map((it) => `• ${it.name} (${it.size}) x${it.qty} — Rs.${it.price * it.qty}`)
      .join("\n");
    const rawMessage =
      `New Order Request\n\n` +
      `${lines}\n\n` +
      `Subtotal: Rs.${subtotal}\n\n` +
      `Name: ${delivery.fullName}\n` +
      `Phone: ${delivery.phone}\n` +
      `Address: ${delivery.address}\n` +
      (delivery.notes ? `Notes: ${delivery.notes}\n` : "") +
      `Payment: ${paymentMethod === "whatsapp" ? "Cash on delivery / bank transfer" : "eSewa"}`;

    window.open(
      `https://wa.me/${settings?.whatsappNumber || "9779820299711"}?text=${encodeURIComponent(rawMessage)}`,
      "_blank"
    );
    clearCart();
    navigate("/");
  }

  if (items.length === 0) {
    return (
      <div>
        <PageHero
          breadcrumb="HOME &gt; Your Cart"
          title="Review Your Cart"
          subtitle="Review your selected items before placing your order."
bgImage="/images/productswishlisthero.png"
          mobileBgImage="/images/hero/home hero aone chips green.png"
        />
        <div className="container" style={{ paddingTop: 60, paddingBottom: 60 }}>
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "80px 30px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "#fde3e3",
                color: "var(--red)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: 32,
              }}
            >
              <FiShoppingCart />
            </div>
            <h2 style={{ marginBottom: 10 }}>Your cart is empty</h2>
            <p style={{ color: "var(--text-muted)", maxWidth: 420, margin: "0 auto 24px" }}>
              Browse our products and add your favorite snacks to the cart.
            </p>
            <Link to="/products" className="btn btn-red">
              Browse Products <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Seo title="Your Cart" description="Review your order before sending it to R&R Food Products." path="/cart" noindex />
      <PageHero
        breadcrumb="HOME &gt; Your Cart"
        title="Review Your Cart"
        subtitle="Review your selected items before placing your order."
        bgImage="/images/productswishlisthero.png"
        mobileBgImage="/images/hero/home hero aone chips green.png"
      />
      <div className="container cart-layout" style={{ paddingTop: 60, paddingBottom: 60 }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: 26 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <h3 style={{ margin: 0 }}>
              Your Cart (<span style={{ color: "var(--red)" }}>{items.length}</span>)
            </h3>
            <button
              onClick={clearCart}
              style={{ background: "none", border: "none", color: "var(--red)", fontWeight: 600, fontSize: 13 }}
            >
              Clear All
            </button>
          </div>

          {items.map((it) => (
            <div
              key={it.lineId}
              style={{
                display: "flex",
                gap: 16,
                padding: "16px 0",
                borderTop: "1px solid var(--border-color)",
                alignItems: "center",
              }}
            >
              <img
                src={imgErrors[it.lineId] ? "/images/Logo.png" : encodeURI(it.image)}
                alt={it.name}
                style={{ width: 80, height: 80, borderRadius: 10, objectFit: "cover" }}
                onError={() => setImgErrors(prev => ({ ...prev, [it.lineId]: true }))}
              />
              <div style={{ flex: 1 }}>
                <strong>
                  {it.name} ({it.size})
                </strong>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  Rs.{it.price} each
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                  <button
                    onClick={() => decreaseQty(it.lineId)}
                    style={qtyBtnStyle}
                  >
                    −
                  </button>
                  <span style={{ minWidth: 20, textAlign: "center" }}>{it.qty}</span>
                  <button
                    onClick={() => increaseQty(it.lineId)}
                    style={qtyBtnStyle}
                  >
                    +
                  </button>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <strong>Rs.{it.price * it.qty}</strong>
                <button
                  onClick={() => removeItem(it.lineId)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    background: "none",
                    border: "none",
                    color: "var(--red)",
                    fontSize: 13,
                    marginTop: 8,
                  }}
                >
                  <FiTrash2 /> Remove
                </button>
              </div>
            </div>
          ))}

          <Link to="/products" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16, color: "var(--text-muted)", fontWeight: 600 }}>
            <FiArrowLeft /> Continue Shopping
          </Link>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 26 }}>
            <h3 style={{ marginTop: 0 }}>Order Summary</h3>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", color: "var(--text-muted)" }}>
              <span>Subtotal</span>
              <strong style={{ color: "#000" }}>Rs. {subtotal}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", color: "var(--text-muted)" }}>
              <span>Delivery fee</span>
              <span style={{ color: "#1b6f3c" }}>To be Calculated</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: "1px solid var(--border-color)", fontWeight: 700, fontSize: 18 }}>
              <span>Total</span>
              <span style={{ color: "var(--red)" }}>Rs. {subtotal}</span>
            </div>

            <h4 style={{ marginBottom: 6 }}>Delivery Details</h4>
            <label style={labelStyle}>Full Name *</label>
            <input name="fullName" value={delivery.fullName} onChange={handleChange} placeholder="Your full name" style={inputStyle} />
            {errors.fullName && <p style={errorStyle}>{errors.fullName}</p>}

            <label style={labelStyle}>Phone Number *</label>
            <input name="phone" value={delivery.phone} onChange={handleChange} placeholder="+977 9XXXXXXXXX" style={inputStyle} />
            {errors.phone && <p style={errorStyle}>{errors.phone}</p>}

            <label style={labelStyle}>Delivery Address *</label>
            <input name="address" value={delivery.address} onChange={handleChange} placeholder="Street, City, Landmark" style={inputStyle} />
            {errors.address && <p style={errorStyle}>{errors.address}</p>}

            <label style={labelStyle}>Order Notes (Optional)</label>
            <textarea name="notes" value={delivery.notes} onChange={handleChange} placeholder="Any Special Instructions?" rows={3} style={{ ...inputStyle, resize: "vertical" }} />

            <h4 style={{ marginBottom: 10 }}>Payment Method</h4>
            <label
              style={{
                display: "flex",
                gap: 10,
                padding: 14,
                borderRadius: 10,
                background: paymentMethod === "whatsapp" ? "#e6f7ec" : "#f7f7f7",
                border: `1px solid ${paymentMethod === "whatsapp" ? "#1b6f3c" : "var(--border-color)"}`,
                marginBottom: 10,
                cursor: "pointer",
              }}
            >
              <input type="radio" checked={paymentMethod === "whatsapp"} onChange={() => setPaymentMethod("whatsapp")} />
              <div>
                <strong style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <FiMessageCircle /> Order via WhatsApp
                </strong>
                <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "4px 0 0" }}>
                  Pay via cash on delivery or secure bank transfer after
                  confirming with our team
                </p>
              </div>
            </label>
            <label
              style={{
                display: "flex",
                gap: 10,
                padding: 14,
                borderRadius: 10,
                background: paymentMethod === "esewa" ? "#e6f7ec" : "#f7f7f7",
                border: `1px solid ${paymentMethod === "esewa" ? "#1b6f3c" : "var(--border-color)"}`,
                marginBottom: 16,
                cursor: "pointer",
              }}
            >
              <input type="radio" checked={paymentMethod === "esewa"} onChange={() => setPaymentMethod("esewa")} />
              <div>
                <strong style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <FiFileText /> Pay with eSewa
                </strong>
                <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "4px 0 0" }}>
                  Pay instantly and securely using your eSewa digital wallet.
                </p>
              </div>
            </label>

            <button className="btn btn-whatsapp" style={{ width: "100%" }} onClick={handlePlaceOrder}>
              <FiMessageCircle /> Place order via WhatsApp
            </button>
            <p style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", marginTop: 10 }}>
              You will be redirected to WhatsApp to confirm your order
              details with our team
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const qtyBtnStyle = {
  width: 30,
  height: 30,
  borderRadius: 8,
  border: "1px solid var(--border-color)",
  background: "#fafafa",
  fontWeight: 700,
  fontSize: 15,
  transition: "all 0.2s ease",
  cursor: "pointer",
};

const labelStyle = { fontSize: 13, fontWeight: 600, display: "block", marginTop: 10 };

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid var(--border-color)",
  background: "#fff",
  margin: "6px 0 4px",
  fontFamily: "inherit",
  fontSize: 14,
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
};

const errorStyle = { color: "var(--red)", fontSize: 12, margin: "0 0 10px" };
