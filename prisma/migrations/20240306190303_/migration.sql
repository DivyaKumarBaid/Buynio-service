-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('CLOTH', 'ELECTRONICS');

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
CREATE TABLE "Hops" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "instagramAccount" TEXT NOT NULL,
    "otherReachout" TEXT,
    "descrtiption" TEXT NOT NULL DEFAULT '',
    "motto" TEXT NOT NULL DEFAULT '',
    "category" "Category" NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Hops_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "PasswordOtp_user_mail_key" ON "PasswordOtp"("user_mail");

-- AddForeignKey
ALTER TABLE "Hops" ADD CONSTRAINT "Hops_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
