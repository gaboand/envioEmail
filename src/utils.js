import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const rootPath = path.join(__dirname); 
export const publicPath = path.join(rootPath, 'public');
export const viewsPath = path.join(rootPath, 'views');