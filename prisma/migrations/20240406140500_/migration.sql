/*
  Warnings:

  - You are about to drop the column `descrtiption` on the `Brand` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Brand" DROP COLUMN "descrtiption",
ADD COLUMN     "description" TEXT NOT NULL DEFAULT '';
