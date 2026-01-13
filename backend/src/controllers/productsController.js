import { productsDao } from "../database/dao_exports.js";
import CloudinaryService from "../config/CloudinaryService.js";

class productsController {
  static getAllProducts = async (req, res) => {
    try {
      const products = await productsDao.getAllProducts(req.query);
      res.status(200).json({
        status: "success",
        message: "Products obtained correctly.",
        payload: products,
      });
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  };

  static getProductById = async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(400).json({
          status: "error",
          message: "Product ID is required",
        });
      }

      const product = await productsDao.getProductById(req.params.id);
      res.status(200).json({
        status: "success",
        message: "Product delivered.",
        payload: product
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message
      });
    }
  };

  static createProduct = async (req, res) => {
    let uploadedImages = [];
    try {
      const productData = { ...req.body };

      // Subir imágenes si existen usando CloudinaryService
      if (req.files && req.files.length > 0) {
        uploadedImages = await Promise.all(
          req.files.map(file => CloudinaryService.uploadImage(file.buffer, "products"))
        );

        productData.images = uploadedImages.map(result => ({
          url: result.url,
          public_id: result.public_id,
        }));
      }

      const newProduct = await productsDao.createProduct(productData);

      res.status(201).json({
        status: "success",
        message: "Product created.",
        payload: newProduct
      });
    } catch (error) {
      // 🔥 ROLLBACK CLOUDINARY
      if (uploadedImages.length) {
        await Promise.all(
          uploadedImages.map(img => CloudinaryService.deleteImage(img.public_id))
        );
      }

      res.status(500).json({
        status: "error",
        message: error.message
      });
    }
  };

  static updateProduct = async (req, res) => {
    let uploadedImages = [];
    try {
      if (!req.params.id) {
        return res.status(400).json({
          status: "error",
          message: "Product ID is required",
        });
      }

      const product = await productsDao.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({
          status: "error",
          message: "Product not found",
        });
      }

      const updatedData = { ...req.body };

      // ================= IMAGES =================
      // Tomamos las imágenes existentes
      let finalImages = [...(product.images || [])];

      // Recorremos los slots de imagen (máx 4)
      for (let i = 0; i < 4; i++) {
        if (req.files[i]) {
          // Si hay nueva imagen en este slot
          // 1️⃣ Subir a Cloudinary
          const uploaded = await CloudinaryService.uploadImage(req.files[i].buffer, "products");
          uploadedImages.push(uploaded);

          // 2️⃣ Borrar la imagen anterior de Cloudinary (si existía)
          if (finalImages[i] && finalImages[i].public_id) {
            await CloudinaryService.deleteImage(finalImages[i].public_id);
          }

          // 3️⃣ Reemplazar en el array final
          finalImages[i] = {
            url: uploaded.url,
            public_id: uploaded.public_id,
          };
        }
        // Si no hay nueva imagen en el slot, se mantiene la existente
      }

      // Limitar a 4 imágenes
      finalImages = finalImages.filter(Boolean).slice(0, 4);

      // Guardamos en updatedData
      updatedData.images = finalImages;

      // Actualizar producto
      const updatedProduct = await productsDao.updateProduct(req.params.id, updatedData);

      res.status(200).json({
        status: "success",
        message: "Product updated correctly.",
        payload: updatedProduct
      });
    } catch (error) {
      // 🔥 Rollback de imágenes nuevas en Cloudinary
      if (uploadedImages.length) {
        await Promise.all(
          uploadedImages.map(img => CloudinaryService.deleteImage(img.public_id))
        );
      }

      res.status(500).json({
        status: "error",
        message: error.message
      });
    }
  };



  static deleteProduct = async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          status: "error",
          message: "Product ID is required",
        });
      }

      // 1️⃣ Buscar producto
      const product = await productsDao.getProductById(id);

      if (!product) {
        return res.status(404).json({
          status: "error",
          message: "Product not found",
        });
      }

      // 2️⃣ Eliminar imágenes en Cloudinary usando CloudinaryService
      if (Array.isArray(product.images) && product.images.length > 0) {
        await Promise.all(
          product.images.map(img => CloudinaryService.deleteImage(img.public_id))
        );
      }

      // 3️⃣ Eliminar producto de la DB
      const deletedProduct = await productsDao.deleteProduct(id);

      res.status(200).json({
        status: "success",
        message: "Product and images deleted correctly.",
        payload: deletedProduct,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  };


  static getProductsOnOffer = async (req, res) => {
    try {
      const products = await productsDao.getProductsOnOffer(req.query);
      res.status(200).send({
        status: "success",
        message: "Products obtained correctly.",
        payload: products
      });
    } catch (error) {
      res.status(500).send({
        status: "error",
        message: error.message
      });
    }
  };

  static getNewProducts = async (req, res) => {
    try {
      const newProducts = await productsDao.getNewProducts();
      res.status(200).send({
        status: "success",
        message: "New products obtained correctly.",
        payload: newProducts
      });
    } catch (error) {
      res.status(500).send({
        status: "error",
        message: error.message
      });
    }
  };
}

export { productsController };
