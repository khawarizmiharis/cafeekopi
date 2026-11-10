import React, { useState } from "react";
import { MessageCircle } from "lucide-react";

export function ProductCard({ product, onSelectProduct }) {
  const [isHovered, setIsHovered] = useState(false);

  if (!product) return null;

  const isAvailable = product.stockStatus !== "Habis";

  // Format IDR Price
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(product.price || 0);

  // Fallback default image
  const defaultImage =
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";

  return (
    <div
      className="product-card"
      style={{
        ...cardStyle,
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: isHovered
          ? "0 14px 28px -4px rgba(59, 36, 24, 0.12), 0 2px 8px rgba(59, 36, 24, 0.04)"
          : "0 2px 10px rgba(59, 36, 24, 0.04)",
        borderColor: isHovered ? "var(--border-hover, #C49A6C)" : "var(--border-subtle, #E8DAC8)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image & Badges */}
      <div style={imageContainerStyle}>
        <img
          src={product.image || defaultImage}
          alt={product.name}
          style={{
            ...imageStyle,
            transform: isHovered ? "scale(1.04)" : "scale(1)",
          }}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = defaultImage;
          }}
        />

        {/* Category Pill Tag */}
        {product.categoryName && (
          <span style={categoryTagStyle}>{product.categoryName}</span>
        )}

        {/* Stock Status Badge */}
        <span
          style={{
            ...stockBadgeStyle,
            backgroundColor: isAvailable
              ? "rgba(240, 253, 244, 0.95)"
              : "rgba(254, 242, 242, 0.95)",
            color: isAvailable ? "#15803d" : "#b91c1c",
            borderColor: isAvailable ? "#bbf7d0" : "#fecaca",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: isAvailable ? "#22c55e" : "#ef4444",
              display: "inline-block",
            }}
          />
          <span>{product.stockStatus || "Tersedia"}</span>
        </span>
      </div>

      {/* Product Info */}
      <div style={bodyStyle}>
        <h3 style={titleStyle}>{product.name}</h3>

        {product.description && (
          <p style={descStyle}>{product.description}</p>
        )}

        {/* Footer: Price & Order Action */}
        <div style={footerStyle}>
          <div>
            <span style={priceLabelStyle}>Harga</span>
            <div style={priceStyle}>{formattedPrice}</div>
          </div>

          <button
            type="button"
            disabled={!isAvailable}
            onClick={() => isAvailable && onSelectProduct(product)}
            style={isAvailable ? orderBtnStyle : disabledBtnStyle}
            title={isAvailable ? "Pesan via WhatsApp" : "Stok sedang habis"}
          >
            {isAvailable ? (
              <>
                <MessageCircle size={15} />
                <span>Pesan</span>
              </>
            ) : (
              <span>Habis</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Minimalist Card Styles
const cardStyle = {
  backgroundColor: "var(--surface)",
  borderRadius: "16px",
  border: "1px solid var(--border-subtle)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
};

const imageContainerStyle = {
  position: "relative",
  width: "100%",
  paddingTop: "62%", // 16:10 aspect ratio
  backgroundColor: "var(--background)",
  overflow: "hidden",
};

const imageStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
};

const categoryTagStyle = {
  position: "absolute",
  top: "0.75rem",
  left: "0.75rem",
  backgroundColor: "rgba(59, 36, 24, 0.85)",
  backdropFilter: "blur(6px)",
  color: "var(--surface)",
  fontSize: "0.72rem",
  fontWeight: "600",
  padding: "0.22rem 0.6rem",
  borderRadius: "9999px",
  boxShadow: "0 2px 6px rgba(59, 36, 24, 0.15)",
};

const stockBadgeStyle = {
  position: "absolute",
  top: "0.75rem",
  right: "0.75rem",
  fontSize: "0.7rem",
  fontWeight: "700",
  padding: "0.22rem 0.55rem",
  borderRadius: "9999px",
  border: "1px solid",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.35rem",
  backdropFilter: "blur(6px)",
};

const bodyStyle = {
  padding: "1.25rem",
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
};

const titleStyle = {
  fontFamily: "var(--font-heading, inherit)",
  margin: "0 0 0.35rem 0",
  fontSize: "1.1rem",
  fontWeight: "700",
  color: "var(--primary)",
  lineHeight: 1.3,
  letterSpacing: "-0.01em",
};

const descStyle = {
  fontSize: "0.83rem",
  color: "var(--secondary)",
  lineHeight: 1.45,
  margin: "0 0 1.25rem 0",
  flexGrow: 1,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const footerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: "auto",
  paddingTop: "0.85rem",
  borderTop: "1px dashed var(--border-subtle)",
};

const priceLabelStyle = {
  fontSize: "0.68rem",
  color: "var(--secondary)",
  textTransform: "uppercase",
  fontWeight: "600",
  letterSpacing: "0.05em",
  display: "block",
};

const priceStyle = {
  fontFamily: "var(--font-heading, inherit)",
  fontSize: "1.15rem",
  fontWeight: "800",
  color: "var(--primary)",
};

const orderBtnStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.35rem",
  padding: "0.5rem 1rem",
  borderRadius: "9999px",
  backgroundColor: "var(--primary)",
  color: "var(--surface)",
  border: "none",
  fontWeight: "600",
  fontSize: "0.82rem",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const disabledBtnStyle = {
  display: "inline-flex",
  alignItems: "center",
  padding: "0.5rem 0.9rem",
  borderRadius: "9999px",
  backgroundColor: "var(--background)",
  color: "var(--secondary)",
  border: "1px solid var(--border-card)",
  fontWeight: "600",
  fontSize: "0.82rem",
  cursor: "not-allowed",
};

export default ProductCard;
