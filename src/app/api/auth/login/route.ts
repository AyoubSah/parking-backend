import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { comparePassword } from "@/lib/auth/hashing";
import { generateToken } from "@/lib/auth/jwt";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  let email: string | null = null;
  let password: string | null = null;

  if (contentType.includes("application/json")) {
    try {
      const body = (await request.json()) || {};
      email = body.email;
      password = body.password;
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 }
      );
    }
  } else {
    const bodyText = await request.text();
    const params = new URLSearchParams(bodyText);
    email = params.get("email");
    password = params.get("password");
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = generateToken(user.id);
  return NextResponse.json({ token });
}
