import React from "react";
import {
  User,
  Lock,
  LogOut,
  LayoutDashboard,
  MessageCircle,
} from "lucide-react";

export function Header({
  storeSettings,
  isAdminView,
  setIsAdminView,
  adminUser,
  onOpenLogin,
  onLogout,
}) {
  const storeName = storeSettings?.storeName || "Cofee Sprin";
  const tagline = storeSettings?.tagline || "Santai dengan Coffe yang nikmat ditemani dengan Makanan Yang Lezat";
  const phone = storeSettings?.phone || "6281234567890";

  return (
    <header className="site-header" style={headerStyle}>
      <div className="container" style={containerStyle}>
        {/* Brand Logo & Store Info */}
        <div style={brandWrapperStyle}>
          <img
            src="/logo.png"
            alt={storeName}
            style={logoImgStyle}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={brandTitleStyle}>{storeName}</span>
            <span style={brandTaglineStyle}>{tagline}</span>
          </div>
        </div>

        {/* Right Navigation & Action Controls */}
        <div style={actionsWrapperStyle}>
          {/* Quick WhatsApp Contact Link */}
          {phone && (
            <a
              href={`https://wa.me/${phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              style={whatsappBtnStyle}
              title="Chat dengan CS di WhatsApp"
            >
              <MessageCircle size={15} />
              <span className="nav-btn-label">Chat CS</span>
            </a>
          )}

          {/* Admin Navigation & Controls */}
          {adminUser ? (
            <div style={adminControlsStyle}>
              {/* Logged in Admin Profile Badge */}
              <div
                style={adminBadgeStyle}
                title={`Login sebagai: ${adminUser.email || adminUser.name}`}
              >
                <User size={14} />
                <span style={{ fontWeight: 600 }}>
                  {adminUser.name || "Admin"}
                </span>
              </div>

              {/* View Switcher: Catalog vs Dashboard */}
              <button
                type="button"
                onClick={() => setIsAdminView && setIsAdminView(!isAdminView)}
                style={dashboardBtnStyle}
                title={
                  isAdminView
                    ? "Kembali ke Katalog Menu"
                    : "Masuk ke Dashboard Admin"
                }
              >
                <LayoutDashboard size={14} />
                <span>{isAdminView ? "Katalog" : "Dashboard"}</span>
              </button>

              {/* Logout Action */}
              <button
                type="button"
                onClick={onLogout}
                style={logoutBtnStyle}
                title="Keluar dari sesi Admin"
              >
                <LogOut size={14} />
                <span>Keluar</span>
              </button>
            </div>
          ) : (
            /* Open Admin Login Modal Button */
            <button
              type="button"
              onClick={onOpenLogin}
              style={loginBtnStyle}
              title="Buka Login Admin"
            >
              <Lock size={14} />
              <span>Login Admin</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

// Minimalist Header Styles
const headerStyle = {
  position: "sticky",
  top: 0,
  zIndex: 100,
  backgroundColor: "rgba(255, 253, 248, 0.94)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  borderBottom: "1px solid var(--border-subtle)",
  boxShadow: "0 1px 4px rgba(59, 36, 24, 0.04)",
  width: "100%",
};

const containerStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0.85rem 1.5rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "1rem",
  flexWrap: "wrap",
};

const brandWrapperStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.85rem",
  textDecoration: "none",
  color: "inherit",
};

const logoImgStyle = {
  height: "46px",
  width: "auto",
  maxHeight: "46px",
  objectFit: "contain",
  display: "block",
  flexShrink: 0,
  filter: "drop-shadow(0 2px 4px rgba(59, 36, 24, 0.08))",
};

const brandTitleStyle = {
  fontFamily: "var(--font-heading, inherit)",
  fontSize: "1.15rem",
  fontWeight: "700",
  color: "var(--primary)",
  lineHeight: 1.2,
  letterSpacing: "-0.02em",
};

const brandTaglineStyle = {
  fontSize: "0.75rem",
  color: "var(--secondary)",
  marginTop: "2px",
  letterSpacing: "0.01em",
};

const actionsWrapperStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  flexWrap: "wrap",
};

const whatsappBtnStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
  padding: "0.45rem 0.85rem",
  borderRadius: "9999px",
  backgroundColor: "var(--surface)",
  color: "var(--primary)",
  border: "1.5px solid var(--accent)",
  fontSize: "0.82rem",
  fontWeight: "600",
  textDecoration: "none",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const adminControlsStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.45rem",
  flexWrap: "wrap",
};

const adminBadgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.35rem",
  padding: "0.42rem 0.75rem",
  borderRadius: "9999px",
  backgroundColor: "var(--surface)",
  color: "var(--text)",
  border: "1px solid var(--border-card)",
  fontSize: "0.8rem",
};

const dashboardBtnStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.35rem",
  padding: "0.45rem 0.85rem",
  borderRadius: "9999px",
  backgroundColor: "var(--primary)",
  color: "var(--surface)",
  border: "none",
  fontSize: "0.82rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "background-color 0.2s ease",
};

const logoutBtnStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.35rem",
  padding: "0.45rem 0.75rem",
  borderRadius: "9999px",
  backgroundColor: "#fff1f2",
  color: "#e11d48",
  border: "1px solid #fecdd3",
  fontSize: "0.8rem",
  fontWeight: "500",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const loginBtnStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
  padding: "0.45rem 0.9rem",
  borderRadius: "9999px",
  backgroundColor: "var(--surface)",
  color: "var(--primary)",
  border: "1.5px solid var(--accent)",
  fontSize: "0.82rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

export default Header;
