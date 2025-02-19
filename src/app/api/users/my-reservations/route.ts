import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { getUserFromToken } from "@/lib/auth"; 

export async function POST(request: Request) {
  try {
    // Extract token from request body instead of searchParams
    const { token } = await request.json();
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const user = await getUserFromToken(token);
    if (!user)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    
    const reservations = await prisma.reservation.findMany({
      where: { userId: user.id },
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
    
    const mappedReservations = reservations.map(reservation => {
      const { parking, ...rest } = reservation;
      return {
        ...rest,
        parkingName: parking?.parkingName,
        parkingPhotoUrl: parking?.photoUrl,
        parkingAddress: parking?.address,
        startDate: new Date(reservation.startTime)
          .toISOString()
          .split("T")[0],
        endDate: new Date(reservation.endTime)
          .toISOString()
          .split("T")[0],
      };
    });
    
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
