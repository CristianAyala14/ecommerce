import mongoose from "mongoose";

const collection = "user";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    /* ===== PROFILE IMAGE (CLOUDINARY) ===== */
    profileImage: {
      type: {
        url: {
          type: String,
        },
        public_id: {
          type: String,
        },
      },
      default: {
        url: "https://muytecnologicos.com/wp-content/uploads/2023/04/Autenticacion-de-usuario.png",
        public_id: null,
      },
    },

    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

const userModel = mongoose.model(collection, userSchema);
export default userModel;
