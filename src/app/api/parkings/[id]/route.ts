import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const id = parseInt(params.id);
    if (isNaN(id))
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const parking = await prisma.parking.findUnique({ where: { id } });
    if (!parking)
      return NextResponse.json({ error: "Parking not found" }, { status: 404 });
    
    const now = new Date();
    const activeReservations = await prisma.reservation.count({
      where: {
        parkingId: id,
        startTime: { lte: now },
        endTime: { gte: now }
      }
    });
    const parkingWithFreePlaces = {
      ...parking,
      freePlaces: parking.totalPlaces - activeReservations
    };
    return NextResponse.json(parkingWithFreePlaces);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const id = parseInt(params.id);
    if (isNaN(id))
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const data = await request.json();
    const parking = await prisma.parking.update({
      where: { id },
      data,
    });
    return NextResponse.json(parking);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const id = parseInt(params.id);
    if (isNaN(id))
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    await prisma.parking.delete({ where: { id } });
    return NextResponse.json({ message: "Parking deleted" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
