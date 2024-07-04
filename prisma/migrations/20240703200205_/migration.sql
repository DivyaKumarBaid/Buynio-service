-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "Unverified_Users" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "otp" TEXT,

    CONSTRAINT "Unverified_Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "hashRT" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "signInMethod" TEXT NOT NULL DEFAULT 'local.com',
    "onBoarded" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

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
    "description" TEXT NOT NULL DEFAULT '',
    "privacyPolicy" TEXT,
    "termsAndConditions" TEXT,
    "motto" TEXT,
    "category" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedWeb" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "blueprint" JSONB NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SavedWeb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReleasedWeb" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "brandId" INTEGER NOT NULL,
    "blueprint" JSONB NOT NULL,

    CONSTRAINT "ReleasedWeb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordOtp" (
    "id" SERIAL NOT NULL,
    "hashOtp" TEXT NOT NULL,
    "user_mail" TEXT NOT NULL,

    CONSTRAINT "PasswordOtp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Unverified_Users_email_key" ON "Unverified_Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_link_key" ON "Brand"("link");

-- CreateIndex
CREATE UNIQUE INDEX "ReleasedWeb_ownerId_key" ON "ReleasedWeb"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "ReleasedWeb_brandId_key" ON "ReleasedWeb"("brandId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordOtp_user_mail_key" ON "PasswordOtp"("user_mail");

-- AddForeignKey
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedWeb" ADD CONSTRAINT "SavedWeb_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReleasedWeb" ADD CONSTRAINT "ReleasedWeb_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReleasedWeb" ADD CONSTRAINT "ReleasedWeb_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
