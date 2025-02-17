import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client"; // ...existing import path...

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Fetch user reservations
    const reservations = await prisma.reservation.findMany({
      where: { userId: parseInt(params.id, 10) },
      include: {
        parking: {
          select: {
            parkingName: true,
            photoUrl: true,
            address: true,
          },
        },
      },
    });

    return NextResponse.json(reservations);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching reservations:", error.message);
    } else {
      console.error("Error fetching reservations:", error);
    }
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

// ...existing code...
