/*
  Warnings:

  - A unique constraint covering the columns `[ownerId]` on the table `Brand` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Brand_ownerId_key" ON "Brand"("ownerId");
