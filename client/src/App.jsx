import React, { useState, useEffect } from "react";
import "./App.css";
import {
  fetchProducts,
  fetchCategories,
  fetchStoreSettings,
  fetchAdminProfile,
  clearAuthToken,
  getAuthToken,
} from "./services/api";
import { Header } from "./components/header";
import { CategoryPills } from "./components/kategoriPilss";
import { SearchBar } from "./components/searchBar";
import { ProductCard } from "./components/produkcard";
import { OrderModal } from "./components/orderModal";
import { AdminLoginModal } from "./components/AdminLoginModal";
import { AdminDashboard } from "./components/AdminDashboard";
import { HeroCarousel } from "./components/heroCarousel";
import { FeatureBar } from "./components/featureBar";
import { RunningText } from "./components/runningText";
import {
  Sparkles,
  MessageCircle,
  MapPin,
  Phone,
  RefreshCw,
} from "lucide-react";

export function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [storeSettings, setStoreSettings] = useState(null);
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [search, setSearch] = useState("");
  const [selectedProductForOrder, setSelectedProductForOrder] = useState(null);

  //Admin authentication & views
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  //Load all initial data from Node.js backend
  const loadData = async () => {
    try {
      const [prodRes, catRes, storeRes] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchStoreSettings(),
      ]);

      if (prodRes?.data) setProducts(prodRes.data);
      if (catRes?.data) setCategories(catRes.data);
      if (storeRes?.data) setStoreSettings(storeRes.data);
    } catch (err) {
      console.error("Gagal mengambil data katalog:", err);
    } finally {
      setIsLoading(false);
    }
  };

  //Restore authenticated session on mont if token exists
  useEffect(() => {
    loadData();

    const token = getAuthToken();
    if (token) {
      fetchAdminProfile()
        .then((res) => {
          if (res?.user) setAdminUser(res.user);
        })
        .catch(() => {
          clearAuthToken();
          setAdminUser(null);
        });
    }
  }, []);

  //Handle Logout
  const handleLogout = () => {
    clearAuthToken();
    setAdminUser(null);
    setIsAdminView(false);
  };

  // Filter products for Customer Catalog View
  const filteredProducts = products.filter((p) => {
    const matchesCat = !activeCategoryId || p.categoryId === activeCategoryId;
    const matchesSearch =
      !search ||
      (p.name && p.name.toLowerCase().includes(search.toLowerCase())) ||
      (p.description &&
        p.description.toLowerCase().includes(search.toLowerCase())) ||
      (p.categoryName &&
        p.categoryName.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="app-layout">
      {/* Main Content Area */}
      {isAdminView && adminUser ? (
        /* FLOW 2: ADMIN BACK-OFFICE WITH DEDICATED SIDEBAR */
        <AdminDashboard
          products={products}
          categories={categories}
          storeSettings={storeSettings}
          adminUser={adminUser}
          onRefreshData={loadData}
          onBackToCatalog={() => setIsAdminView(false)}
          onLogout={handleLogout}
        />
      ) : (
        /* FLOW 1: CUSTOMER CATALOG & WHATSAPP ORDERING */
        <>
          {/* Top Header Navigation for Public Customers */}
          <Header
            storeSettings={storeSettings}
            isAdminView={isAdminView}
            setIsAdminView={setIsAdminView}
            adminUser={adminUser}
            onOpenLogin={() => setIsAdminLoginOpen(true)}
            onLogout={handleLogout}
          />

          <main className="customer-catalog-view animate-fade-in">
            {/* Dynamic Running Image Carousel & Highlights */}
            <div className="container" style={{ paddingTop: "0.5rem" }}>
              <HeroCarousel
                onSelectCategory={(catName) => {
                  if (!catName) {
                    setActiveCategoryId("");
                  } else {
                    const found = categories.find(
                      (c) => c.name.toLowerCase() === catName.toLowerCase()
                    );
                    if (found) setActiveCategoryId(found.id);
                    else setActiveCategoryId("");
                  }
                  const catalogEl = document.getElementById("catalog-content");
                  if (catalogEl) catalogEl.scrollIntoView({ behavior: "smooth" });
                }}
                onScrollToMenu={() => {
                  const catalogEl = document.getElementById("catalog-content");
                  if (catalogEl) catalogEl.scrollIntoView({ behavior: "smooth" });
                }}
                phone={storeSettings?.phone || "6281234567890"}
              />

              {/* Running Text Marquee Beneath Carousel */}
              <RunningText storeSettings={storeSettings} />

              {/* Quick Feature Highlights Bar */}
              <FeatureBar />
            </div>

            <div id="catalog-content" className="container" style={{ paddingTop: "0.5rem" }}>
              {/* Section Header & Subheading */}
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.32rem 0.9rem",
                    borderRadius: "9999px",
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--accent)",
                    color: "var(--primary)",
                    fontSize: "0.82rem",
                    fontWeight: "600",
                    marginBottom: "0.6rem",
                  }}
                >
                  <Sparkles size={13} color="var(--accent)" />
                  <span>Katalog Pilihan Coffe Sprin</span>
                </span>
                <h2
                  style={{
                    margin: "0 0 0.4rem 0",
                    fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
                    fontWeight: "800",
                    color: "var(--primary)",
                    fontFamily: "var(--font-heading, inherit)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Pilih Menu Favorit Anda
                </h2>
                <p
                  style={{
                    margin: "0 auto",
                    fontSize: "0.92rem",
                    color: "var(--secondary)",
                    maxWidth: "540px",
                    lineHeight: 1.5,
                  }}
                >
                  {storeSettings?.tagline ||
                    "Pilih menu makanan, minuman, dan camilan favoritmu. Klik pesan, lalu chat langsung dengan kami di WhatsApp"}
                </p>
              </div>

              {/* Search Bar */}
              <SearchBar
                search={search}
                setSearch={setSearch}
                placeholder="Cari menu lezat... (cth: Es Kopi Susu, Nasi Goreng, Cireng, ...)"
              />

              {/* Category Filter Pills (Makanan | Minuman | Camilan) */}
              <CategoryPills
                categories={categories}
                activeCategoryId={activeCategoryId}
                onSelectCategory={setActiveCategoryId}
                totalProductsCount={products.length}
              />

              {/* Loading Skeleton */}
              {isLoading ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "4rem 1rem",
                    color: "var(--accent)",
                  }}
                >
                  <RefreshCw
                    size={32}
                    className="animate-spin"
                    style={{ margin: "0 auto 1rem", color: "var(--accent)" }}
                  />
                  <p style={{ color: "var(--secondary)" }}>Memuat katalog produk...</p>
                </div>
              ) : filteredProducts.length > 0 ? (
                /* Product Grid */
                <div className="catalog-grid animate-fade-in">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelectProduct={setSelectedProductForOrder}
                    />
                  ))}
                </div>
              ) : (
                /* Empty Search / Filter State */
                <div className="catalog-empty-state animate-fade-in">
                  <MessageCircle
                    size={48}
                    color="#94a3b8"
                    style={{ margin: "0 auto" }}
                  />
                  <h3 className="catalog-empty-title">Menu Tidak Ditemukan</h3>
                  <p className="catalog-empty-desc">
                    Tidak ada produk yang cocok dengan "{search}" pada kategori
                    terpilih.
                  </p>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setSearch("");
                      setActiveCategoryId("");
                    }}
                  >
                    Tampilkan Semua Menu
                  </button>
                </div>
              )}
            </div>

            {/* Customer Order Details Form Modal */}
            {selectedProductForOrder && (
              <OrderModal
                product={selectedProductForOrder}
                storeSettings={storeSettings}
                onClose={() => setSelectedProductForOrder(null)}
              />
            )}

            {/* Public Minimalist Footer */}
            <footer
              style={{
                backgroundColor: "var(--surface)",
                borderTop: "1px solid var(--border-subtle)",
                padding: "2.5rem 0",
                marginTop: "4rem",
              }}
            >
              <div
                className="container"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1.25rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                  <img
                    src="/logo.png"
                    alt={storeSettings?.storeName || "Coffe Sprin"}
                    style={{ height: "42px", width: "auto", objectFit: "contain" }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <div>
                    <strong style={{ fontFamily: "var(--font-heading, inherit)", fontSize: "1.08rem", color: "var(--primary)" }}>
                      {storeSettings?.storeName || "Coffe Sprin"}
                    </strong>
                    <p
                      style={{
                        color: "var(--secondary)",
                        fontSize: "0.84rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        marginTop: "0.25rem",
                      }}
                    >
                      <MapPin size={13} color="var(--accent)" />
                      <span>
                        {storeSettings?.address || "Sukabumi, Cibolang Kaler"}
                      </span>
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.45rem",
                    padding: "0.45rem 0.95rem",
                    backgroundColor: "var(--background)",
                    borderRadius: "9999px",
                    border: "1px solid var(--border-card)",
                  }}
                >
                  <Phone size={13} color="var(--accent)" />
                  <span>
                    WhatsApp CS:{" "}
                    <strong style={{ color: "var(--primary)" }}>{storeSettings?.phone || "6281234567890"}</strong>
                  </span>
                </div>
              </div>
            </footer>

            {/* Floating WhatsApp Quick Action Button */}
            <a
              href={`https://wa.me/${(storeSettings?.phone || "6281234567890").replace(/\D/g, "")}?text=${encodeURIComponent(
                "Halo Coffe Sprin, saya ingin menanyakan menu atau memesan langsung."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="floating-wa-btn"
              title="Chat CS Coffe Sprin di WhatsApp"
            >
              <MessageCircle size={20} color="#ffffff" />
              <span>Pesan via WA</span>
            </a>
          </main>
        </>
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={(user) => {
          setAdminUser(user);
          setIsAdminView(true);
        }}
      />
    </div> 
  );
}

export default App;
