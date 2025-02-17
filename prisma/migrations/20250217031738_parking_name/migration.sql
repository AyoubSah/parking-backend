/*
  Warnings:

  - You are about to drop the column `name` on the `Parking` table. All the data in the column will be lost.
  - Added the required column `parkingName` to the `Parking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Parking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "parkingName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "totalPlaces" INTEGER NOT NULL,
    "freePlaces" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "rating" REAL NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL
);
INSERT INTO "new_Parking" ("address", "description", "freePlaces", "id", "latitude", "longitude", "photoUrl", "price", "rating", "totalPlaces") SELECT "address", "description", "freePlaces", "id", "latitude", "longitude", "photoUrl", "price", "rating", "totalPlaces" FROM "Parking";
DROP TABLE "Parking";
ALTER TABLE "new_Parking" RENAME TO "Parking";
CREATE UNIQUE INDEX "Parking_parkingName_key" ON "Parking"("parkingName");
CREATE INDEX "Parking_parkingName_idx" ON "Parking"("parkingName");
CREATE TABLE "new_Reservation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "parkingId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    CONSTRAINT "Reservation_parkingId_fkey" FOREIGN KEY ("parkingId") REFERENCES "Parking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Reservation" ("endDate", "id", "parkingId", "startDate", "userId") SELECT "endDate", "id", "parkingId", "startDate", "userId" FROM "Reservation";
DROP TABLE "Reservation";
ALTER TABLE "new_Reservation" RENAME TO "Reservation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
