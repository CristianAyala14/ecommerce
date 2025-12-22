// middlewares/multer.js
import multer from "multer";

// Guardamos los archivos en memoria (no en disco)
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;
