import { NextResponse } from "next/server";
import seed from "scripts/seed";

export async function GET() {
  try {
    seed();
    return NextResponse.json({ message: "Database seeded with parking data." });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
