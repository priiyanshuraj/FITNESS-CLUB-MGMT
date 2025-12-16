import express from "express";
import {
  deleteProfile,
  getProfileDetails,
  updateProfile,
} from "../../controllers/profileController/profileController";
import {
  AuthRequest,
  protect,
  requireSelfOrAdmin,
} from "../../middlewares/auth";

const router = express.Router();

// ✅ Get profile for current logged-in user using JWT (no id in URL)
router.get(
  "/me",
  protect,
  (req: AuthRequest, res, next) => {
    // Reuse existing controller by injecting userId from token
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    // @ts-expect-error - we intentionally set params for controller reuse
    req.params.userId = req.user.id;
    next();
  },
  getProfileDetails
);

// Update or create profile (self or admin)
router.put("/:userId", protect, requireSelfOrAdmin, updateProfile);

// Get profile (user details + profile details) - self or admin
router.get("/:userId", protect, requireSelfOrAdmin, getProfileDetails);

// Delete profile (optional, admin or self)
router.delete("/:id", protect, requireSelfOrAdmin, deleteProfile);

export default router;
