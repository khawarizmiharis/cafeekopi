import React, { useState } from "react";
import { X, Lock, Mail, AlertCircle, LogIn } from "lucide-react";
import { loginAdmin } from "../services/api";

export function AdminLoginModal({ isOpen, onClose, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await loginAdmin(email, password);
      if (data?.user) {
        onSuccess(data.user);
        onClose();
      }
    } catch (err) {
      setError(err.message || "Email atau password salah.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={iconBadgeStyle}>
              <img
                src="/logo.png"
                alt="Logo"
                style={{ height: "24px", width: "auto", objectFit: "contain" }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "700", color: "var(--primary, #3B2418)" }}>
                Login Administrator
              </h3>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted, #7D6B5E)" }}>
                Masuk untuk mengelola produk & toko
              </span>
            </div>
          </div>
          <button type="button" onClick={onClose} style={closeBtnStyle}>
            <X size={18} />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={errorAlertStyle}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Email Admin</label>
            <div style={inputWrapperStyle}>
              <Mail size={16} style={inputIconStyle} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@katalogwa.com"
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <div style={inputWrapperStyle}>
              <Lock size={16} style={inputIconStyle} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={submitBtnStyle}
          >
            <LogIn size={16} />
            <span>{isLoading ? "Memproses..." : "Masuk ke Dashboard"}</span>
          </button>

          <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--text-muted, #7D6B5E)", margin: 0 }}>
            Akun default demo: <code>admin@katalogwa.com</code> / <code>admin123</code>
          </p>
        </form>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(45, 33, 26, 0.65)",
  backdropFilter: "blur(4px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: "1rem",
};

const modalStyle = {
  backgroundColor: "var(--surface, #FFFDF8)",
  borderRadius: "16px",
  width: "100%",
  maxWidth: "400px",
  padding: "1.5rem",
  boxShadow: "0 20px 25px -5px rgba(59, 36, 24, 0.15)",
  border: "1px solid var(--border-subtle, #E8DAC8)",
  boxSizing: "border-box",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1.2rem",
};

const iconBadgeStyle = {
  width: "36px",
  height: "36px",
  borderRadius: "8px",
  backgroundColor: "var(--background, #F5EBDD)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const closeBtnStyle = {
  background: "var(--background, #F5EBDD)",
  border: "1px solid var(--border-subtle, #E8DAC8)",
  borderRadius: "50%",
  width: "32px",
  height: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "var(--text-muted, #7D6B5E)",
};

const labelStyle = {
  display: "block",
  fontSize: "0.82rem",
  fontWeight: "600",
  color: "var(--text, #2D211A)",
  marginBottom: "0.3rem",
};

const inputWrapperStyle = {
  position: "relative",
  display: "flex",
  alignItems: "center",
};

const inputIconStyle = {
  position: "absolute",
  left: "0.75rem",
  color: "var(--accent, #C49A6C)",
};

const inputStyle = {
  width: "100%",
  padding: "0.65rem 0.75rem 0.65rem 2.25rem",
  borderRadius: "8px",
  border: "1px solid var(--border-subtle, #E8DAC8)",
  backgroundColor: "var(--surface, #FFFDF8)",
  color: "var(--text, #2D211A)",
  fontSize: "0.88rem",
  boxSizing: "border-box",
  outline: "none",
};

const errorAlertStyle = {
  backgroundColor: "#fff1f2",
  color: "#e11d48",
  border: "1px solid #fecdd3",
  borderRadius: "8px",
  padding: "0.6rem 0.8rem",
  fontSize: "0.82rem",
  display: "flex",
  alignItems: "center",
  gap: "0.4rem",
  marginBottom: "0.75rem",
};

const submitBtnStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.45rem",
  padding: "0.75rem",
  borderRadius: "10px",
  backgroundColor: "var(--primary, #3B2418)",
  color: "#ffffff",
  border: "none",
  fontWeight: "700",
  fontSize: "0.9rem",
  cursor: "pointer",
  marginTop: "0.5rem",
};

export default AdminLoginModal;

