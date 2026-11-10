import React, { useState } from "react";
import { X, Plus, Minus, MessageCircle } from "lucide-react";

export function OrderModal({ product, storeSettings, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  if (!product) return null;

  const price = product.price || 0;
  const totalPrice = price * quantity;

  const formattedTotal = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(totalPrice);

  const phone = storeSettings?.phone?.replace(/\D/g, "") || "6281234567890";
  const storeName = storeSettings?.storeName || "Kōhī & Co. Roastery";

  const handleSendWhatsApp = (e) => {
    e.preventDefault();

    if (!customerName.trim()) {
      alert("Silakan masukkan nama Anda.");
      return;
    }

    const message = `Halo ${storeName}, saya ingin memesan:
--------------------------------
*Pesanan:* ${product.name}
*Jumlah:* ${quantity} porsi / item
*Total:* ${formattedTotal}
--------------------------------
*Nama:* ${customerName.trim()}
*Alamat / Meja:* ${address.trim() || "-"}
*Catatan:* ${notes.trim() || "-"}
--------------------------------
Mohon konfirmasi ketersediaan dan detail pembayarannya. Terima kasih!`;

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={modalHeaderStyle}>
          <div>
            <h3 style={modalTitleStyle}>Detail Pesanan</h3>
            <span style={modalSubStyle}>
              Kirim pesanan langsung via WhatsApp kedai
            </span>
          </div>
          <button type="button" onClick={onClose} style={closeBtnStyle}>
            <X size={17} />
          </button>
        </div>

        {/* Product Summary */}
        <div style={productSummaryStyle}>
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "10px",
                objectFit: "cover",
              }}
            />
          )}
          <div style={{ flexGrow: 1 }}>
            <h4 style={{ margin: "0 0 3px 0", fontSize: "0.95rem", color: "#1c1917", fontWeight: "700" }}>
              {product.name}
            </h4>
            <span style={{ fontSize: "0.85rem", color: "#b45309", fontWeight: "700" }}>
              Rp {price.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* Form Details */}
        <form onSubmit={handleSendWhatsApp} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          {/* Quantity Selector */}
          <div>
            <label style={labelStyle}>Jumlah Pesanan</label>
            <div style={qtySelectorStyle}>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                style={qtyBtnStyle}
              >
                <Minus size={14} />
              </button>
              <span style={{ fontWeight: "700", minWidth: "32px", textAlign: "center", color: "#1c1917" }}>
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                style={qtyBtnStyle}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Customer Name */}
          <div>
            <label style={labelStyle}>
              Nama Pemesan <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Masukkan nama Anda"
              style={inputStyle}
            />
          </div>

          {/* Delivery Address */}
          <div>
            <label style={labelStyle}>Nomor Meja atau Alamat Antar (Opsional)</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="cth: Meja 05 / Jl. Mawar No. 12"
              style={inputStyle}
            />
          </div>

          {/* Special Notes */}
          <div>
            <label style={labelStyle}>Catatan Tambahan (Opsional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="cth: Less sugar, extra ice, pisahkan sambal"
              style={inputStyle}
            />
          </div>

          {/* Total & Submit */}
          <div style={modalFooterStyle}>
            <div>
              <span style={{ fontSize: "0.72rem", color: "#78716c", textTransform: "uppercase", fontWeight: "600", letterSpacing: "0.03em" }}>
                Total Bayar
              </span>
              <div style={{ fontFamily: "var(--font-heading, inherit)", fontSize: "1.25rem", fontWeight: "800", color: "#1c1917" }}>
                {formattedTotal}
              </div>
            </div>

            <button type="submit" style={submitBtnStyle}>
              <MessageCircle size={17} />
              <span>Pesan via WhatsApp</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Minimalist Modal Styles
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(28, 25, 23, 0.45)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: "1rem",
};

const modalStyle = {
  backgroundColor: "var(--surface)",
  borderRadius: "20px",
  width: "100%",
  maxWidth: "460px",
  padding: "1.75rem",
  boxShadow: "var(--shadow-modal)",
  boxSizing: "border-box",
  border: "1px solid var(--border-subtle)",
};

const modalHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "1rem",
};

const modalTitleStyle = {
  fontFamily: "var(--font-heading, inherit)",
  margin: 0,
  fontSize: "1.2rem",
  fontWeight: "700",
  color: "var(--primary)",
  letterSpacing: "-0.01em",
};

const modalSubStyle = {
  fontSize: "0.78rem",
  color: "var(--secondary)",
  marginTop: "2px",
  display: "block",
};

const closeBtnStyle = {
  background: "var(--background)",
  border: "none",
  borderRadius: "50%",
  width: "32px",
  height: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "var(--secondary)",
  transition: "all 0.2s ease",
};

const productSummaryStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.85rem",
  padding: "0.75rem 1rem",
  backgroundColor: "var(--background)",
  borderRadius: "12px",
  marginBottom: "1rem",
  border: "1px solid var(--border-subtle)",
};

const labelStyle = {
  display: "block",
  fontSize: "0.8rem",
  fontWeight: "600",
  color: "var(--primary)",
  marginBottom: "0.3rem",
};

const inputStyle = {
  width: "100%",
  padding: "0.65rem 0.85rem",
  borderRadius: "10px",
  border: "1.5px solid var(--border-subtle)",
  fontSize: "0.88rem",
  color: "var(--text)",
  boxSizing: "border-box",
  outline: "none",
  backgroundColor: "var(--surface)",
  transition: "border-color 0.2s ease",
};

const qtySelectorStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
  border: "1.5px solid var(--border-subtle)",
  borderRadius: "10px",
  padding: "0.25rem 0.45rem",
  backgroundColor: "var(--surface)",
};

const qtyBtnStyle = {
  background: "var(--background)",
  border: "none",
  borderRadius: "8px",
  width: "28px",
  height: "28px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "var(--primary)",
};

const modalFooterStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: "1.25rem",
  paddingTop: "1rem",
  borderTop: "1px dashed var(--border-subtle)",
};

const submitBtnStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.45rem",
  padding: "0.7rem 1.25rem",
  borderRadius: "9999px",
  backgroundColor: "var(--primary)",
  color: "var(--surface)",
  border: "none",
  fontWeight: "600",
  fontSize: "0.88rem",
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(59, 36, 24, 0.25)",
  transition: "all 0.2s ease",
};

export default OrderModal;
