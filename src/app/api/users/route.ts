import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    if (!users) {
      return NextResponse.json({ error: "No users found" }, { status: 404 });
    }
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
