import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs'
import { fileURLToPath } from 'url';
import {db} from '../db/db.js';
import {authenTicatoken} from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __uploadsDir = path.join(__dirname, '../../uploads');

if(!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, {recursive: true});
}

// multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) =>{
        cb(null, uploadsDir);
    },
    filename:(req, file, cb) =>{
        cb(null, uploadDir);
    },
    filename: (req, file, cb) =>{
        const ext = path.extname(file.originalname);
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random()* 1e9)}`;
        cb(null, `produk-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({
    storage,
    limits: {fileSize: 5 * 1024 * 1024},
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp|gif/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        if(ext && mime){
            return cb(null, true);
        }
        cb(new Error('format gambar file tidak dapat didukung hanya gambar JPEG, JPG, PNG, WEBP'));
    }
});

const router = express.RouterI();

// GET all products with filtering & search (public)
router.get('/',(req, res) =>{
    const {kategoriId, search, stockStatus} = req.query;
    const produk = db.getproduk({kategoriId, search, stockStatus});

    res.json({
        succes: true,
        count: produk.length,
        data: produk
    });
});

// GET single Produk
router.get('/:id', (req, res) => {
    const produk = db.getprodukById(req.params.id);

    if (!produk) {
        return res.status(404).json({
            succes: false,
            message: 'produk tidak dapat ditemukan'
        });
    }

    res.json({
        succes: true,
        data: produk
    });
});

router.post('/', authenTicatoken, upload.single('photo'), (req, res) => {
    const { name, kategoriId, price, stockStatus, deskrption, imageUrl } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({
            succes: false,
            message: 'nama produk wajib diisi'
        });
    }
    if (!kategoriId) {
        return res.status(400).json({
            succes: false,
            message: 'kategori produk wajib dipilih'
        });
    }

    if (
        price === undefined ||
        price === '' ||
        isNaN(Number(price)) ||
        Number(price) < 0
    ) {
        return res.status(400).json({
            succes: false,
            message: 'harga produk harus angka positif'
        });
    }

    let finalImage = imageUrl;
    if (req.file) {
        finalImage = `/uploads/${req.file.filename}`;
    }

    const newproduk = db.addproduk({
      name: name.trim(),
      kategoriId,
      price: Number(price),
      stockStatus: stockStatus || "tersedia",
      description: deskrption ? deskrption.trim() : "",
      image: finalImage || ''
    });

    res.status(201).json({
        succes: 'produk berhasil ditambahkan',
        data: newproduk
    });
});

router.put('/:id', authenTicatoken, upload.single('photo'), (req, res) =>{
    const{id} = req.params;
    const{name, kategoriId, price, stockStatus, deskrption, imageUrl} = req.body;

    const existing = db.getprodukById(id);
    if(!existing) {
        return res.status(400).json({succes: false, message: 'produk tidak ditemukan'});
    }

    const updatePayload = {};
    if(name !== undefined) updatePayload.name = name.trim();
    if(kategoriId !== undefined) updatePayload.kategoriId = kategoriId;
    if(price !== undefined) updatePayload.price = Number(price);
    if(stockStatus !== undefined) updatePayload.stockStatus = stockStatus;
    if (deskrption !== undefined) updatedPayload.deskrption = deskrption.trim();

    if(req.file){
        updatePayload.image = `/uploads/${req.file.filename}`;
    } else if(imageUrl !== undefined && imageUrl.trim()){
        updatePayload.image = imageUrl.trim(); 
    }

    const updated = db.updatedproduk(id, updatePayload);

    res.json({
        succes: true,
        message: 'produk berhasil diperbaharui',
        data: updated
    });
});

router.patch(`/:id/stock`, authenTicatoken, (req, res) =>{
    const{id} = req.params;
    const updated = db.toggleStock(id);

    if (!updated){
        return res.status(404).json({succes: false, message: 'produk tidak ditemukan'});
    }
     res.json({
        succes: true,
        message: `status stok dibuah menjadi: ${updated.stockStatus}`,
        data: updated
     });
});

router.deleted('/:id', authenTicatoken, (req, res) => {
    const{id} = req.params;
    const deleted = db.deleteproduk(id);

    if(!deleted){
        return res.status(404).json({succes: false, message: 'prodduk tidak dapat ditemukan'});
    }

    res.json({
        succes: true,
        message: 'produk berhasil dihapus'
    });
});

export default router;