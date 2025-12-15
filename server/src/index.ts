import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import blogRoutes from "./routes/blogRoutes/blogRoute";
import chatRoutes from "./routes/chatRoutes/chatRoute";
import productRoutes from "./routes/shoppingRoutes/productRoutes";
import cartRoutes from "./routes/shoppingRoutes/cartRoutes";
import orderRoutes from "./routes/shoppingRoutes/orderRoutes";
import profileRoutes from "./routes/profileRoutes/profileRoutes";
import contactRoutes from "./routes/contactRoutes/contactRoute";
import cors from "cors";
import morgan from "morgan";
import Message from "./models/chatModel/chat";
import paymentRoutes from "./routes/paymentRoutes";




dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = createServer(app);
console.log(`Starting server on port ${PORT}`);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Store connected users
const users: { [key: string]: string } = {};

io.on("connection", (socket: Socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join", (userId: string) => {
    users[userId] = socket.id;
    console.log(`${userId} joined with socket ID: ${socket.id}`);
  });

  socket.on("sendMessage", async ({ sender, receiver, content }) => {
    try {
      const newMessage = new Message({ sender, receiver, content });
      await newMessage.save();

      const receiverSocketId = users[receiver];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", newMessage);
      }
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    const userId = Object.keys(users).find((key) => users[key] === socket.id);
    if (userId) {
      delete users[userId];
    }
  });
});

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/shoppingRoutes", productRoutes);
app.use("/api/shoppingRoutes/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});

// Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err.message || err);
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message || err });
});

// Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
