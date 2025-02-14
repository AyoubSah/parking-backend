import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const parking = await prisma.parking.findUnique({
    where: { id: parseInt(params.id) },
  });
  return NextResponse.json(parking);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const data = await request.json();
  const parking = await prisma.parking.update({
    where: { id: parseInt(params.id) },
    data,
  });
  return NextResponse.json(parking);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.parking.delete({ where: { id: parseInt(params.id) } });
  return NextResponse.json({ message: "Parking deleted" });
}
