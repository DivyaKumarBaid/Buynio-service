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
    "role" TEXT NOT NULL DEFAULT 'user',
    "signInMethod" TEXT NOT NULL DEFAULT 'local.com',

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
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
