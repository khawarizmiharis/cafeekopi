import React from "react";
import { Coffee } from "lucide-react";

export function CategoryPills({
  categories = [],
  activeCategoryId = "",
  onSelectCategory,
  totalProductsCount = 0,
}) {
  return (
    <div className="category-pills-wrapper" style={wrapperStyle}>
      {/* "Semua Menu" Pill */}
      <button
        type="button"
        onClick={() => onSelectCategory("")}
        style={activeCategoryId === "" ? activePillStyle : inactivePillStyle}
      >
        <Coffee size={14} />
        <span>Semua</span>
        {totalProductsCount > 0 && (
          <span style={badgeStyle(activeCategoryId === "")}>
            {totalProductsCount}
          </span>
        )}
      </button>

      {/* Dynamic Category Pills */}
      {categories.map((category) => {
        const isActive = activeCategoryId === category.id;
        const count = category.produktCount ?? category.productCount;

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelectCategory(category.id)}
            style={isActive ? activePillStyle : inactivePillStyle}
          >
            <span>{category.name}</span>
            {count !== undefined && count > 0 && (
              <span style={badgeStyle(isActive)}>{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Minimalist Pills Styling
const wrapperStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: "0.5rem",
  margin: "0.5rem auto 2.25rem auto",
  maxWidth: "800px",
  padding: "0 0.5rem",
};

const basePillStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
  padding: "0.45rem 1rem",
  borderRadius: "9999px",
  fontSize: "0.85rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
  outline: "none",
};

const activePillStyle = {
  ...basePillStyle,
  backgroundColor: "var(--primary)",
  color: "var(--surface)",
  border: "1.5px solid var(--primary)",
  boxShadow: "0 3px 10px rgba(59, 36, 24, 0.25)",
};

const inactivePillStyle = {
  ...basePillStyle,
  backgroundColor: "var(--surface)",
  color: "var(--text)",
  border: "1.5px solid var(--border-subtle)",
};

const badgeStyle = (isActive) => ({
  fontSize: "0.72rem",
  padding: "0.1rem 0.45rem",
  borderRadius: "9999px",
  backgroundColor: isActive ? "rgba(196, 154, 108, 0.35)" : "var(--background)",
  color: isActive ? "#FFFDF8" : "var(--secondary)",
  fontWeight: "700",
});

export default CategoryPills;
