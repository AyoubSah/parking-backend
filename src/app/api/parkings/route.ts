import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";

export async function GET() {
  try {
    const parkings = await prisma.parking.findMany();
    if (!parkings) {
      return NextResponse.json({ error: "No parkings found" }, { status: 404 });
    }
    return NextResponse.json(parkings);
  } catch (error) {
    return NextResponse.json(
      { error: (error as any).message },
      { status: 500 }
    );
  }
}
