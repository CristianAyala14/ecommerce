import { userDao } from "../database/dao_exports.js";
import bcrypt from "bcryptjs";
import { genAccessToken, genRefreshToken } from "../config/tokens.js";


class authController {

  static signUp = async (req, res) => {
    try {
      const {email, password } = req.body;

      // ✅ Verificar que lleguen todos los datos
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
      }

      const founded = await userDao.getUserByEmail(email);
      if (founded) {
        return res.status(400).json({ message: "The user is already registered." });
      }

      const hash = await bcrypt.hash(password, 10);

      const newUser = { 
        email, password: hash, 
        userName: email.split("@")[0]
      };
      const created = await userDao.createUser(newUser);

      // auth token
      const userAuthToken = { 
        id: created._id,
        userName: created.userName,
        email: created.email
      };
      const accessToken = genAccessToken(userAuthToken);
      const refreshToken = genRefreshToken(userAuthToken);

      res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: 'Lax', path: "/api/auth/refresh" });

      // payload
      const user = { id: created._id, email: created.email, profileImage: created.profileImage, userName: created.userName };

      res.status(200).json({
        status: "success",
        message: "User registered successfully.",
        payload: user,
        accessToken
      });

    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static signIn = async (req, res) => {
    
    try {
      const { email, password } = req.body;

      // ✅ Verificar que lleguen email y password
      if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
      }

      const validUser = await userDao.getUserByEmail(email);
      if (!validUser) return res.status(400).json({ message: "Invalid email." });

      const validPassword = await bcrypt.compare(password, validUser.password);
      if (!validPassword) return res.status(400).json({ message: "Invalid password." });

      // auth token
      const userAuthToken = { id: validUser._id, userName: validUser.userName, email: validUser.email };
      const accessToken = genAccessToken(userAuthToken);
      const refreshToken = genRefreshToken(userAuthToken);
      res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict', path: "/api/auth/refresh" });


      // payload
      const user = { id: validUser._id, userName: validUser.userName, email: validUser.email, profileImage: validUser.profileImage };

      res.status(200).json({
        status: "success",
        message: "Logged in successfully.",
        payload: user,
        accessToken
      });

    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static logout = (req, res) => {
    res.cookie("refreshToken", "", { httpOnly: true, secure: true, sameSite: 'Strict', path: "/api/auth/refresh", expires: new Date(0) });
    res.status(200).json({
      status: "success",
      message: "Logged out successfully."
    });
  }

  static refreshToken = async (req, res) => {
    try {
      // ✅ Verificar que req.user exista
      if (!req.user || !req.user.email) {
        return res.status(401).json({ message: "Access denied. User info missing." });
      }

      const email = req.user.email;
      const userFounded = await userDao.getUserByEmail(email);
      if (!userFounded) return res.status(401).json({ message: "Could not refresh the access token. Access denied." });

      const user = { id: userFounded._id, userName: userFounded.userName, email: userFounded.email };
      const newAccessToken = genAccessToken(user);

      res.status(200).json({
        status: "success",
        message: "New access token generated.",
        payload: user,
        accessToken: newAccessToken
      });

    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export { authController };
