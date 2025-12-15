import { Router } from "express";
import { addPayment, getPayments } from "../controllers/paymentController";

const router = Router();

router.post("/", addPayment);   // add payment
router.get("/", getPayments);   // payment history

export default router;
