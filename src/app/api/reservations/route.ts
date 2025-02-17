import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client"; // ...existing import path...
import { getUserFromToken } from "@/lib/auth"; // ...existing auth helper...

export async function POST(request: Request) {
  try {
    // Extracting reservation details and token from request body
    const { token, parkingId, startDate, endDate, startTime, endTime } = await request.json();
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      
    console.log("Creating reservation:", { parkingId, startDate, endDate, startTime, endTime });
    
    // Authenticate the user
    const user = await getUserFromToken(token);
    if (!user)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    // Build complete datetime objects for startTime and endTime using the provided dates and times
    const computedStart = new Date(`${startDate}T${startTime}Z`);
    const computedEnd = new Date(`${endDate}T${endTime}Z`);

    // Validate datetime ranges
    if (computedStart >= computedEnd) {
      return NextResponse.json(
        { error: "Invalid date/time range" },
        { status: 400 }
      );
    }

    // Create the reservation entry without startDate and endDate
    const reservation = await prisma.reservation.create({
      data: {
        parkingId: parseInt(parkingId, 10),
        userId: user.id,
        startTime: computedStart,
        endTime: computedEnd,
      },
    });
    console.log("Reservation created:", reservation);

    // Fetch additional parking details
    const parking = await prisma.parking.findUnique({
      where: { id: parseInt(parkingId, 10) },
      select: {
        parkingName: true,
        photoUrl: true,
        address: true,
      },
    });

    // Return response including the original startDate and endDate from input
    return NextResponse.json({
      ...reservation,
      startDate, // provided date portion for start
      endDate,   // provided date portion for end
      parkingName: parking?.parkingName,
      parkingPhotoUrl: parking?.photoUrl,
      parkingAddress: parking?.address,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating reservation:", error.message);
    } else {
      console.error("Error creating reservation:", error);
    }
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

// ...existing code...
