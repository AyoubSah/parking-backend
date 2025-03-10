import { faker } from "@faker-js/faker";
import prisma from "@/lib/prisma/client";

export default async function seed() {
  const parkings = [];

  for (let i = 0; i < 5; i++) {
    parkings.push({
      parkingName: faker.company.name() + " Parking",
      address: faker.location.street(),
      latitude: faker.number.float({ min: 36.7, max: 36.8, precision: 0.000001 }),
      longitude: faker.number.float({ min: 5.0, max: 5.1, precision: 0.000001 }),
      totalPlaces: faker.number.int({ min: 50, max: 200 }),
      price: parseFloat(faker.commerce.price({ min: 100, max: 500, dec: 2 })),
      rating: parseFloat(
        faker.number.float({ min: 1, max: 10, fractionDigits: 1 }).toFixed(1)
      ),
      photoUrl: faker.image.url(),
      description: faker.lorem.paragraph(),
    });
  }

  await prisma.parking.createMany({ data: parkings });
  console.log("Database seeded with parking data.");
}
