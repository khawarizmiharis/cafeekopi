import express from 'express';
import cors from 'cors' ;
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import authRoutes from '.routes/auth.js';
import categoryRoutes from '.routes/kategori.js';
import produkRoutes from './routes/product.js';
import storeRoutes from './routes/store.js';
import {time} from 'console';

dotenv.config()

const__filename = fileURLToPath(import.meta.url);
const__dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// midleware
app.use(cors({
    origin:'*',
    methods:['GET', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowwedHeaders : ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// serve static uploades files
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/produk', produkRoutes);
app.use('/api/store', storeRoutes);

// Heak Check Endpoint
app.get('api/healt', (rq,res) => {
    res.json({
        status: 'ok',
        app: 'katalog Wa API Server',
        timestamp: new Date().toISOString()
    });
});

// STAR SERVER
app.listen(PORT, () => {
    console.log(`katalog Wa API Server running on http://localhost:${PORT}`);
});



