// config/CloudinaryService.js
import cloudinary from "./cloudinary.js";

class CloudinaryService {
  static uploadImage(buffer, folder) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          format: "jpg", // siempre JPG
        },
        (error, result) => {
          if (error) reject(error);
          else resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );

      stream.end(buffer); // enviamos el buffer
    });
  }

  static async deleteImage(public_id) {
    if (!public_id) return;
    await cloudinary.uploader.destroy(public_id);
  }
}

export default CloudinaryService;
