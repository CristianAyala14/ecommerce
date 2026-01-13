// config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import { envObject } from "./enviroment.js";

cloudinary.config({
  cloud_name: envObject.cloudinary.cloud_name,
  api_key: envObject.cloudinary.api_key,
  api_secret: envObject.cloudinary.api_secret,
});

export default cloudinary;
