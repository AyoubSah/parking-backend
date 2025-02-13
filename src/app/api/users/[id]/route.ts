import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(params.id) },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json(user);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { email, password } = await request.json();
  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.update({
    where: { id: parseInt(params.id) },
    data: { email, password: hashedPassword },
  });
  return NextResponse.json(user);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.user.delete({ where: { id: parseInt(params.id) } });
  return NextResponse.json({ message: "User deleted" });
}
