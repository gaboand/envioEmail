import express from 'express';
import {EmailModel} from '../dao/models/emails.js';
import upload from '../middleware/multer.js';
import fs from 'fs';
import path from 'path';
import { publicPath } from '../utils.js';

const router = express.Router();

// Ruta para obtener la lista de imágenes
router.get('/images', async (req, res) => {
    try {
        const imgDir = path.join(publicPath, 'img');

        // Crear el directorio si no existe
        if (!fs.existsSync(imgDir)) {
            fs.mkdirSync(imgDir, { recursive: true });
        }

        const files = fs.readdirSync(imgDir).map(file => ({
            name: file,
            path: `/img/${file}`,
            size: fs.statSync(path.join(imgDir, file)).size
        }));
        res.json(files);
    } catch (error) {
        console.error('Error al obtener las imágenes:', error);
        res.status(500).send('Error al obtener las imágenes');
    }
});

// Ruta para cargar una imagen
router.post('/upload', upload.single('upload'), (req, res) => {
    const imgPath = path.join(publicPath, 'img', req.file.originalname);
    if (fs.existsSync(imgPath)) {
        return res.status(409).json({ uploaded: false, error: 'File exists' });
    }
    fs.renameSync(req.file.path, imgPath);
    res.status(201).json({
        uploaded: true,
        url: `/img/${req.file.filename}`
    });
});

// Ruta para buscar imágenes
router.get('/browse-images', (req, res) => {
    const imgDir = path.join(publicPath, 'img');
    fs.readdir(imgDir, (err, files) => {
        if (err) {
            console.error('Error al leer el directorio de imágenes:', err);
            return res.status(500).send('Error al leer el directorio de imágenes');
        }
        res.render('browseImages', { images: files.map(file => `/img/${file}`) });
    });
});

// Ruta para listar todos los emails
router.get('/', async (req, res) => {
    try {
        const emails = await EmailModel.find({});
        res.render('emailList', { emails: emails.map(email => email.toObject()) });
    } catch (error) {
        console.error('Error al obtener los emails:', error);
        res.status(500).send('Error al obtener los emails');
    }
});

// Ruta para obtener un email por ID
router.get('/:id', async (req, res) => {
    try {
        const email = await EmailModel.findById(req.params.id);
        res.json(email.toObject());
    } catch (error) {
        console.error('Error al obtener el email:', error);
        res.status(500).send('Error al obtener el email');
    }
});

// Ruta para crear un nuevo email
router.put('/', upload.single('imageFile'), async (req, res) => {
    try {
        const { type, subject, body } = req.body;
        let image = req.body.image || '';

        if (req.file) {
            const imgPath = path.join(publicPath, 'img', req.file.originalname);
            if (fs.existsSync(imgPath)) {
                return res.status(409).json({ message: 'File exists', filename: req.file.originalname });
            }
            image = `/img/${req.file.filename}`;
            fs.renameSync(req.file.path, imgPath);
        }

        const newEmail = new EmailModel({ type, subject, body, image });
        await newEmail.save();
        res.status(201).send('Email creado exitosamente');
    } catch (error) {
        console.error('Error al crear el email:', error);
        res.status(500).send('Error al crear el email');
    }
});

// Ruta para actualizar un email existente
router.post('/edit/:id', upload.single('imageFile'), async (req, res) => {
    try {
        const { subject, body, existingImage, overwrite } = req.body;

        let imagePath = existingImage || '';

        if (req.file) {
            const imgPath = path.join(publicPath, 'img', req.file.originalname);
            if (fs.existsSync(imgPath) && !overwrite) {
                return res.status(409).json({ message: 'File exists', filename: req.file.originalname });
            }
            imagePath = `/img/${req.file.filename}`;
            if (overwrite || !fs.existsSync(imgPath)) {
                fs.renameSync(req.file.path, imgPath);
            }
        }

        await EmailModel.findByIdAndUpdate(req.params.id, { subject, body, image: imagePath });
        res.status(200).send('Email actualizado exitosamente');
    } catch (error) {
        console.error('Error al actualizar el email:', error);
        res.status(500).send('Error al actualizar el email');
    }
});

// Ruta para eliminar un email
router.delete('/delete/:id', async (req, res) => {
    try {
        await EmailModel.findByIdAndDelete(req.params.id);
        res.status(200).send('Email eliminado exitosamente');
    } catch (error) {
        console.error('Error al eliminar el email:', error);
        res.status(500).send('Error al eliminar el email');
    }
});

export default router;