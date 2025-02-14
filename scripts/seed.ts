import { faker } from "@faker-js/faker";
import prisma from "../src/lib/prisma/client";

async function main() {
  const parkings = [];

  for (let i = 0; i < 10; i++) {
    parkings.push({
      name: faker.company.name() + " Parking",
      address: faker.address.streetAddress(),
      latitude: parseFloat(faker.address.latitude()),
      longitude: parseFloat(faker.address.longitude()),
      totalPlaces: faker.datatype.number({ min: 50, max: 200 }),
      freePlaces: faker.datatype.number({ min: 0, max: 50 }),
      price: parseFloat(faker.commerce.price(1, 20, 2)),
      rating: parseFloat(
        faker.datatype.number({ min: 1, max: 5, precision: 0.1 }).toFixed(1)
      ),
      photoUrl: faker.image.imageUrl(),
      description: faker.lorem.sentence(),
    });
  }

  await prisma.parking.createMany({ data: parkings });
  console.log("Database seeded with parking data.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
