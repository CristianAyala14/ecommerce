// models/Product.js
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "products";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categories",
    required: true
  },

  quantity: {
    type: Number,
    required: true,
    min: [1, "La cantidad debe ser al menos 1"],
    default: 1
  },

  /* ===== IMAGES (MODIFICADO, SIMPLE) ===== */
  images: {
    type: [
      {
        url: {
          type: String,
          required: true
        },
        public_id: {
          type: String,
          required: true
        }
      }
    ],
    required: true,
    validate: {
      validator: function (arr) {
        return (
          Array.isArray(arr) &&
          arr.length >= 1 &&
          arr.length <= 4 &&
          arr.every(
            (img) =>
              typeof img.url === "string" &&
              img.url.startsWith("https://") &&
              typeof img.public_id === "string"
          )
        );
      },
      message: "Debe haber entre 1 y 4 imágenes válidas"
    }
  },

  regularPrice: {
    type: Number,
    required: true,
    min: [0, "El precio no puede ser negativo"]
  },

  old_price: {
    type: Number,
    min: [0, "El precio anterior no puede ser negativo"]
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  description: {
    type: String,
    required: true,
    trim: true
  },

  offer: {
    type: Boolean,
    default: false
  },

  new_insert: {
    type: Boolean,
    default: false
  }
});

productSchema.plugin(mongoosePaginate);

const productsModel = mongoose.model(collection, productSchema);

export default productsModel;
