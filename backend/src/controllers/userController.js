import bcrypt from "bcryptjs";
import { userDao } from "../database/dao_exports.js";
import { genAccessToken, genRefreshToken } from "../config/tokens.js";
import CloudinaryService from "../config/CloudinaryService.js";

class userController {

  static getUserById = async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({
          status: "error",
          message: "User ID is required in the request.",
          payload: null,
        });
      }

      const user = await userDao.getUserById(id);
      res.status(200).json({
        status: "success",
        message: "User has been delivered.",
        payload: user
      });

    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  static updateUser = async (req, res) => {
    let uploadedImage = null; // para rollback

    try {
      /* ================= AUTH ================= */
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized: user ID missing.",
        });
      }

      const validUser = await userDao.getUserById(req.user.id);
      if (!validUser) {
        return res.status(400).json({
          status: "error",
          message: "User not found.",
        });
      }

      /* ================= IMAGE UPLOAD ================= */
      if (req.file) {
        uploadedImage = await CloudinaryService.uploadImage(
          req.file.buffer,
          "profile_images"
        );
      }

      const {
        email,
        userName,
        currentPassword,
        newPassword,
      } = req.body;

      const updatedData = {};

      /* ================= PASSWORD ================= */
      if (newPassword) {
        if (!currentPassword) {
          if (uploadedImage)
            await CloudinaryService.deleteImage(uploadedImage.public_id);

          return res.status(400).json({
            status: "error",
            message: "Current password is required.",
          });
        }

        const isValidPassword = await bcrypt.compare(
          currentPassword,
          validUser.password
        );

        if (!isValidPassword) {
          if (uploadedImage)
            await CloudinaryService.deleteImage(uploadedImage.public_id);

          return res.status(401).json({
            status: "error",
            message: "La contraseña actual es incorrecta.",
          });
        }

        updatedData.password = await bcrypt.hash(newPassword, 10);
      }

      /* ================= OTHER FIELDS ================= */
      updatedData.email = email || validUser.email;
      updatedData.userName = userName || validUser.userName;

      /* ================= PROFILE IMAGE ================= */
      if (uploadedImage) {
        updatedData.profileImage = {
          url: uploadedImage.url,
          public_id: uploadedImage.public_id,
        };
      } else {
        updatedData.profileImage = validUser.profileImage;
      }

      /* ================= UPDATE USER ================= */
      const updated = await userDao.updateUser(req.user.id, updatedData);

      /* ================= DELETE OLD IMAGE ================= */
      if (
        uploadedImage &&
        validUser.profileImage &&
        validUser.profileImage.public_id
      ) {
        await CloudinaryService.deleteImage(
          validUser.profileImage.public_id
        );
      }

      /* ================= TOKENS ================= */
      const newUserAuthToken = {
        id: updated._id,
        userName: updated.userName,
        email: updated.email,
      };

      const accessToken = genAccessToken(newUserAuthToken);
      const refreshToken = genRefreshToken(newUserAuthToken);

      res.cookie("refreshToken", "", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        path: "/api/auth/refresh",
        expires: new Date(0),
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        path: "/api/auth/refresh",
      });

      /* ================= RESPONSE ================= */
      res.status(200).json({
        status: "success",
        message: "User updated successfully.",
        payload: {
          id: updated._id,
          userName: updated.userName,
          email: updated.email,
          profileImage: updated.profileImage.url, // { url, public_id }
        },
        accessToken,
      });

    } catch (error) {
      /* ================= ROLLBACK ================= */
      if (uploadedImage) {
        await CloudinaryService.deleteImage(uploadedImage.public_id);
      }

      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  };





  static deleteUser = async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized: user ID missing.",
        });
      }

      await userDao.delete(req.user.id);

      // limpiar cookie de refresh token
      res.cookie("refreshToken", "", { httpOnly: true, secure: true, sameSite: 'Strict', path: "/api/auth/refresh", expires: new Date(0) });

      res.status(200).json({
        status: "success",
        message: "User has been deleted.",
      });

    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }

}

export { userController };
