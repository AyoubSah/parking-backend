import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";

// GET reservation by id including parking details
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: params.id },
      include: {
        parking: {
          select: {
            parkingName: true,
            parkingPhotoUrl: true,
            parkingAddress: true,
          },
        },
      },
    });
    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(reservation);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
