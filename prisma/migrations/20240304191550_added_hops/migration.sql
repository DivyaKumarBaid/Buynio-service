-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "onBoarded" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Hops" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "Hops_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Hops" ADD CONSTRAINT "Hops_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
