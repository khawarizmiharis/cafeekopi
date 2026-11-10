import express from 'express';
import { db } from '../db/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET: Semua kategori (public)
router.get('/', (req, res) => {
    try {
        const kategori = db.getkategori();

        return res.json({
            success: true,
            data: kategori
        });
    } catch (err) {
        console.error('Gagal mengambil kategori:', err);

        return res.status(500).json({
            success: false,
            message: 'Gagal mengambil data kategori'
        });
    }
});

// POST: Tambah kategori (admin)
router.post('/', authenticateToken, (req, res) => {
    try {
        const { name } = req.body;

        if (typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Nama kategori wajib diisi'
            });
        }

        const categoryName = name.trim();

        const existing = db.getkategori().find(
            category => category.name.toLowerCase() === categoryName.toLowerCase()
        );

        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'Kategori dengan nama tersebut sudah ada'
            });
        }

        const newCategory = db.addCategory(categoryName);

        return res.status(201).json({
            success: true,
            message: 'Kategori berhasil ditambahkan',
            data: newCategory
        });
    } catch (err) {
        console.error('Gagal menambahkan kategori:', err);

        return res.status(500).json({
            success: false,
            message: 'Gagal menambahkan kategori'
        });
    }
});

// PUT: Perbarui kategori (admin)
router.put('/:id', authenticateToken, (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Nama kategori wajib diisi'
            });
        }

        const categoryName = name.trim();

        const existing = db.getkategori().find(
            category =>
                category.name.toLowerCase() === categoryName.toLowerCase() &&
                category.id !== id
        );

        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'Nama kategori sudah digunakan'
            });
        }

        const updated = db.updateCategory(id, categoryName);

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Kategori tidak ditemukan'
            });
        }

        return res.json({
            success: true,
            message: 'Kategori berhasil diperbarui',
            data: updated
        });
    } catch (err) {
        console.error('Gagal memperbarui kategori:', err);

        return res.status(500).json({
            success: false,
            message: 'Gagal memperbarui kategori'
        });
    }
});

// DELETE: Hapus kategori (admin)
router.delete('/:id', authenticateToken, (req, res) => {
    try {
        const { id } = req.params;

        const category = db.getCategoryById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Kategori tidak ditemukan'
            });
        }

        const produk = db.getproduk({ categoryId: id });

        if (produk.length > 0) {
            return res.status(409).json({
                success: false,
                message: `Kategori masih memiliki ${produk.length} produk. Hapus atau pindahkan produk terlebih dahulu.`
            });
        }

        const deleted = db.deleteCategory(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Kategori tidak ditemukan'
            });
        }

        return res.json({
            success: true,
            message: 'Kategori berhasil dihapus'
        });
    } catch (err) {
        console.error('Gagal menghapus kategori:', err);

        return res.status(500).json({
            success: false,
            message: 'Gagal menghapus kategori'
        });
    }
});
export default router;
