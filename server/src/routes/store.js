import express from "express";
import { db } from "../db/db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET /api/store
// Mengambil pengaturan toko (publik)
router.get("/", (req, res) => {
    try {
        const settings = db.getSettings();

        return res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error("Gagal mengambil pengaturan toko:", error);

        return res.status(500).json({
            success: false,
            message: "Gagal mengambil pengaturan toko."
        });
    }
});

// PUT /api/store
// Memperbarui pengaturan toko (khusus admin)
router.put("/", authenticateToken, (req, res) => {
    try {
        const {
            storeName,
            storename,
            tagline,
            phone,
            address
        } = req.body ?? {};

        const current = db.getSettings();

        // Terima storeName dan storename untuk kompatibilitas
        const newStoreName = storeName ?? storename;

        const update = {};

        // Nama toko
        if (newStoreName !== undefined) {
            if (
                typeof newStoreName !== "string" ||
                !newStoreName.trim()
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Nama toko wajib berupa teks dan tidak boleh kosong."
                });
            }

            update.storeName = newStoreName.trim();
        } else {
            update.storeName = current.storeName;
        }

        // Tagline
        if (tagline !== undefined) {
            if (typeof tagline !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Tagline harus berupa teks."
                });
            }

            update.tagline = tagline.trim();
        } else {
            update.tagline = current.tagline;
        }

        // Nomor telepon
        if (phone !== undefined) {
            if (typeof phone !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Nomor telepon harus berupa teks."
                });
            }

            update.phone = phone.replace(/\D/g, "");
        } else {
            update.phone = current.phone;
        }

        // Alamat
        if (address !== undefined) {
            if (typeof address !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Alamat harus berupa teks."
                });
            }

            update.address = address.trim();
        } else {
            update.address = current.address;
        }

        const updatedSettings = db.updateSettings(update);

        return res.json({
            success: true,
            message: "Pengaturan toko berhasil disimpan.",
            data: updatedSettings
        });
    } catch (error) {
        console.error("Gagal memperbarui pengaturan toko:", error);

        return res.status(500).json({
            success: false,
            message: "Gagal memperbarui pengaturan toko."
        });
    }
});

export default router;
