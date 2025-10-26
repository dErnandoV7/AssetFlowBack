/*
  Warnings:

  - A unique constraint covering the columns `[identifyId,walletId]` on the table `Asset` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."AssetIdentity_canonicalName_key";

-- CreateIndex
CREATE UNIQUE INDEX "Asset_identifyId_walletId_key" ON "Asset"("identifyId", "walletId");
