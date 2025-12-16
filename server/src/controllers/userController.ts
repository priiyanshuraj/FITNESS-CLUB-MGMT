import { RequestHandler, Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import jwt from "jsonwebtoken";

// ✅ Utility to check if an email should be treated as admin
const isAdminEmail = (email: string): boolean => {
  const adminEmails = ["admin@gmail.com", "admin@fitness.com"];
  return adminEmails.includes(email.toLowerCase());
};

export const signupUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // ✅ Always hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const role: "admin" | "user" = isAdminEmail(email) ? "admin" : "user";

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role, // default "user", or "admin" for configured admin emails
    });

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    res.status(500).json({ message: "Signup failed" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password required" });
      return;
    }

    let user = await User.findOne({ email });
    if (!user || !user.password) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // ✅ Ensure admin emails always have admin role
    if (isAdminEmail(email) && user.role !== "admin") {
      user.role = "admin";
      await user.save();
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res
        .status(500)
        .json({ message: "Server configuration error (JWT_SECRET missing)" });
      return;
    }

    // ✅ CREATE TOKEN with id + role
    const token = jwt.sign(
      {
        id: user._id, // used as userId on frontend
        role: user.role, // "admin" / "user"
      },
      secret,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    res.status(500).json({ message: "Login failed" });
  }
};





export const updateProfile: RequestHandler = async (
  req,
  res
): Promise<void> => {
  try {
    const { id } = req.params;

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      message: "Profile updated",
      user: updatedUser,
    });
  } catch {
    res.status(500).json({ message: "Profile update failed" });
  }
};

// ✅ Secure password update – hashes new password before saving
export const updatePassword: RequestHandler = async (
  req,
  res
): Promise<void> => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
      res.status(400).json({ message: "New password is required" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "Password updated successfully" });
  } catch {
    res.status(500).json({ message: "Password update failed" });
  }
};
