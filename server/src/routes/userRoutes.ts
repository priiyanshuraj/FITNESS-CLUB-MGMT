import { Router } from "express";
import { loginUser, signupUser } from "../controllers/userController";
import User from "../models/User";

const router = Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);


router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "name email");
    res.status(200).json({ data: users });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});


export default router;
