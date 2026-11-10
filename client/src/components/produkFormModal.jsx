import React, { useState, useEffect } from "react";
import { X, Save, Upload, AlertCircle } from "lucide-react";
import { createProduct, updateProduct } from "../services/api";

export function ProductFormModal({
  isOpen,
  product = null,
  categories = [],
  onClose,
  onSuccess,
}) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [stockStatus, setStockStatus] = useState("Tersedia");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = Boolean(product && product.id);

  // Sync form state when product prop changes or modal opens
  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setCategoryId(product.categoryId || (categories[0]?.id || ""));
      setPrice(product.price !== undefined ? String(product.price) : "");
      setStockStatus(product.stockStatus || "Tersedia");
      setDescription(product.description || "");
      setImageUrl(product.image || "");
      setPhotoFile(null);
    } else {
      setName("");
      setCategoryId(categories[0]?.id || "");
      setPrice("");
      setStockStatus("Tersedia");
      setDescription("");
      setImageUrl("");
      setPhotoFile(null);
    }
    setError("");
  }, [product, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Nama produk wajib diisi.");
      return;
    }

    if (!categoryId) {
      setError("Pilih kategori produk terlebih dahulu.");
      return;
    }

    if (price === "" || Number(price) < 0) {
      setError("Harga produk harus bernilai 0 atau lebih.");
      return;
    }

    setIsLoading(true);

    try {
      // If a file was selected, send FormData (multipart/form-data)
      let payload;
      if (photoFile) {
        payload = new FormData();
        payload.append("name", name.trim());
        payload.append("categoryId", categoryId);
        payload.append("price", Number(price));
        payload.append("stockStatus", stockStatus);
        payload.append("description", description.trim());
        payload.append("photo", photoFile);
      } else {
        payload = {
          name: name.trim(),
          categoryId,
          price: Number(price),
          stockStatus,
          description: description.trim(),
          imageUrl: imageUrl.trim(),
        };
      }

      if (isEditMode) {
        await updateProduct(product.id, payload);
      } else {
        await createProduct(payload);
      }

      if (onSuccess) await onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || "Gagal menyimpan produk.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={headerStyle}>
          <div>
            <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: "700", color: "var(--primary, #3B2418)" }}>
              {isEditMode ? "Edit Menu Produk" : "Tambah Menu Baru"}
            </h3>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted, #7D6B5E)" }}>
              {isEditMode
                ? "Perbarui informasi dan ketersediaan menu"
                : "Tambahkan produk kuliner baru ke dalam katalog"}
            </span>
          </div>
          <button type="button" onClick={onClose} style={closeBtnStyle}>
            <X size={18} />
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div style={errorAlertStyle}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Product Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {/* Product Name */}
          <div>
            <label style={labelStyle}>Nama Produk *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="cth: Es Kopi Susu Aren"
              style={inputStyle}
            />
          </div>

          {/* Category & Price in two columns */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div>
              <label style={labelStyle}>Kategori *</label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                style={inputStyle}
              >
                {categories.length === 0 && (
                  <option value="">Pilih Kategori...</option>
                )}
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Harga (Rp) *</label>
              <input
                type="number"
                required
                min="0"
                step="500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="cth: 18000"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Stock Status */}
          <div>
            <label style={labelStyle}>Status Ketersediaan</label>
            <select
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value)}
              style={inputStyle}
            >
              <option value="Tersedia">Tersedia</option>
              <option value="Habis">Habis</option>
            </select>
          </div>

          {/* Image: URL or Upload */}
          <div>
            <label style={labelStyle}>URL Gambar atau Foto Produk</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setPhotoFile(null);
              }}
              placeholder="https://images.unsplash.com/..."
              style={inputStyle}
            />
            <div style={{ marginTop: "0.4rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <label style={uploadLabelStyle}>
                <Upload size={14} />
                <span>Upload File Gambar</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setPhotoFile(e.target.files[0]);
                      setImageUrl("");
                    }
                  }}
                />
              </label>
              {photoFile && (
                <span style={{ fontSize: "0.75rem", color: "#059669", fontWeight: "600" }}>
                  ✓ {photoFile.name}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Deskripsi Produk</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Komposisi, rasa, atau catatan menu..."
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          {/* Footer Actions */}
          <div style={footerStyle}>
            <button type="button" onClick={onClose} style={cancelBtnStyle}>
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={saveBtnStyle}
            >
              <Save size={16} />
              <span>{isLoading ? "Menyimpan..." : isEditMode ? "Perbarui" : "Simpan Produk"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Aliases for compatibility
export function ProdukFormModal(props) {
  return <ProductFormModal {...props} />;
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
  zIndex: 1050,
  padding: "1rem",
};

const modalStyle = {
  backgroundColor: "var(--surface, #FFFDF8)",
  borderRadius: "16px",
  width: "100%",
  maxWidth: "480px",
  padding: "1.5rem",
  boxShadow: "0 20px 25px -5px rgba(59, 36, 24, 0.15)",
  border: "1px solid var(--border-subtle, #E8DAC8)",
  boxSizing: "border-box",
  maxHeight: "90vh",
  overflowY: "auto",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "1rem",
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

const inputStyle = {
  width: "100%",
  padding: "0.6rem 0.8rem",
  borderRadius: "8px",
  border: "1px solid var(--border-subtle, #E8DAC8)",
  fontSize: "0.88rem",
  boxSizing: "border-box",
  outline: "none",
  backgroundColor: "var(--surface, #FFFDF8)",
  color: "var(--text, #2D211A)",
};

const uploadLabelStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.35rem",
  padding: "0.35rem 0.65rem",
  borderRadius: "6px",
  backgroundColor: "var(--background, #F5EBDD)",
  color: "var(--primary, #3B2418)",
  border: "1px solid var(--border-subtle, #E8DAC8)",
  fontSize: "0.75rem",
  fontWeight: "600",
  cursor: "pointer",
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

const footerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "0.6rem",
  marginTop: "1rem",
  paddingTop: "0.75rem",
  borderTop: "1px solid var(--border-subtle, #E8DAC8)",
};

const cancelBtnStyle = {
  padding: "0.6rem 1rem",
  borderRadius: "8px",
  backgroundColor: "var(--background, #F5EBDD)",
  color: "var(--text, #2D211A)",
  border: "1px solid var(--border-subtle, #E8DAC8)",
  fontSize: "0.85rem",
  fontWeight: "600",
  cursor: "pointer",
};

const saveBtnStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
  padding: "0.6rem 1.1rem",
  borderRadius: "8px",
  backgroundColor: "var(--primary, #3B2418)",
  color: "#ffffff",
  border: "none",
  fontSize: "0.85rem",
  fontWeight: "700",
  cursor: "pointer",
};

export default ProductFormModal;
