import mongoose from "mongoose";
import productsModel from "../models/productsModel.js";
import categoriesModel from "../models/categoriesModel.js";

class productsService {

  // ============================
  // CREATE
  // ============================
  createProduct = async (newProduct) => {
    try {
      return await productsModel.create(newProduct);
    } catch (error) {
      throw new Error(error.message || "Error creating product");
    }
  };

  // ============================
  // READ
  // ============================
  // ⚠️ Acá el producto DEBE existir
  getProductById = async (id) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid product ID");
      }

      const product = await productsModel
        .findById(id)
        .populate("category");

      if (!product) {
        throw new Error("Product not found");
      }

      return product;
    } catch (error) {
      throw new Error(error.message || "Error fetching product by ID");
    }
  };

  // ============================
  // UPDATE
  // ============================
  updateProduct = async (id, updateData) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid product ID");
      }

      const updated = await productsModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .populate("category");

      if (!updated) {
        throw new Error("Product not found for update");
      }

      return updated;
    } catch (error) {
      throw new Error(error.message || "Error updating product");
    }
  };

  // ============================
  // DELETE
  // ============================
  deleteProduct = async (id) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid product ID");
      }

      const deleted = await productsModel.findByIdAndDelete(id);
      if (!deleted) {
        throw new Error("Product not found for deletion");
      }

      return deleted;
    } catch (error) {
      throw new Error(error.message || "Error deleting product");
    }
  };

  // ============================
  // LIST / FILTER / PAGINATE
  // ============================
  getAllProducts = async (query = {}) => {
    try {
      const {
        page = 1,
        limit = 10,
        sort = "createdAt",
        order = "desc",
        category,
        searchTerm,
        new_insert,
        offer
      } = query;

      const filter = {};

      /* =========================
        CATEGORY (por nombre)
      ========================== */
      if (category && category.toLowerCase() !== "all") {
        const catDoc = await categoriesModel
          .findOne({ name: category })
          .lean();

        if (catDoc) {
          filter.category = catDoc._id;
        }
      }

      /* =========================
        SEARCH (title / description)
      ========================== */
      if (searchTerm && searchTerm.trim() !== "") {
        filter.$or = [
          { title: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } }
        ];
      }

      /* =========================
        NEW INSERT FILTER
      ========================== */
      if (new_insert === "true") {
        filter.new_insert = true;
      }

      /* =========================
        OFFER FILTER
      ========================== */
      if (offer === "true") {
        filter.offer = true;
      }

      /* =========================
        SORT
      ========================== */
      const sortOrder = order === "asc" ? 1 : -1;

      const options = {
        page: Number(page),
        limit: Number(limit),
        sort: { [sort]: sortOrder },
        populate: "category",
        lean: true
      };

      return await productsModel.paginate(filter, options);
    } catch (error) {
      throw new Error(error.message || "Error fetching products list");
    }
  };



  // ============================
  // SPECIAL LISTS
  // ============================
  getProductsOnOffer = async (query = {}) => {
    try {
      const { page = 1, limit = 4 } = query;

      return await productsModel.paginate(
        { offer: true },
        {
          page: Number(page),
          limit: Number(limit),
          populate: "category",
          lean: true
        }
      );
    } catch (error) {
      throw new Error(error.message || "Error fetching products on offer");
    }
  };

  getNewProducts = async (query = {}) => {
    try {
      const { page = 1, limit = 8 } = query;

      return await productsModel.paginate(
        { new_insert: true },
        {
          page: Number(page),
          limit: Number(limit),
          sort: { createdAt: -1 },
          populate: "category",
          lean: true
        }
      );
    } catch (error) {
      throw new Error(error.message || "Error fetching new products");
    }
  };
}

export { productsService };
