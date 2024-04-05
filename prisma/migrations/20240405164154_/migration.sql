/*
  Warnings:

  - You are about to drop the column `name` on the `Hops` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[link]` on the table `Hops` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `blueprint` to the `Hops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brandName` to the `Hops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyName` to the `Hops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerServiceEmail` to the `Hops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `link` to the `Hops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `officialEmail` to the `Hops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `officialPhone` to the `Hops` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hops" DROP COLUMN "name",
ADD COLUMN     "blueprint" JSONB NOT NULL,
ADD COLUMN     "brandName" TEXT NOT NULL,
ADD COLUMN     "companyName" TEXT NOT NULL,
ADD COLUMN     "customerServiceEmail" TEXT NOT NULL,
ADD COLUMN     "customerServicePhone" TEXT,
ADD COLUMN     "facebookAccount" TEXT,
ADD COLUMN     "link" TEXT NOT NULL,
ADD COLUMN     "officialEmail" TEXT NOT NULL,
ADD COLUMN     "officialPhone" TEXT NOT NULL,
ADD COLUMN     "otherAccount" TEXT,
ADD COLUMN     "privacyPolicy" TEXT,
ALTER COLUMN "instagramAccount" DROP NOT NULL,
ALTER COLUMN "motto" DROP NOT NULL,
ALTER COLUMN "motto" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Hops_link_key" ON "Hops"("link");
