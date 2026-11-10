import React from "react";
import { AlertTriangle, X } from "lucide-react";

export function ConfirmModal({
  isOpen,
  title = "Konfirmasi Aksi",
  message = "Apakah Anda yakin ingin melanjutkan tindakan ini?",
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  isDanger = false,
  onConfirm,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={iconBadgeStyle(isDanger)}>
            <AlertTriangle size={20} color={isDanger ? "#ef4444" : "var(--accent, #C49A6C)"} />
          </div>
          <button type="button" onClick={onClose} style={closeBtnStyle}>
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div style={{ marginTop: "0.5rem" }}>
          <h3 style={{ margin: "0 0 0.4rem 0", fontSize: "1.1rem", fontWeight: "700", color: "var(--primary, #3B2418)" }}>
            {title}
          </h3>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted, #7D6B5E)", lineHeight: 1.5 }}>
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div style={footerStyle}>
          <button type="button" onClick={onClose} style={cancelBtnStyle}>
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              if (onConfirm) onConfirm();
              if (onClose) onClose();
            }}
            style={confirmBtnStyle(isDanger)}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// Aliases for compatibility
export function ConfimrModal(props) {
  return <ConfirmModal {...props} />;
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
  zIndex: 1100,
  padding: "1rem",
};

const modalStyle = {
  backgroundColor: "var(--surface, #FFFDF8)",
  borderRadius: "16px",
  width: "100%",
  maxWidth: "380px",
  padding: "1.25rem",
  boxShadow: "0 20px 25px -5px rgba(59, 36, 24, 0.15)",
  border: "1px solid var(--border-subtle, #E8DAC8)",
  boxSizing: "border-box",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const iconBadgeStyle = (isDanger) => ({
  width: "40px",
  height: "40px",
  borderRadius: "10px",
  backgroundColor: isDanger ? "#fef2f2" : "var(--background, #F5EBDD)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const closeBtnStyle = {
  background: "var(--background, #F5EBDD)",
  border: "1px solid var(--border-subtle, #E8DAC8)",
  borderRadius: "50%",
  width: "28px",
  height: "28px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "var(--text-muted, #7D6B5E)",
};

const footerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "0.6rem",
  marginTop: "1.25rem",
};

const cancelBtnStyle = {
  padding: "0.55rem 0.95rem",
  borderRadius: "8px",
  backgroundColor: "var(--background, #F5EBDD)",
  color: "var(--text, #2D211A)",
  border: "1px solid var(--border-subtle, #E8DAC8)",
  fontSize: "0.85rem",
  fontWeight: "600",
  cursor: "pointer",
};

const confirmBtnStyle = (isDanger) => ({
  padding: "0.55rem 1rem",
  borderRadius: "8px",
  backgroundColor: isDanger ? "#dc2626" : "var(--primary, #3B2418)",
  color: "#ffffff",
  border: "none",
  fontSize: "0.85rem",
  fontWeight: "600",
  cursor: "pointer",
});

export default ConfirmModal;
