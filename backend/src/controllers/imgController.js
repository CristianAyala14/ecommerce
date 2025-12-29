import cloudinary from "../config/cloudinary.js";

class imgController {
  // =========================
  // UPLOAD IMAGEN DE PERFIL
  // =========================
  static async uploadProfileImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          status: "error",
          message: "No file uploaded",
        });
      }

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "profile_images",
            format: "jpg"
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(req.file.buffer);
      });

      res.status(200).json({
        status: "success",
        message: "Image uploaded correctly.",
        url: result.secure_url,
        public_id: result.public_id,
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  }

  // =========================
  // UPLOAD IMAGEN DE PRODUCTO
  // =========================
  static async uploadProductImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          status: "error",
          message: "No file uploaded",
        });
      }

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "product_images",
            format: "jpg"
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(req.file.buffer);
      });

      res.status(200).json({
        status: "success",
        message: "Product image uploaded correctly.",
        url: result.secure_url,
        public_id: result.public_id,
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  }
}

export { imgController };
