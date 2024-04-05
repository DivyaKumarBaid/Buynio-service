/*
  Warnings:

  - You are about to drop the `Hops` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Hops" DROP CONSTRAINT "Hops_ownerId_fkey";

-- DropTable
DROP TABLE "Hops";

-- CreateTable
CREATE TABLE "Brand" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "brandName" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "officialPhone" TEXT NOT NULL,
    "officialEmail" TEXT NOT NULL,
    "customerServicePhone" TEXT,
    "customerServiceEmail" TEXT NOT NULL,
    "logo" TEXT,
    "instagramAccount" TEXT,
    "facebookAccount" TEXT,
    "otherAccount" TEXT,
    "descrtiption" TEXT NOT NULL DEFAULT '',
    "privacyPolicy" TEXT,
    "termsAndConditions" TEXT,
    "motto" TEXT,
    "category" "Category" NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT NOT NULL,
    "blueprint" JSONB NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Brand_link_key" ON "Brand"("link");

-- AddForeignKey
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
