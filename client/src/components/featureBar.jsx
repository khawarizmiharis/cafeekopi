import React from "react";
import { Coffee, Utensils, MessageCircle, Wifi } from "lucide-react";

export function FeatureBar() {
  const features = [
    {
      icon: Coffee,
      title: "100% Kopi Pilihan",
      desc: "Biji kopi berkualitas disangrai sempurna untuk aroma & rasa terbaik.",
    },
    {
      icon: Utensils,
      title: "Menu Fresh & Higienis",
      desc: "Bahan pilihan diracik langsung saat dipesan dengan resep otentik.",
    },
    {
      icon: MessageCircle,
      title: "Pesan Instan WhatsApp",
      desc: "Praktis tanpa antre dan tanpa ribet daftar akun.",
    },
    {
      icon: Wifi,
      title: "Nyaman & Free Wi-Fi",
      desc: "Suasana tenang, colokan listrik, dan koneksi internet cepat.",
    },
  ];

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div key={idx} style={cardStyle}>
              <div style={iconBoxStyle}>
                <Icon size={22} color="var(--primary, #3B2418)" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <h4 style={titleStyle}>{feat.title}</h4>
                <p style={descStyle}>{feat.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const containerStyle = {
  margin: "0 0 2rem 0",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
  gap: "1rem",
};

const cardStyle = {
  backgroundColor: "var(--surface, #FFFDF8)",
  borderRadius: "14px",
  padding: "1.1rem 1.25rem",
  border: "1px solid var(--border-subtle, #E8DAC8)",
  display: "flex",
  alignItems: "flex-start",
  gap: "0.85rem",
  boxShadow: "0 2px 8px rgba(59, 36, 24, 0.04)",
  transition: "all 0.2s ease",
};

const iconBoxStyle = {
  width: "42px",
  height: "42px",
  borderRadius: "10px",
  backgroundColor: "var(--background, #F5EBDD)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const titleStyle = {
  margin: 0,
  fontSize: "0.92rem",
  fontWeight: "700",
  color: "var(--primary, #3B2418)",
  fontFamily: "var(--font-heading, inherit)",
};

const descStyle = {
  margin: 0,
  fontSize: "0.78rem",
  color: "var(--text-muted, #7D6B5E)",
  lineHeight: 1.45,
};

export default FeatureBar;
