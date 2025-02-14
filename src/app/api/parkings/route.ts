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
    console.error("Error fetching parkings:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
