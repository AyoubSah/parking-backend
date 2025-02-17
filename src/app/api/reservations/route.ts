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
    if (new Date(startDate) > new Date(endDate)) {
      return NextResponse.json(
        { error: "Invalid date range" },
        { status: 400 }
      );
    }
    if (new Date(startDate) == new Date(endDate) && new Date(`${startDate}T${startTime}Z`) >= new Date(`${endDate}T${endTime}Z`)) {
      return NextResponse.json(
        { error: "Invalid time range" },
        { status: 400 }
      );
    }

    // Create the reservation entry
    const reservation = await prisma.reservation.create({
      data: {
      parkingId: parseInt(parkingId, 10),
      userId: user.id,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      startTime: new Date(`${startDate}T${startTime}Z`),
      endTime: new Date(`${endDate}T${endTime}Z`),
      },
    });

    // Fetch additional parking details
    const parking = await prisma.parking.findUnique({
      where: { id: parseInt(parkingId, 10) },
      select: {
        parkingName: true,
        photoUrl: true,
        address: true,
      },
    });
    console.log(reservation)

    return NextResponse.json({
      ...reservation,
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
