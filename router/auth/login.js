import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Usermodel } from "../../db.utils/model.js";
import util from "util";

const LoginRouter = express.Router();
const compareAsync = util.promisify(bcrypt.compare);

LoginRouter.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user with the provided email exists
    const user = await Usermodel.findOne({ email });

    if (!user) {
      return res.status(401).json({ msg: "Invalid credentials", code: 1 });
    }

    // Compare passwords using async/await
    const passwordMatch = await compareAsync(password, user.password);

    if (passwordMatch) {
      // Passwords match, generate JWT token
      const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET);

      // Return token and success message along with user ID
      return res.status(200).json({ msg: "Login successful", code: 0, token, userId: user._id });
    } else {
      // Passwords do not match
      return res.status(401).json({ msg: "Invalid credentials", code: 1 });
    }

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ msg: "Server error", code: 3 });
  }
});

// Middleware to set Cache-Control header
LoginRouter.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

export default LoginRouter;
