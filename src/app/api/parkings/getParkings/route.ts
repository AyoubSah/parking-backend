import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";

export async function GET() {
    const parkings = await prisma.parking.findMany();
    return NextResponse.json(parkings);
  }