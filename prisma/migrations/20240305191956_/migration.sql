/*
  Warnings:

  - The `role` column on the `Users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `category` to the `Hops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instagramAccount` to the `Hops` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('CLOTH', 'ELECTRONICS');

-- AlterTable
ALTER TABLE "Hops" ADD COLUMN     "category" "Category" NOT NULL,
ADD COLUMN     "descrtiption" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "instagramAccount" TEXT NOT NULL,
ADD COLUMN     "logo" TEXT,
ADD COLUMN     "motto" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "otherReachout" TEXT,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
