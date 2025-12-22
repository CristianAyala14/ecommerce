import mongoose from "mongoose";
import categoriesModel from "../models/categoriesModel.js";

class categoriesService {

  // ============================
  // CREATE
  // ============================
  async createCategory(newCategory) {
    try {
      return await categoriesModel.create(newCategory);
    } catch (error) {
      throw new Error(error.message || "Error creating category");
    }
  }

  // ============================
  // READ
  // ============================
  async getAllCategories() {
    try {
      return await categoriesModel.find();
    } catch (error) {
      throw new Error(error.message || "Error fetching categories");
    }
  }

  async getCategoryById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid category ID");
      }

      const category = await categoriesModel.findById(id);
      if (!category) {
        throw new Error("Category not found");
      }

      return category;
    } catch (error) {
      throw new Error(error.message || "Error fetching category by ID");
    }
  }

  // ============================
  // UPDATE
  // ============================
  async updateCategory(id, updateData) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid category ID");
      }

      const updated = await categoriesModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      if (!updated) {
        throw new Error("Category not found for update");
      }

      return updated;
    } catch (error) {
      throw new Error(error.message || "Error updating category");
    }
  }

  // ============================
  // DELETE
  // ============================
  async deleteCategory(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid category ID");
      }

      const deleted = await categoriesModel.findByIdAndDelete(id);
      if (!deleted) {
        throw new Error("Category not found for deletion");
      }

      return deleted;
    } catch (error) {
      throw new Error(error.message || "Error deleting category");
    }
  }
}

export { categoriesService };
