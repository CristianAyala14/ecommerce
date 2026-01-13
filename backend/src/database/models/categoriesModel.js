// models/Category.js
import mongoose from "mongoose";

const collection = "categories";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  description: {
    type: String,
    default: "",
    trim: true
  },

  /* ===== BANNER (CLOUDINARY) ===== */
  banner: {
    type: {
      url: {
        type: String,
        required: true
      },
      public_id: {
        type: String,
        required: true
      }
    },
    required: true,
    validate: {
      validator: function (img) {
        return (
          img &&
          typeof img.url === "string" &&
          img.url.startsWith("https://") &&
          typeof img.public_id === "string"
        );
      },
      message: "El banner debe contener una url HTTPS válida y un public_id"
    }
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const categoriesModel = mongoose.model(collection, categorySchema);

export default categoriesModel;
