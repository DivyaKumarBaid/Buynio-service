-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "instagramAccessToken" TEXT,
ADD COLUMN     "isInstagramLinked" BOOLEAN NOT NULL DEFAULT false;
