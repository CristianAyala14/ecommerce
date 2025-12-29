import mongoose from "mongoose";
import ordersModel from "../models/ordersModel.js";

class ordersService {

  // ============================
  // CREATE
  // ============================
  async createOrder(data) {
    try {
      return await ordersModel.create(data);
    } catch (error) {
      throw new Error(error.message || "Error creating order");
    }
  }

  // ============================
  // READ
  // ============================
  // ⚠️ Una orden por ID DEBE existir
  async getOrderById(orderId, { populateProducts = false } = {}) {
    try {
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new Error("Invalid order ID");
      }

      let query = ordersModel.findById(orderId);

      if (populateProducts) {
        query = query.populate("items.productId");
      }

      const order = await query;

      if (!order) {
        throw new Error("Order not found");
      }

      return order;
    } catch (error) {
      throw new Error(error.message || "Error retrieving order");
    }
  }

  // ============================
  // SAVE (update interno)
  // ============================
  async save(order) {
    try {
      return await order.save();
    } catch (error) {
      throw new Error(error.message || "Error saving order");
    }
  }

  async deleteOrder(orderId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new Error("Invalid order ID");
      }

      const deletedOrder = await ordersModel.findByIdAndDelete(orderId);

      if (!deletedOrder) {
        throw new Error("Order not found");
      }

      return deletedOrder;
    } catch (error) {
      throw new Error(error.message || "Error deleting order");
    }
  }



}

export { ordersService };
