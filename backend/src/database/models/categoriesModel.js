import mongoose from "mongoose";
const collection = "categories";
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true // Cada categoría debe ser única
  },
  description: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  banner: {
    type: String,
    required: true,
    validate: {
      validator: (url) =>
        typeof url === "string" && url.startsWith("https://"),
      message: "El banner debe ser una URL HTTPS válida (Firebase)"
    }
  }
});

const categoriesModel = mongoose.model(collection, categorySchema);

export default categoriesModel;
