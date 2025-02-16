import { verifyToken } from "./jwt";
import prisma from "@/lib/prisma/client"; // ...existing import path...

export const getUserFromToken = async (token: string) => {
  // Verify token using the jwt helper
  const decoded = verifyToken(token);
  if (!decoded) return null;
  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
  return user;
};
