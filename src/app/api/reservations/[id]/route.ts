import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { getUserFromToken } from "@/lib/auth";

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
            photoUrl: true,
            address: true,
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

// PUT update reservation endpoint with date calculation, parking info, and custom time formatting in response
export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = await context.params;
  try {
    const { token, startDate, endDate, startTime, endTime, ...otherData } =
      await request.json();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    let updateData = { ...otherData };
    
    // Get the parking details to access price
    const existingReservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        parking: {
          select: {
            id: true,
            parkingName: true,
            photoUrl: true,
            address: true,
            price: true,
          },
        },
      },
    });

    if (!existingReservation || !existingReservation.parking) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }

    // Calculate computedStart and computedEnd if date/time provided
    if (startDate && endDate && startTime && endTime) {
      const computedStart = new Date(`${startDate}T${startTime}Z`);
      const computedEnd = new Date(`${endDate}T${endTime}Z`);
      if (isNaN(computedStart.getTime()) || isNaN(computedEnd.getTime())) {
        return NextResponse.json(
          { error: "Invalid date/time format" },
          { status: 400 }
        );
      }
      if (computedStart >= computedEnd) {
        return NextResponse.json(
          { error: "Invalid date/time range" },
          { status: 400 }
        );
      }

      // Calculate new cost based on updated duration
      const hours = Math.ceil((computedEnd.getTime() - computedStart.getTime()) / (1000 * 60 * 60));
      const cost = hours * existingReservation.parking.price;

      updateData = {
        ...updateData,
        startTime: computedStart,
        endTime: computedEnd,
        cost: cost,
      };
    }
    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: updateData,
      include: {
        parking: {
          select: {
            id: true,
            parkingName: true,
            photoUrl: true,
            address: true,
          },
        },
      },
    });
    const parking = await prisma.parking.findUnique({
      where: { id: updatedReservation.parking.id },
      select: {
        parkingName: true,
        photoUrl: true,
        address: true,
      },
    });
    if (!parking)
      return NextResponse.json({ error: "Parking not found" }, { status: 404 });
    // Overwrite the startTime and endTime in the returned object with the original HH:mm values
    updatedReservation.startTime = startTime;
    updatedReservation.endTime = endTime;
    // Include the original startDate and endDate in the updated reservation object
    return NextResponse.json({
      ...updatedReservation,
      startDate, // provided date portion for start
      endDate,
      userId: user.id, // provided date portion for end
      parkingName: parking.parkingName,
      parkingPhotoUrl: parking.photoUrl,
      parkingAddress: parking.address,
    });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

// DELETE reservation endpoint
export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  try {
    const { token } = await request.json();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await prisma.reservation.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Reservation deleted" });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
