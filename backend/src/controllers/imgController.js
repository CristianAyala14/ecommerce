import cloudinary from "../config/cloudinary.js";

class imgController {
  static async upload(req, res) {
    try {
      if (!req.file) return res.status(400).json({ message: "No file uploaded" });

      // Subimos el buffer a Cloudinary
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profile_images" }, // carpeta opcional en Cloudinary
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        // Mandamos el buffer de Multer al stream de Cloudinary
        stream.end(req.file.buffer);
      });

      // Devolvemos la URL pública de la imagen
      res.status(200).json({ 
        status: "Success",
        message: "Image uploaded correctly.",
        url: result.secure_url });

        
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  }
}

export { imgController };
