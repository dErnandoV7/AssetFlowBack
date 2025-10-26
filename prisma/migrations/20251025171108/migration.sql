/*
  Warnings:

  - You are about to drop the column `name` on the `Asset` table. All the data in the column will be lost.
  - Added the required column `identifyId` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "name",
ADD COLUMN     "identifyId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "AssetIdentity" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "canonicalName" TEXT NOT NULL,

    CONSTRAINT "AssetIdentity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssetIdentity_symbol_key" ON "AssetIdentity"("symbol");

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_identifyId_fkey" FOREIGN KEY ("identifyId") REFERENCES "AssetIdentity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
