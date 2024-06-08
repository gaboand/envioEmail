import multer from 'multer';
import path from 'path';

// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'src/public/img';
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

export default upload;
