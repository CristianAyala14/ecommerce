import mongoose from "mongoose";
const collection = "orders";

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],

    status: {
      type: String,
      enum: ["draft", "paid", "processing", "shipped", "canceled"],
      default: "draft",
    },

    customer: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
      },
      phone: {
        type: String,
      },
    },


    
  },
  { timestamps: true }
);
const ordersModel = mongoose.model(collection, orderSchema);


export default ordersModel
