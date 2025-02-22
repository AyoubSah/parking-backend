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

// PUT update reservation endpoint with date calculation
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // If date/time fields are provided, calculate computedStart and computedEnd
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
      updateData = {
        ...updateData,
        startTime: computedStart,
        endTime: computedEnd,
      };
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id: params.id },
      data: updateData,
    });
    return NextResponse.json(updatedReservation);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

// DELETE reservation endpoint
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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
      where: { id: params.id },
    });
    return NextResponse.json({ message: "Reservation deleted" });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
