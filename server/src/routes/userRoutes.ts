import { Router } from "express";
import {
  loginUser,
  signupUser,
  updateProfile,
  updatePassword,
} from "../controllers/userController";
import User from "../models/User";
import { adminOnly, protect, requireSelfOrAdmin, AuthRequest } from "../middlewares/auth";

const router = Router();

// Public auth routes
router.post("/signup", signupUser);
router.post("/login", loginUser);

// ✅ Update basic user fields (self or admin)
router.put("/:id", protect, requireSelfOrAdmin, updateProfile);

// ✅ Update password with hashing (self or admin)
router.patch("/:id/password", protect, requireSelfOrAdmin, updatePassword);

// ✅ Admin-only: list all users (used for Payments member selection)
router.get("/", protect, adminOnly, async (req: AuthRequest, res) => {
  try {
    const users = await User.find({}, "name email");
    res.status(200).json({ data: users });
  } catch {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

export default router;

