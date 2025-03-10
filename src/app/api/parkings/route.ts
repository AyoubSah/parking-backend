import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";

export async function GET() {
  try {
    const parkings = await prisma.parking.findMany();
    if (!parkings) {
      return NextResponse.json({ error: "No parkings found" }, { status: 404 });
    }
    const now = new Date();
    const parkingsWithFreePlaces = await Promise.all(
      parkings.map(async (parking) => {
        const activeReservations = await prisma.reservation.count({
          where: {
            parkingId: parking.id,
            startTime: { lte: now },
            endTime: { gte: now },
          },
        });
        return {
          ...parking,
          freePlaces: parking.totalPlaces - activeReservations,
        };
      })
    );
    return NextResponse.json(parkingsWithFreePlaces);
  } catch (error) {
    return NextResponse.json(
      { error: (error as any).message },
      { status: 500 }
    );
  }
}
