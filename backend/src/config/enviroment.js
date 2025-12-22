import dotenv from "dotenv";
import __dirname from "./___dirname.js";
import path from "path";

// dotenv config
dotenv.config({ path: path.join(__dirname, "../.env.dev") });

// environment variables
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
const ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY;
const REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_KEY;
const FRONTEND_LINK = process.env.FRONTEND_LINK;

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

const envObject = {
  server: {
    port: PORT
  },
  mongo: {
    url: MONGO_URL
  },
  accessjwt: {
    key: ACCESS_TOKEN_KEY
  },
  refreshjwt: {
    key: REFRESH_TOKEN_KEY
  },
  frontend: {
    link: FRONTEND_LINK
  },
  cloudinary: {
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
  }
};

export { envObject };
