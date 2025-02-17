import { faker } from "@faker-js/faker";
import prisma from "../src/app/lib/prisma/client";

export default async function seed() {
  const parkings = [];

  for (let i = 0; i < 10; i++) {
    parkings.push({
      parkingName: faker.company.name() + " Parking",
      address: faker.location.street(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      totalPlaces: faker.number.int({ min: 50, max: 200 }),
      freePlaces: faker.number.int({ min: 0, max: 50 }),
      price: parseFloat(faker.commerce.price({ min: 1, max: 20, dec: 2 })),
      rating: parseFloat(
        faker.number.float({ min: 1, max: 5, fractionDigits: 1 }).toFixed(1)
      ),
      photoUrl: faker.image.url(),
      description: faker.lorem.sentence(),
    });
  }
  console.log(parkings[1]);

  await prisma.parking.createMany({ data: parkings });
  console.log("Database seeded with parking data.");
}
