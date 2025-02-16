import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client"; // ...existing import path...
import { getUserFromToken } from "@/lib/auth"; // ...existing auth helper...

export async function POST(request: Request) {
  try {
    // Extracting reservation details and token from request body
    const { token, parkingId, startDate, endDate, startTime, endTime } =
      await request.json();
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Authenticate the user
    const user = await getUserFromToken(token);
    if (!user)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    // Validate date and time ranges
    if (new Date(startDate) >= new Date(endDate)) {
      return NextResponse.json(
        { error: "Invalid date range" },
        { status: 400 }
      );
    }
    if (new Date(startTime) >= new Date(endTime)) {
      return NextResponse.json(
        { error: "Invalid time range" },
        { status: 400 }
      );
    }

    // Create the reservation entry
    const reservation = await prisma.reservation.create({
      data: {
        parkingId,
        userId: user.id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });

    return NextResponse.json(reservation);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

// ...existing code...
