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
  

  images: {
    type: [String],
    required: true,
    validate: [
      {
        validator: function (arr) {
          return (
            Array.isArray(arr) &&
            arr.length >= 1 &&
            arr.length <= 3 &&
            arr.every((url) =>
              typeof url === "string" &&
              url.startsWith("https://")
            )
          );
        },
        message:
          "Las imágenes deben ser URLs HTTPS válidas (Firebase) y entre 1 y 4"
      }
    ]
  },

  banner: {
    type: String,
    required: true,
    validate: {
      validator: (url) =>
        typeof url === "string" && url.startsWith("https://"),
      message: "El banner debe ser una URL HTTPS válida (Firebase)"
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
  },

});

productSchema.plugin(mongoosePaginate);

const productsModel = mongoose.model(collection, productSchema);

export default productsModel;
