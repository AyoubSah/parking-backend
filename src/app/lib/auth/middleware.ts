// src/lib/auth/middleware.ts
import { NextResponse } from "next/server";
import { verifyToken } from "./jwt";

export const authMiddleware = (handler: Function) => {
  return async (req: Request) => {
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Attach user ID to the request object
    (req as any).userId = decoded.userId;

    return handler(req);
  };
};
