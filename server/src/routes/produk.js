import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import { db } from "../db/db.js";
import { authenticateToken } from "../middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Folder upload: server/uploads
const uploadsDir = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const router = express.Router();

// Konfigurasi penyimpanan gambar
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },

    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

        cb(null, `produk-${uniqueSuffix}${ext}`);
    }
});

// Konfigurasi upload gambar
const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif"
];

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();

        if (
            allowedExtensions.includes(ext) &&
            allowedMimeTypes.includes(file.mimetype)
        ) {
            return cb(null, true);
        }

        cb(new Error("Format gambar harus JPG, JPEG, PNG, WEBP, atau GIF."));
    }
});

// GET: Semua produk, mendukung pencarian dan filter
router.get("/", (req, res) => {
    try {
        const { search, stockStatus } = req.query;

        // Menerima categoryId dan kategoriId untuk kompatibilitas
        const categoryId = req.query.categoryId || req.query.kategoriId;

        const produk = db.getproduk({
            categoryId,
            search,
            stockStatus
        });

        return res.json({
            success: true,
            count: produk.length,
            data: produk
        });
    } catch (err) {
        console.error("Gagal mengambil produk:", err);

        return res.status(500).json({
            success: false,
            message: "Gagal mengambil data produk."
        });
    }
});

// GET: Detail produk berdasarkan ID
router.get("/:id", (req, res) => {
    try {
        const produk = db.getProductById(req.params.id);

        if (!produk) {
            return res.status(404).json({
                success: false,
                message: "Produk tidak ditemukan."
            });
        }

        return res.json({
            success: true,
            data: produk
        });
    } catch (err) {
        console.error("Gagal mengambil detail produk:", err);

        return res.status(500).json({
            success: false,
            message: "Gagal mengambil detail produk."
        });
    }
});

// POST: Tambah produk (admin)
router.post(
    "/",
    authenticateToken,
    upload.single("photo"),
    (req, res) => {
        try {
            const {
                name,
                price,
                stockStatus,
                imageUrl,
                description
            } = req.body;

            const categoryId =
                req.body.categoryId || req.body.kategoriId;

            if (typeof name !== "string" || !name.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Nama produk wajib diisi."
                });
            }

            if (!categoryId) {
                return res.status(400).json({
                    success: false,
                    message: "Kategori produk wajib dipilih."
                });
            }

            if (
                price === undefined ||
                price === "" ||
                !Number.isFinite(Number(price)) ||
                Number(price) < 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Harga produk harus berupa angka nol atau lebih."
                });
            }

            const category = db.getCategoryById(categoryId);

            if (!category) {
                return res.status(400).json({
                    success: false,
                    message: "Kategori produk tidak ditemukan."
                });
            }

            const validStockStatuses = ["Tersedia", "Habis"];

            if (
                stockStatus !== undefined &&
                !validStockStatuses.includes(stockStatus)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Status stok harus Tersedia atau Habis."
                });
            }

            const finalImage = req.file
                ? `/uploads/${req.file.filename}`
                : (imageUrl || "");

            const newProduct = db.addProduct({
                name: name.trim(),
                categoryId,
                price: Number(price),
                stockStatus: stockStatus || "Tersedia",
                description:
                    typeof description === "string"
                        ? description.trim()
                        : "",
                image: finalImage
            });

            return res.status(201).json({
                success: true,
                message: "Produk berhasil ditambahkan.",
                data: newProduct
            });
        } catch (err) {
            console.error("Gagal menambahkan produk:", err);

            return res.status(500).json({
                success: false,
                message: "Gagal menambahkan produk."
            });
        }
    }
);

// PUT: Perbarui produk (admin)
router.put(
    "/:id",
    authenticateToken,
    upload.single("photo"),
    (req, res) => {
        try {
            const { id } = req.params;

            const {
                name,
                price,
                stockStatus,
                imageUrl,
                description
            } = req.body;

            const categoryId =
                req.body.categoryId || req.body.kategoriId;

            const existing = db.getProductById(id);

            if (!existing) {
                return res.status(404).json({
                    success: false,
                    message: "Produk tidak ditemukan."
                });
            }

            const updatePayload = {};

            if (name !== undefined) {
                if (typeof name !== "string" || !name.trim()) {
                    return res.status(400).json({
                        success: false,
                        message: "Nama produk tidak boleh kosong."
                    });
                }

                updatePayload.name = name.trim();
            }

            if (categoryId !== undefined) {
                if (!db.getCategoryById(categoryId)) {
                    return res.status(400).json({
                        success: false,
                        message: "Kategori produk tidak ditemukan."
                    });
                }

                updatePayload.categoryId = categoryId;
            }

            if (price !== undefined) {
                if (
                    price === "" ||
                    !Number.isFinite(Number(price)) ||
                    Number(price) < 0
                ) {
                    return res.status(400).json({
                        success: false,
                        message: "Harga produk harus berupa angka nol atau lebih."
                    });
                }

                updatePayload.price = Number(price);
            }

            if (stockStatus !== undefined) {
                if (!["Tersedia", "Habis"].includes(stockStatus)) {
                    return res.status(400).json({
                        success: false,
                        message: "Status stok harus Tersedia atau Habis."
                    });
                }

                updatePayload.stockStatus = stockStatus;
            }

            if (description !== undefined) {
                updatePayload.description = description.trim();
            }

            if (req.file) {
                updatePayload.image = `/uploads/${req.file.filename}`;
            } else if (imageUrl !== undefined) {
                updatePayload.image = imageUrl.trim();
            }

            const updated = db.updateProduct(id, updatePayload);

            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: "Produk tidak ditemukan."
                });
            }

            return res.json({
                success: true,
                message: "Produk berhasil diperbarui.",
                data: updated
            });
        } catch (err) {
            console.error("Gagal memperbarui produk:", err);

            return res.status(500).json({
                success: false,
                message: "Gagal memperbarui produk."
            });
        }
    }
);

// PATCH: Ubah status stok produk (admin)
router.patch("/:id/stock", authenticateToken, (req, res) => {
    try {
        const { id } = req.params;

        const updated = db.toggleStock(id);

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Produk tidak ditemukan."
            });
        }

        return res.json({
            success: true,
            message: `Status stok berhasil diubah menjadi ${updated.stockStatus}.`,
            data: updated
        });
    } catch (err) {
        console.error("Gagal mengubah stok:", err);

        return res.status(500).json({
            success: false,
            message: "Gagal mengubah status stok."
        });
    }
});

// DELETE: Hapus produk (admin)
router.delete("/:id", authenticateToken, (req, res) => {
    try {
        const { id } = req.params;

        const existing = db.getProductById(id);

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Produk tidak ditemukan."
            });
        }

        const deleted = db.deleteProduct(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Produk tidak ditemukan."
            });
        }

        return res.json({
            success: true,
            message: "Produk berhasil dihapus."
        });
    } catch (err) {
        console.error("Gagal menghapus produk:", err);

        return res.status(500).json({
            success: false,
            message: "Gagal menghapus produk."
        });
    }
});

export default router;