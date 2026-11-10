import React, { useState } from "react";
import {
  ArrowLeft,
  LogOut,
  RefreshCw,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  Store,
  Layers,
  ShoppingBag,
} from "lucide-react";
import { toggleProductStock, deleteProduct } from "../services/api";
import { ProductFormModal } from "./produkFormModal";
import { ConfirmModal } from "./confimrModal";

export function AdminDashboard({
  products = [],
  categories = [],
  storeSettings,
  adminUser,
  onRefreshData,
  onBackToCatalog,
  onLogout,
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  // Toggle Stock availability
  const handleToggleStock = async (id) => {
    try {
      setIsUpdating(true);
      await toggleProductStock(id);
      if (onRefreshData) await onRefreshData();
    } catch (err) {
      alert(err.message || "Gagal mengubah status stok");
    } finally {
      setIsUpdating(false);
    }
  };

  // Open Form to Add New Product
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsFormModalOpen(true);
  };

  // Open Form to Edit Existing Product
  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setIsFormModalOpen(true);
  };

  // Confirm and Execute Deletion
  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;

    try {
      setIsUpdating(true);
      await deleteProduct(deleteCandidate.id);
      if (onRefreshData) await onRefreshData();
    } catch (err) {
      alert(err.message || "Gagal menghapus produk");
    } finally {
      setIsUpdating(false);
      setDeleteCandidate(null);
    }
  };

  return (
    <div style={dashboardWrapperStyle}>
      {/* Top Navbar */}
      <header style={topNavStyle}>
        <div style={navContentStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              type="button"
              onClick={onBackToCatalog}
              style={backBtnStyle}
              title="Kembali ke Katalog Publik"
            >
              <ArrowLeft size={16} />
              <span>Lihat Katalog</span>
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
              <img
                src="/logo.png"
                alt="Logo"
                style={{ height: "30px", width: "auto", objectFit: "contain" }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "700", color: "var(--primary, #3B2418)" }}>
                Panel Administrator
              </h2>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted, #7D6B5E)" }}>
              Login: <strong>{adminUser?.name || adminUser?.email || "Admin"}</strong>
            </span>
            <button
              type="button"
              onClick={onLogout}
              style={logoutBtnStyle}
              title="Logout"
            >
              <LogOut size={15} />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={mainContentStyle}>
        {/* Metric Cards */}
        <div style={metricGridStyle}>
          <div style={metricCardStyle}>
            <div style={metricIconStyle("#3B2418")}>
              <ShoppingBag size={20} color="var(--primary, #3B2418)" />
            </div>
            <div>
              <span style={metricLabelStyle}>Total Produk</span>
              <div style={metricValueStyle}>{products.length}</div>
            </div>
          </div>

          <div style={metricCardStyle}>
            <div style={metricIconStyle("#6F4E37")}>
              <Layers size={20} color="var(--secondary, #6F4E37)" />
            </div>
            <div>
              <span style={metricLabelStyle}>Kategori</span>
              <div style={metricValueStyle}>{categories.length}</div>
            </div>
          </div>

          <div style={metricCardStyle}>
            <div style={metricIconStyle("#C49A6C")}>
              <Store size={20} color="var(--accent, #C49A6C)" />
            </div>
            <div>
              <span style={metricLabelStyle}>Nama Toko</span>
              <div style={{ ...metricValueStyle, fontSize: "1.05rem" }}>
                {storeSettings?.storeName || "Coffe Sprin"}
              </div>
            </div>
          </div>
        </div>

        {/* Product Management Section */}
        <div style={tableCardStyle}>
          <div style={tableHeaderStyle}>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "700", color: "var(--primary, #3B2418)" }}>
                Kelola Stok & Menu Produk
              </h3>
              <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "var(--text-muted, #7D6B5E)" }}>
                Ubah ketersediaan stok, edit detail, atau tambah item baru
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                type="button"
                onClick={onRefreshData}
                disabled={isUpdating}
                style={refreshBtnStyle}
                title="Muat Ulang Data"
              >
                <RefreshCw size={15} className={isUpdating ? "animate-spin" : ""} />
                <span>Refresh</span>
              </button>

              <button
                type="button"
                onClick={handleOpenAdd}
                style={addBtnStyle}
                title="Tambah Produk Baru"
              >
                <Plus size={16} />
                <span>Tambah Produk</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr style={tableHeadRowStyle}>
                  <th style={thStyle}>Produk</th>
                  <th style={thStyle}>Kategori</th>
                  <th style={thStyle}>Harga</th>
                  <th style={thStyle}>Status Stok</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "2.5rem", color: "var(--text-muted, #7D6B5E)" }}>
                      Belum ada data produk di katalog.
                    </td>
                  </tr>
                ) : (
                  products.map((prod) => {
                    const isAvailable = prod.stockStatus !== "Habis";

                    return (
                      <tr key={prod.id} style={trStyle}>
                        <td style={tdStyle}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            {prod.image && (
                              <img
                                src={prod.image}
                                alt={prod.name}
                                style={thumbStyle}
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            )}
                            <div>
                              <strong style={{ fontSize: "0.9rem", color: "var(--text, #2D211A)" }}>
                                {prod.name}
                              </strong>
                              {prod.description && (
                                <p style={subtextStyle}>{prod.description}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td style={tdStyle}>
                          <span style={catBadgeStyle}>
                            {prod.categoryName || "Umum"}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <strong style={{ color: "var(--primary, #3B2418)" }}>Rp {(prod.price || 0).toLocaleString("id-ID")}</strong>
                        </td>
                        <td style={tdStyle}>
                          <button
                            type="button"
                            onClick={() => handleToggleStock(prod.id)}
                            style={stockToggleStyle(isAvailable)}
                            title="Klik untuk mengubah status stok"
                          >
                            {isAvailable ? (
                              <>
                                <CheckCircle size={14} />
                                <span>Tersedia</span>
                              </>
                            ) : (
                              <>
                                <XCircle size={14} />
                                <span>Habis</span>
                              </>
                            )}
                          </button>
                        </td>
                        <td style={{ ...tdStyle, textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: "0.4rem" }}>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(prod)}
                              style={editBtnStyle}
                              title="Edit Produk"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteCandidate(prod)}
                              style={deleteBtnStyle}
                              title="Hapus Produk"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Product Form Modal (Add / Edit) */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        product={editingProduct}
        categories={categories}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={onRefreshData}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteCandidate)}
        title="Hapus Menu Produk"
        message={`Apakah Anda yakin ingin menghapus "${deleteCandidate?.name}" dari katalog? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Produk"
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteCandidate(null)}
      />
    </div>
  );
}

// Inline Styles
const dashboardWrapperStyle = {
  backgroundColor: "var(--background, #F5EBDD)",
  minHeight: "100vh",
  width: "100%",
};

const topNavStyle = {
  backgroundColor: "var(--surface, #FFFDF8)",
  borderBottom: "1px solid var(--border-subtle, #E8DAC8)",
  position: "sticky",
  top: 0,
  zIndex: 40,
};

const navContentStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0.85rem 1.25rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "0.75rem",
};

const backBtnStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
  padding: "0.45rem 0.8rem",
  borderRadius: "8px",
  backgroundColor: "var(--background, #F5EBDD)",
  color: "var(--text, #2D211A)",
  border: "1px solid var(--border-subtle, #E8DAC8)",
  fontSize: "0.85rem",
  fontWeight: "600",
  cursor: "pointer",
};

const logoutBtnStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.35rem",
  padding: "0.45rem 0.75rem",
  borderRadius: "8px",
  backgroundColor: "#fff1f2",
  color: "#e11d48",
  border: "1px solid #fecdd3",
  fontSize: "0.82rem",
  fontWeight: "500",
  cursor: "pointer",
};

const mainContentStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "1.75rem 1.25rem",
};

const metricGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "1rem",
  marginBottom: "1.5rem",
};

const metricCardStyle = {
  backgroundColor: "var(--surface, #FFFDF8)",
  borderRadius: "12px",
  padding: "1.1rem",
  border: "1px solid var(--border-subtle, #E8DAC8)",
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  boxShadow: "0 2px 8px rgba(59, 36, 24, 0.04)",
};

const metricIconStyle = (color) => ({
  width: "44px",
  height: "44px",
  borderRadius: "10px",
  backgroundColor: `${color}18`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
});

const metricLabelStyle = {
  fontSize: "0.78rem",
  color: "var(--text-muted, #7D6B5E)",
  fontWeight: "600",
  textTransform: "uppercase",
};

const metricValueStyle = {
  fontSize: "1.4rem",
  fontWeight: "800",
  color: "var(--primary, #3B2418)",
  lineHeight: 1.2,
};

const tableCardStyle = {
  backgroundColor: "var(--surface, #FFFDF8)",
  borderRadius: "14px",
  border: "1px solid var(--border-subtle, #E8DAC8)",
  boxShadow: "0 4px 12px rgba(59, 36, 24, 0.05)",
  overflow: "hidden",
};

const tableHeaderStyle = {
  padding: "1.25rem",
  borderBottom: "1px solid var(--border-subtle, #E8DAC8)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "0.75rem",
};

const refreshBtnStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
  padding: "0.5rem 0.85rem",
  borderRadius: "8px",
  backgroundColor: "var(--background, #F5EBDD)",
  border: "1px solid var(--border-subtle, #E8DAC8)",
  color: "var(--text, #2D211A)",
  fontSize: "0.85rem",
  fontWeight: "600",
  cursor: "pointer",
};

const addBtnStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
  padding: "0.5rem 0.95rem",
  borderRadius: "8px",
  backgroundColor: "var(--primary, #3B2418)",
  color: "#ffffff",
  border: "none",
  fontSize: "0.85rem",
  fontWeight: "700",
  cursor: "pointer",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "left",
};

const tableHeadRowStyle = {
  backgroundColor: "var(--background, #F5EBDD)",
  borderBottom: "1px solid var(--border-subtle, #E8DAC8)",
};

const thStyle = {
  padding: "0.85rem 1.25rem",
  fontSize: "0.78rem",
  fontWeight: "700",
  color: "var(--secondary, #6F4E37)",
  textTransform: "uppercase",
  letterSpacing: "0.03em",
};

const trStyle = {
  borderBottom: "1px solid var(--border-subtle, #E8DAC8)",
};

const tdStyle = {
  padding: "0.9rem 1.25rem",
  fontSize: "0.88rem",
  color: "var(--text, #2D211A)",
  verticalAlign: "middle",
};

const thumbStyle = {
  width: "42px",
  height: "42px",
  borderRadius: "8px",
  objectFit: "cover",
  flexShrink: 0,
};

const subtextStyle = {
  margin: "2px 0 0",
  fontSize: "0.78rem",
  color: "var(--text-muted, #7D6B5E)",
  maxWidth: "320px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const catBadgeStyle = {
  display: "inline-block",
  padding: "0.2rem 0.55rem",
  borderRadius: "6px",
  backgroundColor: "var(--background, #F5EBDD)",
  color: "var(--secondary, #6F4E37)",
  border: "1px solid var(--border-subtle, #E8DAC8)",
  fontSize: "0.75rem",
  fontWeight: "600",
};

const stockToggleStyle = (isAvailable) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.35rem",
  padding: "0.35rem 0.7rem",
  borderRadius: "9999px",
  border: "none",
  fontSize: "0.78rem",
  fontWeight: "700",
  cursor: "pointer",
  backgroundColor: isAvailable ? "#dcfce7" : "#fee2e2",
  color: isAvailable ? "#15803d" : "#b91c1c",
});

const editBtnStyle = {
  background: "var(--background, #F5EBDD)",
  color: "var(--primary, #3B2418)",
  border: "1px solid var(--border-subtle, #E8DAC8)",
  borderRadius: "8px",
  padding: "0.45rem",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const deleteBtnStyle = {
  background: "#fef2f2",
  color: "#ef4444",
  border: "1px solid #fee2e2",
  borderRadius: "8px",
  padding: "0.45rem",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

export default AdminDashboard;

