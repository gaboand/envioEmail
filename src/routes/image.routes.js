import express from 'express';
import upload from '../middleware/multer.js';
import fs from 'fs';
import path from 'path';
import { publicPath } from '../utils.js';

const router = express.Router();

// Ruta para cargar una imagen
router.post('/upload', upload.single('imageFile'), (req, res) => {
    const imgPath = path.join(publicPath, 'img', req.file.originalname);
    
    // Sobrescribir el archivo si ya existe
    fs.rename(req.file.path, imgPath, (err) => {
        if (err) {
            console.error('Error al sobrescribir la imagen:', err);
            return res.status(500).json({ uploaded: false, error: 'Error al sobrescribir la imagen' });
        }
        res.status(201).json({
            uploaded: true,
            url: `/img/${req.file.originalname}`
        });
    });
});

// Ruta para obtener la lista de imágenes
router.get('/images', (req, res) => {
    const imgDir = path.join(publicPath, 'img');
    if (!fs.existsSync(imgDir)) {
        return res.json([]);
    }
    const files = fs.readdirSync(imgDir).map(file => ({
        name: file,
        path: `/img/${file}`,
        size: fs.statSync(path.join(imgDir, file)).size
    }));
    res.json(files);
});

export default router;
