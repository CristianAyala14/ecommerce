import { categoriesDao } from "../database/dao_exports.js";

class categoriesController {

  static createCategory = async (req, res) => {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).send({
          status: "error",
          message: "Request body cannot be empty",
        });
      }

      const category = await categoriesDao.createCategory(req.body);
      res.status(200).send({ status: "success", payload: category });

    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  }

  static getAllCategories = async (req, res) => {
    try {
      const categories = await categoriesDao.getAllCategories();
      res.status(200).send({ status: "success", payload: categories });
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  }

  static getCategoryById = async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).send({
          status: "error",
          message: "Category ID is required",
        });
      }

      const category = await categoriesDao.getCategoryById(id);
      if (!category) return res.status(404).send({ status: "error", message: "Category not found" });

      res.status(200).send({ status: "success", payload: category });

    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  }

  static updateCategory = async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).send({
          status: "error",
          message: "Category ID is required",
        });
      }

      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).send({
          status: "error",
          message: "Request body cannot be empty",
        });
      }

      const updatedCategory = await categoriesDao.updateCategory(id, req.body);
      if (!updatedCategory) return res.status(404).send({ status: "error", message: "Category not found for update" });

      res.status(200).send({ status: "success", payload: updatedCategory });

    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  }

  static deleteCategory = async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).send({
          status: "error",
          message: "Category ID is required",
        });
      }

      await categoriesDao.deleteCategory(id);
      res.status(200).send({ status: "success", message: "Category deleted" });

    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  }
}

export { categoriesController };
