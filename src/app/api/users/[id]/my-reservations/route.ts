import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client"; // ...existing import path...

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Fetch user reservations
    const reservations = await prisma.reservation.findMany({
      where: { userId: parseInt(id, 10) },
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
    
    // Flatten nested parking object into one JSON object and calculate startDate and endDate
    const mappedReservations = reservations.map(reservation => {
      const { parking, ...rest } = reservation;
      
      return {
        ...rest,
        parkingName: parking?.parkingName,
        parkingPhotoUrl: parking?.photoUrl,
        parkingAddress: parking?.address,
        startDate: new Date(reservation.startTime).toISOString().split('T')[0],
        endDate: new Date(reservation.endTime).toISOString().split('T')[0],
      };
    });
    
    console.log("Fetched reservations:", mappedReservations);
    
    return NextResponse.json(mappedReservations);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching reservations:", error.message);
    } else {
      console.error("Error fetching reservations:", error);
    }
    return NextResponse.json({ error }, { status: 500 });
  }
}

// ...existing code...
