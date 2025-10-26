/*
  Warnings:

  - A unique constraint covering the columns `[canonicalName]` on the table `AssetIdentity` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AssetIdentity_canonicalName_key" ON "AssetIdentity"("canonicalName");
