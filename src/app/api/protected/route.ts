// src/app/api/protected/route.ts
import { authMiddleware } from "@/lib/auth/middleware";
import { NextResponse } from "next/server";

const handler = async (req: Request) => {
  const userId = (req as any).userId;
  return NextResponse.json(
    { message: "Authenticated", userId },
    { status: 200 }
  );
};

export const POST = authMiddleware(handler);
