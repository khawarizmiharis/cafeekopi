import React from "react";
import { Coffee, Sparkles, Clock, MapPin, Wifi, Flame, Heart } from "lucide-react";

export function RunningText({ storeSettings }) {
  const storeName = storeSettings?.storeName || "Coffe Sprin";
  const address = storeSettings?.address || "Sukabumi, Cibolang Kaler";

  const tickerItems = [
    {
      icon: Coffee,
      text: `Selamat Datang di ${storeName} • Coffee & Eatery`,
      highlight: true,
    },
    {
      icon: Flame,
      text: "Promo Menarik Setiap Hari: Pesan Cepat via WhatsApp Tanpa Ribet",
      highlight: false,
    },
    {
      icon: Clock,
      text: "Buka Setiap Hari: 09.00 - 23.00 WIB",
      highlight: false,
    },
    {
      icon: Sparkles,
      text: "Diseduh dari 100% Biji Kopi Pilihan Terbaik & Segar",
      highlight: true,
    },
    {
      icon: MapPin,
      text: `Lokasi: ${address}`,
      highlight: false,
    },
    {
      icon: Wifi,
      text: "Tersedia Free High-Speed Wi-Fi & Colokan Nyaman untuk Nugas",
      highlight: false,
    },
    {
      icon: Heart,
      text: "Tempat Santai Bersama Sahabat, Pasangan & Keluarga Tercinta",
      highlight: true,
    },
  ];

  return (
    <div className="running-text-wrapper" style={wrapperStyle}>
      {/* Static Left Badge */}
      <div className="running-text-badge" style={badgeStyle}>
        <span style={pulseDotStyle} />
        <Coffee size={14} color="var(--accent, #C49A6C)" />
        <span style={{ fontWeight: "700", letterSpacing: "0.04em" }}>INFO HARI INI</span>
      </div>

      {/* Marquee Track Container */}
      <div className="marquee-container" style={marqueeContainerStyle}>
        {/* We render the track twice for seamless infinite looping */}
        <div className="marquee-track">
          {[...tickerItems, ...tickerItems].map((item, index) => {
            const Icon = item.icon;
            return (
              <span key={index} className="marquee-item" style={itemStyle}>
                <span style={bulletStyle}>
                  <Icon size={13} color="var(--accent, #C49A6C)" />
                </span>
                <span
                  style={{
                    color: item.highlight ? "#FFFDF8" : "#E8DAC8",
                    fontWeight: item.highlight ? "700" : "500",
                  }}
                >
                  {item.text}
                </span>
                <span style={separatorStyle}>•</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Inline Styles
const wrapperStyle = {
  display: "flex",
  alignItems: "center",
  backgroundColor: "var(--primary, #3B2418)",
  borderRadius: "12px",
  border: "1px solid rgba(196, 154, 108, 0.35)",
  overflow: "hidden",
  margin: "-0.5rem 0 1.5rem 0",
  boxShadow: "0 4px 16px rgba(59, 36, 24, 0.12)",
  height: "44px",
  position: "relative",
};

const badgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.45rem",
  padding: "0 1rem",
  height: "100%",
  backgroundColor: "rgba(35, 20, 12, 0.95)",
  borderRight: "1px solid rgba(196, 154, 108, 0.35)",
  color: "#FFFDF8",
  fontSize: "0.75rem",
  whiteSpace: "nowrap",
  zIndex: 3,
  flexShrink: 0,
};

const pulseDotStyle = {
  width: "7px",
  height: "7px",
  borderRadius: "50%",
  backgroundColor: "#22c55e",
  boxShadow: "0 0 8px #22c55e",
  display: "inline-block",
};

const marqueeContainerStyle = {
  overflow: "hidden",
  whiteSpace: "nowrap",
  flexGrow: 1,
  display: "flex",
  alignItems: "center",
  position: "relative",
};

const itemStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.45rem",
  fontSize: "0.85rem",
  whiteSpace: "nowrap",
};

const bulletStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "20px",
  height: "20px",
  borderRadius: "50%",
  backgroundColor: "rgba(196, 154, 108, 0.18)",
};

const separatorStyle = {
  margin: "0 1rem",
  color: "rgba(196, 154, 108, 0.6)",
  fontSize: "0.9rem",
};

export default RunningText;
