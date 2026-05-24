import fileUpload from 'express-fileupload';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const addFile = async (req, res) => {
    const file = req.files.file;
    console.log(file);
    const location = path.join(__dirname, '..', '..', 'uploads', file.name);
    console.log(location);
    file.mv(location, (err) => {
        if (err) {
            return res.status(500).send(err);
        }
        return res.json({
            message: 'File uploaded successfully'
        });
    });
}