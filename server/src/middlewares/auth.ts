import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

// Local type used only in auth middleware & guarded routes
interface JwtPayload {
  id: string;
  role: "admin" | "user";
}

export interface AuthUser {
  id: string;
  role: "admin" | "user";
  email: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

// ✅ Verify JWT and attach user info to request
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is not defined");
      return res
        .status(500)
        .json({ message: "Server configuration error (JWT_SECRET missing)" });
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;

    const user = await User.findById(decoded.id).select("email role");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = {
      id: user._id.toString(),
      role: user.role as "admin" | "user",
      email: user.email || "",
    };

    next();
  } catch {
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

// ✅ Restrict route to admins only
export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({ message: "Admin access only" });
};

// ✅ Ensure the current user matches the requested user OR is admin
export const requireSelfOrAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const currentUser = req.user;
  const targetUserId = req.params.id || req.params.userId;

  if (!currentUser) {
    return res.status(401).json({ message: "Not authorized" });
  }

  if (currentUser.role === "admin" || currentUser.id === targetUserId) {
    return next();
  }

  return res.status(403).json({ message: "Forbidden" });
};


