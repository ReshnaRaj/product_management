import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { hashPassword,comparePassword } from "../utils/hashPassword.js";
import { generateToken } from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("Signup Request:", req.body);

    // Check if user exists
    const existingUser = await User.findOne({ email });
    console.log("Existing User:", existingUser);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
     const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Create token
   
    const token = generateToken({
  userId: newUser._id,
  email: newUser.email,
})

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
      token,
    });
  } catch (err) {
    console.error("Signup Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login Request:", req.body);

    // Check if user exists
    const user = await User.findOne({ email });
    console.log("User Found:", user);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
 const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
}
