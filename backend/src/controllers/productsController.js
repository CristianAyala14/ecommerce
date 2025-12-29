import { productsDao } from "../database/dao_exports.js";
import cloudinary from "../config/cloudinary.js";

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
    try {
      const newProduct = await productsDao.createProduct(req.body);
      res.status(201).json({
        status: "success",
        message: "Product created.",
        payload: newProduct
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message
      });
    }
  };

  static updateProduct = async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(400).json({
          status: "error",
          message: "Product ID is required",
        });
      }

      const updatedProduct = await productsDao.updateProduct(
        req.params.id,
        req.body
      );
      res.status(200).json({
        status: "success",
        message: "Products updated correctly.",
        payload: updatedProduct
      });
    } catch (error) {
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

      // 2️⃣ Eliminar imágenes en Cloudinary
      if (Array.isArray(product.images)) {
        await Promise.all(
          product.images.map((img) => {
            if (img.public_id) {
              return cloudinary.uploader.destroy(img.public_id);
            }
          })
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
