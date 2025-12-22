import dotenv from "dotenv";
import __dirname from "./___dirname.js";
import path from "path";

// ✅ Cargar .env solo en desarrollo
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.join(__dirname, "../.env.dev") });
}

const envObject = {
  server: {
    port: process.env.PORT
  },
  mongo: {
    url: process.env.MONGO_URL
  },
  accessjwt: {
    key: process.env.ACCESS_TOKEN_KEY
  },
  refreshjwt: {
    key: process.env.REFRESH_TOKEN_KEY
  },
  frontend: {
    public: process.env.FRONTEND_PUBLIC_LINK,
    panel_admin: process.env.FRONTEND_PANEL_ADMIN_LINK
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  }
};

export { envObject };
