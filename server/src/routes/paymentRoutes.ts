import { Router } from "express";
import { addPayment, getPayments } from "../controllers/paymentController";
import { adminOnly, protect } from "../middlewares/auth";

const router = Router();

// ✅ Payments are restricted to admins only
router.post("/", protect, adminOnly, addPayment);   // add payment
router.get("/", protect, adminOnly, getPayments);   // payment history

export default router;
