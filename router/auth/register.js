import express from "express";
import bcrypt from "bcryptjs";
import { transport, mailOptions } from "../../mail.util.js";
import { Usermodel } from "../../db.utils/model.js";

const RegisterRouter = express.Router();

RegisterRouter.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate email and password (add more validation as needed)
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    // Check if user with the provided email already exists
    const existingUser = await Usermodel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ msg: "User already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new Usermodel({
      ...req.body,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    // Send welcome email
    await transport.sendMail({
      ...mailOptions,
      to: email, // Override `to` field in `mailOptions` with the user's email address retrieved from `req.body`
      subject: "Welcome to Your Application",
      text: "Thank you for registering!",
    });

    res.status(201).json({ msg: "User registered successfully" });

  } catch (err) {
    console.error("Registration error1:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default RegisterRouter;
