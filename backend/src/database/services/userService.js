import mongoose from "mongoose";
import userModel from "../models/userModel.js";

class userService {

  // 🔹 USADO PARA SIGN UP / SIGN IN
  // Devuelve el usuario o null
  getUserByEmail = async (email) => {
    try {
      return await userModel.findOne({ email });
    } catch (error) {
      throw new Error(error.message || "Error fetching user by email");
    }
  };

  // 🔹 USADO CUANDO EL USER DEBE EXISTIR
  getUserById = async (id) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid user ID");
      }

      const founded = await userModel.findById(id);
      if (!founded) {
        throw new Error("User not found");
      }

      return founded;
    } catch (error) {
      throw new Error(error.message || "Error fetching user by ID");
    }
  };

  createUser = async (user) => {
    try {
      const created = await userModel.create(user);
      return created;
    } catch (error) {
      throw new Error(error.message || "Error creating user");
    }
  };

  updateUser = async (id, updateUser) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid user ID");
      }

      const updated = await userModel.findByIdAndUpdate(
        id, updateUser,
        { new: true }
      );

      if (!updated) {
        throw new Error("User not found");
      }

      return updated;
    } catch (error) {
      throw new Error(error.message || "Error updating user");
    }
  };

  deleteUser = async (id) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid user ID");
      }

      const deleted = await userModel.findByIdAndDelete(id);
      if (!deleted) {
        throw new Error("User not found for deletion");
      }

      return deleted;
    } catch (error) {
      throw new Error(error.message || "Error deleting user");
    }
  };

  getAllUsers = async () => {
    try {
      return await userModel.find();
    } catch (error) {
      throw new Error(error.message || "Error fetching users list");
    }
  };
}

export { userService };
