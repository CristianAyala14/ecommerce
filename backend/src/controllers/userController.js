import bcrypt from "bcryptjs";
import { userDao } from "../database/dao_exports.js";
import { genAccessToken, genRefreshToken } from "../config/tokens.js";

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
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized: user ID missing.",
        });
      }

      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
          status: "error",
          message: "Request body cannot be empty.",
        });
      }
      if (req.body.password) {
        const hash = await bcrypt.hash(req.body.password, 10);
        req.body.password = hash;
      }

      const updated = await userDao.updateUser(req.user.id, req.body);

      // auth token
      const newUserAuthToken = {
        id: updated._id,
        userName: updated.userName,
        email: updated.email
      };
      const accessToken = genAccessToken(newUserAuthToken);
      const refreshToken = genRefreshToken(newUserAuthToken);

      // limpiar cookie anterior y setear nueva
      res.cookie("refreshToken", "", { httpOnly: true, secure: true, sameSite: 'Strict', path: "/api/auth/refresh", expires: new Date(0) });
      res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict', path: "/api/auth/refresh" });

      // payload
      const user = {
        id: updated._id,
        userName: updated.userName,
        email: updated.email,
        profileImage: updated.profileImage
      };

      res.status(200).json({
        status: "success",
        message: "User updated successfully.",
        payload: user,
        accessToken: accessToken
      });

    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }

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
