import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Coffee,
  Utensils,
  Smile,
  Flame,
  MessageCircle,
} from "lucide-react";

export function HeroCarousel({ onSelectCategory, onScrollToMenu, phone = "6281234567890" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const slides = [
    {
      id: "slide-1",
      badge: "Signature Coffee Sprin",
      badgeIcon: Coffee,
      title: "Cita Rasa Kopi Asli, Diseduh Sepenuh Hati",
      desc: "Perpaduan biji kopi pilihan dan racikan barista berpengalaman menghasilkan aroma kaya dan rasa yang memikat di setiap tegukan.",
      image:
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1400&q=80",
      ctaLabel: "Jelajahi Kopi & Minuman",
      categoryTarget: "Minuman",
      highlight: "100% Biji Kopi Pilihan",
    },
    {
      id: "slide-2",
      badge: "Hidangan Spesial & Otentik",
      badgeIcon: Utensils,
      title: "Santap Lezat Menu Favorit Penuh Selera",
      desc: "Dari Nasi Goreng Spesial hingga Ayam Bakar Madu Pedas, dimasak fresh dengan rempah pilihan untuk kepuasan santap Anda.",
      image:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=80",
      ctaLabel: "Lihat Menu Makanan",
      categoryTarget: "Makanan",
      highlight: "Dimasak Fresh Setiap Hari",
    },
    {
      id: "slide-3",
      badge: "Camilan Gurih & Manis",
      badgeIcon: Flame,
      title: "Teman Nongkrong Paling Pas Setiap Saat",
      desc: "Pisang Cokelat Keju Lumer, Cireng Crispy, dan Dimsum hangat siap melengkapi obrolan santai dan waktu rehatmu.",
      image:
        "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1400&q=80",
      ctaLabel: "Pilih Camilan Renyah",
      categoryTarget: "Camilan",
      highlight: "Camilan Favorit Semua Kalangan",
    },
    {
      id: "slide-4",
      badge: "Suasana Hangat & Cozy",
      badgeIcon: Smile,
      title: "Ruang Santai untuk Nugas, Kerja & Rehat",
      desc: "Nikmati koneksi internet cepat, colokan charger di setiap sudut, dan ambience tenang untuk momen produktif maupun temu sahabat.",
      image:
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1400&q=80",
      ctaLabel: "Pesan Menu via WhatsApp",
      categoryTarget: "",
      highlight: "Free Wi-Fi & Cozy Ambience",
    },
  ];

  // Auto-play interval
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4800);

    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  const handleCtaClick = (slide) => {
    if (slide.categoryTarget && onSelectCategory) {
      onSelectCategory(slide.categoryTarget);
    }
    if (onScrollToMenu) {
      onScrollToMenu();
    } else {
      const menuSection = document.getElementById("catalog-content");
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div
      className="carousel-container"
      style={carouselWrapperStyle}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Sliding Track */}
      <div
        className="carousel-track"
        style={{
          ...trackStyle,
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {slides.map((slide) => {
          const BadgeIcon = slide.badgeIcon;
          return (
            <div key={slide.id} style={slideStyle}>
              {/* Background Image with Fallback */}
              <div
                style={{
                  ...bgImageStyle,
                  backgroundImage: `url(${slide.image})`,
                }}
              />

              {/* Gradient Scrim Overlay for Coffee Luxury Aesthetic */}
              <div style={overlayStyle} />

              {/* Slide Content Box */}
              <div className="container" style={contentContainerStyle}>
                <div style={textContentStyle}>
                  {/* Badge */}
                  <div style={badgeStyle}>
                    <BadgeIcon size={14} color="var(--accent, #C49A6C)" />
                    <span>{slide.badge}</span>
                  </div>

                  {/* Main Title */}
                  <h2 style={titleStyle}>{slide.title}</h2>

                  {/* Description */}
                  <p style={descStyle}>{slide.desc}</p>

                  {/* Action Buttons */}
                  <div style={btnGroupStyle}>
                    <button
                      type="button"
                      onClick={() => handleCtaClick(slide)}
                      style={primaryBtnStyle}
                      title={slide.ctaLabel}
                    >
                      <span>{slide.ctaLabel}</span>
                      <ArrowRight size={16} />
                    </button>

                    <a
                      href={`https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                        "Halo Coffe Sprin, saya ingin menanyakan menu favorit hari ini."
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={secondaryBtnStyle}
                      title="Hubungi CS via WhatsApp"
                    >
                      <MessageCircle size={15} />
                      <span>Chat WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrow: Previous */}
      <button
        type="button"
        onClick={handlePrev}
        style={{ ...navArrowStyle, left: "1.25rem" }}
        aria-label="Slide Sebelumnya"
        title="Slide Sebelumnya"
      >
        <ChevronLeft size={22} color="#ffffff" />
      </button>

      {/* Navigation Arrow: Next */}
      <button
        type="button"
        onClick={handleNext}
        style={{ ...navArrowStyle, right: "1.25rem" }}
        aria-label="Slide Selanjutnya"
        title="Slide Selanjutnya"
      >
        <ChevronRight size={22} color="#ffffff" />
      </button>

      {/* Indicators Dots & Progress Bar */}
      <div style={indicatorsWrapperStyle}>
        {slides.map((slide, idx) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            style={{
              ...dotStyle,
              width: currentIndex === idx ? "28px" : "8px",
              backgroundColor:
                currentIndex === idx ? "var(--accent, #C49A6C)" : "rgba(255, 255, 255, 0.4)",
            }}
            aria-label={`Buka slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// Inline Styles for Carousel
const carouselWrapperStyle = {
  position: "relative",
  width: "100%",
  overflow: "hidden",
  borderRadius: "20px",
  boxShadow: "0 12px 36px -6px rgba(59, 36, 24, 0.22)",
  backgroundColor: "var(--primary, #3B2418)",
  userSelect: "none",
  margin: "1.25rem 0 2rem 0",
};

const trackStyle = {
  display: "flex",
  transition: "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)",
  width: "100%",
};

const slideStyle = {
  minWidth: "100%",
  position: "relative",
  minHeight: "440px",
  display: "flex",
  alignItems: "center",
  boxSizing: "border-box",
};

const bgImageStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundSize: "cover",
  backgroundPosition: "center",
  zIndex: 1,
};

const overlayStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background:
    "linear-gradient(90deg, rgba(35, 20, 12, 0.92) 0%, rgba(45, 28, 18, 0.82) 45%, rgba(59, 36, 24, 0.45) 100%)",
  zIndex: 2,
};

const contentContainerStyle = {
  position: "relative",
  zIndex: 3,
  padding: "3.5rem 2rem",
};

const textContentStyle = {
  maxWidth: "580px",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const badgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.45rem",
  padding: "0.38rem 0.85rem",
  borderRadius: "9999px",
  backgroundColor: "rgba(255, 253, 248, 0.12)",
  backdropFilter: "blur(8px)",
  border: "1px solid rgba(196, 154, 108, 0.5)",
  color: "#FFFDF8",
  fontSize: "0.82rem",
  fontWeight: "600",
  width: "fit-content",
  letterSpacing: "0.02em",
};

const titleStyle = {
  margin: 0,
  fontSize: "clamp(1.75rem, 3.8vw, 2.6rem)",
  fontWeight: "800",
  lineHeight: 1.2,
  color: "#FFFDF8",
  letterSpacing: "-0.02em",
  fontFamily: "var(--font-heading, inherit)",
};

const descStyle = {
  margin: 0,
  fontSize: "clamp(0.9rem, 1.8vw, 1.02rem)",
  lineHeight: 1.6,
  color: "#E8DAC8",
  maxWidth: "520px",
};

const btnGroupStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.85rem",
  flexWrap: "wrap",
  marginTop: "0.5rem",
};

const primaryBtnStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "0.75rem 1.35rem",
  borderRadius: "10px",
  backgroundColor: "var(--accent, #C49A6C)",
  color: "#2D211A",
  fontWeight: "700",
  fontSize: "0.92rem",
  border: "none",
  cursor: "pointer",
  boxShadow: "0 4px 14px rgba(196, 154, 108, 0.35)",
  transition: "all 0.2s ease",
};

const secondaryBtnStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.45rem",
  padding: "0.75rem 1.25rem",
  borderRadius: "10px",
  backgroundColor: "rgba(255, 253, 248, 0.1)",
  color: "#FFFDF8",
  fontWeight: "600",
  fontSize: "0.9rem",
  border: "1px solid rgba(255, 255, 255, 0.25)",
  textDecoration: "none",
  backdropFilter: "blur(6px)",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const navArrowStyle = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  backgroundColor: "rgba(35, 20, 12, 0.65)",
  backdropFilter: "blur(6px)",
  border: "1px solid rgba(232, 218, 200, 0.25)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  zIndex: 4,
  transition: "all 0.2s ease",
};

const indicatorsWrapperStyle = {
  position: "absolute",
  bottom: "1.25rem",
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  alignItems: "center",
  gap: "0.45rem",
  zIndex: 4,
  padding: "0.35rem 0.65rem",
  borderRadius: "9999px",
  backgroundColor: "rgba(20, 12, 7, 0.45)",
  backdropFilter: "blur(6px)",
};

const dotStyle = {
  height: "8px",
  borderRadius: "9999px",
  border: "none",
  cursor: "pointer",
  padding: 0,
  transition: "all 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
};

export default HeroCarousel;