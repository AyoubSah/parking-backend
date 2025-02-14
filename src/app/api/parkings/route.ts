import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";

export async function GET() {
  const parkings = await prisma.parking.findMany();
  return NextResponse.json(parkings);
}

export async function POST(request: Request) {
  const data = await request.json();
  const parking = await prisma.parking.create({ data });
  return NextResponse.json(parking);
}
