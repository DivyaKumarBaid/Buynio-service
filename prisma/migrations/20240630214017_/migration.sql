/*
  Warnings:

  - You are about to drop the column `blueprint` on the `Brand` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[brandId]` on the table `ReleasedWeb` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `brandId` to the `ReleasedWeb` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Brand" DROP COLUMN "blueprint";

-- AlterTable
ALTER TABLE "ReleasedWeb" ADD COLUMN     "brandId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ReleasedWeb_brandId_key" ON "ReleasedWeb"("brandId");

-- AddForeignKey
ALTER TABLE "ReleasedWeb" ADD CONSTRAINT "ReleasedWeb_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
