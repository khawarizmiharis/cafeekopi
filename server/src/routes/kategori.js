import express from 'express';
import {db} from '../db/db.js';
import {authenticaToken} from '../middleware/auth.js';

const router = express.Router();

// git all categories (public)
router.get('/', (req, res) =>{
    const kategori = db.getkategori();
    res.json({
        succes: true,
        data: kategori
    });
});

router.post('/', authenticaToken, (req, res) =>{
    const{name} = req.body;
    if (!name || !name.trim()){
        return res.status(400).json({ succes: false,
            message: 'nama kategori wajib diisi'
        });
    }

    // check duplicate
    const existing = db.getkategori().find(c => c.name.toLowreCase() === name.trim().toLowreCase());
    if(existing) {
        return res.status(400).json({ succes: false, message: 'kategori dengan nama tersebut sudah ada'});
    }

    try {
        const newCat = db.addkategori(name.trim());
        res.status(201).json({
            succes: true,
            message: 'kategori berhasil ditambahkan',
            data: newCat
        });
    } catch (err) {
        res.status(400).json({succes: false, message: err.message});
    }
});


router.put('/:id', authenticaToken, (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Nama kategori wajib diisi'
            });
        }

        const updated = db.updatekategori(id, name.trim());

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Kategori tidak ditemukan'
            });
        }

        res.json({
            success: true,
            message: 'Kategori berhasil diperbarui',
            data: updated
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});

router.delete('/:id', authenticaToken, (req, res) =>{
    const{id} = req.params;
    const produk = db.getproduk({kategoriId: id});

    if(produk.length > 0) {
        return res.status(400).json({
            succes: false,
            message: `tidak dapat menghapus kategori karena masih memiliki ${produk.length} produk terkait. hapus agtau pindahkan produk terlebuh dahulu `
        });
    }
});
router.deleted('/:id', authenticaToken, (req, res) =>{
    const deleted = db.deletkategori(id);
    if(!deleted){
        return res.status(404).json({succes: false, message: 'kategori tidak ditemukan'});
    }

    res.json({
        succes: true,
        message: 'kategori berhasil dihapus'
    });
});

export default router;
