import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { hashPassword } from "@/lib/auth/hashing";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  let email: string | null = null;
  let password: string | null = null;
  let fullName: string | null = null;
  console.log("content type: ", contentType);
  if (contentType.includes("application/json")) {
    try {
      console.log("json");
      const body = (await request.json()) || {};
      email = body.email;
      password = body.password;
      fullName = body.fullName;
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 }
      );
    }
  } else {
    console.log("form");
    const bodyText = await request.text();
    const params = new URLSearchParams(bodyText);
    email = params.get("email");
    password = params.get("password");
    fullName = params.get("fullName");
  }

  console.log("email: ", email);
  if (!email || !password || !fullName) {
    return NextResponse.json(
      { error: "Email, fullName and password are required" },
      { status: 400 }
    );
  }
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, fullName },
  });

  return NextResponse.json({ id: user.id, email: user.email });
}
