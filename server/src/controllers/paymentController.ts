import { RequestHandler } from "express";
import Payment from "../models/Payment";


export const addPayment: RequestHandler = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount) {
      res.status(400).json({ message: "Missing fields" });
      return;
    }

    const payment = await Payment.create({ userId, amount });

    res.status(201).json({
      message: "Payment added",
      payment,
    });
  } catch (error) {
    res.status(500).json({ message: "Payment failed" });
  }
};



export const getPayments: RequestHandler = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ data: payments });
  } catch (error) {
    res.status(500).json({ message: "Failed to load payments" });
  }
};

