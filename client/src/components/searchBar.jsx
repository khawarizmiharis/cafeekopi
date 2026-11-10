import React from "react";
import { Search, X } from "lucide-react";

export function SearchBar({
  search,
  setSearch,
  placeholder = "Cari menu, kopi, atau camilan favoritmu...",
}) {
  return (
    <div className="search-bar-wrapper" style={containerStyle}>
      <div style={inputWrapperStyle}>
        {/* Search Icon */}
        <Search size={17} style={searchIconStyle} />

        {/* Input Field */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={placeholder}
          style={inputStyle}
          className="search-input"
          aria-label="Cari menu"
        />

        {/* Clear Button when text is present */}
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            style={clearBtnStyle}
            title="Hapus pencarian"
            aria-label="Hapus pencarian"
          >
            <X size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

// Minimalist Floating Search Pill Styles
const containerStyle = {
  width: "100%",
  maxWidth: "580px",
  margin: "0 auto 1.75rem auto",
};

const inputWrapperStyle = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  width: "100%",
};

const searchIconStyle = {
  position: "absolute",
  left: "1.15rem",
  color: "var(--accent)",
  pointerEvents: "none",
  flexShrink: 0,
};

const inputStyle = {
  width: "100%",
  padding: "0.85rem 3rem 0.85rem 2.85rem",
  fontSize: "0.92rem",
  color: "var(--text)",
  backgroundColor: "var(--surface)",
  border: "1.5px solid var(--border-subtle)",
  borderRadius: "9999px",
  boxShadow: "var(--shadow-sm)",
  outline: "none",
  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
  boxSizing: "border-box",
};

const clearBtnStyle = {
  position: "absolute",
  right: "0.85rem",
  background: "var(--background)",
  border: "none",
  color: "var(--primary)",
  cursor: "pointer",
  padding: "4px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s ease",
};

export default SearchBar;
