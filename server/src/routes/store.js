import express from "express";
import { db } from "../db/db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET store settings (public)
router.get("/", (req, res) => {
    try {
        const settings = db.getSettings();

        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error("Gagal mengambil pengaturan toko:", error);

        res.status(500).json({
            success: false,
            message: "Gagal mengambil pengaturan toko"
        });
    }
});

// PUT update store settings (admin protected)
router.put("/", authenticateToken, (req, res) => {
    try {
        const { storename, tagline, phone, address } = req.body;

        const current = db.getSettings();

        const update = db.updateSettings({
            storename: storename || current.storename,
            tagline: tagline || current.tagline,
            phone: phone !== undefined
                ? phone.replace(/[^0-9]/g, "")
                : current.phone,
            address: address !== undefined
                ? address
                : current.address
        });

        res.json({
            success: true,
            message: "Pengaturan toko berhasil disimpan",
            data: update
        });
    } catch (error) {
        console.error("Gagal memperbarui pengaturan toko:", error);

        res.status(500).json({
            success: false,
            message: "Gagal memperbarui pengaturan toko"
        });
    }
});

export default router;
