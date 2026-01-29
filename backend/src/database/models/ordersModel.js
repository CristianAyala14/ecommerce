import mongoose from "mongoose";

const collection = "orders";

const orderSchema = new mongoose.Schema(
  {
    /* ===================== */
    /* ITEMS DEL CARRITO     */
    /* ===================== */
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

    /* ===================== */
    /* ESTADO DE LA ORDEN    */
    /* ===================== */
    status: {
      type: String,
      enum: ["draft", "paid", "processing", "shipped", "canceled"],
      default: "draft",
    },

    /* ===================== */
    /* DATOS DEL COMPRADOR   */
    /* ===================== */
    buyer: {
      name: { type: String },
      lastname: { type: String},
      email: { type: String, lowercase: true },
      phone: { type: String },
    },

    /* ===================== */
    /* ENVÍO                 */
    /* ===================== */
    shipping: {
      type: {
        type: String,
        enum: ["delivery", "pickup"],
        
      },

      cost: {
        type: Number,
        default: 0,
      },

      address: {
        province: String,
        city: String,
        street: String,
        number: String,
      },
    },

    /* ===================== */
    /* PAGO                  */
    /* ===================== */
    payment: {
      method: {
        type: String,
        enum: ["cash", "mercadopago"],
      },

      status: {
        type: String,
        enum: ["pending", "paid", "rejected"],
        default: "pending",
      },

      transactionId: String,
    },


  },
  { timestamps: true }
);

const ordersModel = mongoose.model(collection, orderSchema);

export default ordersModel;
