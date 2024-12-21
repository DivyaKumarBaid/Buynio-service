/*
  Warnings:

  - A unique constraint covering the columns `[hopId]` on the table `Products` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hopId` to the `Products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Products" ADD COLUMN     "hopId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Products_hopId_key" ON "Products"("hopId");

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_hopId_fkey" FOREIGN KEY ("hopId") REFERENCES "SavedWeb"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
