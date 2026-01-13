import { categoriesDao } from "../database/dao_exports.js";
import CloudinaryService from "../config/CloudinaryService.js";

class categoriesController {

  // =========================
  // CREATE CATEGORY
  // =========================
  static createCategory = async (req, res) => {
    let uploadedBanner = null;

    try {
      // 🔹 Validaciones
      if (!req.body?.name) {
        return res.status(400).send({
          status: "error",
          message: "Category name is required",
        });
      }

      if (!req.file) {
        return res.status(400).send({
          status: "error",
          message: "Category banner is required",
        });
      }

      // 🔹 Subir banner
      uploadedBanner = await CloudinaryService.uploadImage(
        req.file.buffer,
        "category_banners"
      );

      // 🔹 Crear categoría
      const category = await categoriesDao.createCategory({
        name: req.body.name,
        description: req.body.description || "",
        banner: uploadedBanner,
      });

      res.status(201).send({
        status: "success",
        payload: category,
      });

    } catch (error) {
      // 🔥 Rollback
      if (uploadedBanner?.public_id) {
        try {
          await CloudinaryService.deleteImage(uploadedBanner.public_id);
        } catch (err) {
          console.error("Cloudinary rollback failed:", err.message);
        }
      }

      console.error(error.message);
      
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  };

  // =========================
  // GET ALL
  // =========================
  static getAllCategories = async (req, res) => {
    try {
      const categories = await categoriesDao.getAllCategories();
      res.status(200).send({ status: "success", payload: categories });
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  };

  // =========================
  // GET BY ID
  // =========================
  static getCategoryById = async (req, res) => {
    try {
      const { id } = req.params;

      const category = await categoriesDao.getCategoryById(id);
      if (!category) {
        return res.status(404).send({
          status: "error",
          message: "Category not found",
        });
      }

      res.status(200).send({ status: "success", payload: category });

    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  };

  // =========================
  // UPDATE CATEGORY
  // (opcionalmente banner)
  // =========================
  static updateCategory = async (req, res) => {
    let newBanner = null;

    try {
      const { id } = req.params;

      const category = await categoriesDao.getCategoryById(id);
      if (!category) {
        return res.status(404).send({
          status: "error",
          message: "Category not found",
        });
      }

      // 🔹 Si viene nuevo banner
      if (req.file) {
        newBanner = await CloudinaryService.uploadImage(
          req.file.buffer,
          "category_banners"
        );
      }

      const updatedCategory = await categoriesDao.updateCategory(id, {
        name: req.body.name ?? category.name,
        description: req.body.description ?? category.description,
        banner: newBanner ?? category.banner,
      });

      // 🔥 Borrar banner viejo
      if (newBanner && category.banner?.public_id) {
        await CloudinaryService.deleteImage(category.banner.public_id);
      }

      res.status(200).send({
        status: "success",
        payload: updatedCategory,
      });

    } catch (error) {
      if (newBanner?.public_id) {
        await CloudinaryService.deleteImage(newBanner.public_id);
      }

      res.status(500).send({
        status: "error",
        message: error.message,
      });
    }
  };

  // =========================
  // DELETE CATEGORY
  // =========================
  static deleteCategory = async (req, res) => {
    try {
      const { id } = req.params;

      const category = await categoriesDao.getCategoryById(id);
      if (!category) {
        return res.status(404).send({
          status: "error",
          message: "Category not found",
        });
      }

      // 🔹 Borrar banner
      if (category.banner?.public_id) {
        await CloudinaryService.deleteImage(category.banner.public_id);
      }

      await categoriesDao.deleteCategory(id);

      res.status(200).send({
        status: "success",
        message: "Category deleted",
      });

    } catch (error) {
      res.status(500).send({
        status: "error",
        message: error.message,
      });
    }
  };
}

export { categoriesController };
