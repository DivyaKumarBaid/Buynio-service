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
    "blueprint" JSONB NOT NULL,

    CONSTRAINT "ReleasedWeb_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReleasedWeb_ownerId_key" ON "ReleasedWeb"("ownerId");

-- AddForeignKey
ALTER TABLE "SavedWeb" ADD CONSTRAINT "SavedWeb_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReleasedWeb" ADD CONSTRAINT "ReleasedWeb_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
