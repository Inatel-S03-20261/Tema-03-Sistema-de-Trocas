/*
  Warnings:

  - The values [OPEN,CONCLUDED] on the enum `TradeStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `linkedWishlistId` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `offeredTradeId` on the `TradeItem` table. All the data in the column will be lost.
  - You are about to drop the column `requestedTradeId` on the `TradeItem` table. All the data in the column will be lost.
  - Added the required column `type` to the `ProposalItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `acceptedBy` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tradeId` to the `TradeItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `TradeItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProposalItemType" AS ENUM ('OFFERED', 'REQUESTED');

-- CreateEnum
CREATE TYPE "TradeItemType" AS ENUM ('OFFERED', 'REQUESTED');

-- AlterEnum
BEGIN;
CREATE TYPE "TradeStatus_new" AS ENUM ('OPENED', 'COMPLETED', 'CANCELLED');
ALTER TABLE "public"."Trade" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Trade" ALTER COLUMN "status" TYPE "TradeStatus_new" USING ("status"::text::"TradeStatus_new");
ALTER TYPE "TradeStatus" RENAME TO "TradeStatus_old";
ALTER TYPE "TradeStatus_new" RENAME TO "TradeStatus";
DROP TYPE "public"."TradeStatus_old";
ALTER TABLE "Trade" ALTER COLUMN "status" SET DEFAULT 'OPENED';
COMMIT;

-- DropForeignKey
ALTER TABLE "TradeItem" DROP CONSTRAINT "TradeItem_offeredTradeId_fkey";

-- DropForeignKey
ALTER TABLE "TradeItem" DROP CONSTRAINT "TradeItem_requestedTradeId_fkey";

-- DropIndex
DROP INDEX "Trade_ownerId_idx";

-- DropIndex
DROP INDEX "TradeItem_offeredTradeId_idx";

-- DropIndex
DROP INDEX "TradeItem_requestedTradeId_idx";

-- AlterTable
ALTER TABLE "ProposalItem" ADD COLUMN     "type" "ProposalItemType" NOT NULL;

-- AlterTable
ALTER TABLE "Trade" DROP COLUMN "linkedWishlistId",
DROP COLUMN "ownerId",
ADD COLUMN     "acceptedBy" TEXT NOT NULL,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "createdBy" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'OPENED';

-- AlterTable
ALTER TABLE "TradeItem" DROP COLUMN "offeredTradeId",
DROP COLUMN "requestedTradeId",
ADD COLUMN     "tradeId" TEXT NOT NULL,
ADD COLUMN     "type" "TradeItemType" NOT NULL,
ADD COLUMN     "wishlistId" TEXT,
ALTER COLUMN "cardId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Trade_createdBy_idx" ON "Trade"("createdBy");

-- CreateIndex
CREATE INDEX "Trade_acceptedBy_idx" ON "Trade"("acceptedBy");

-- CreateIndex
CREATE INDEX "TradeItem_tradeId_idx" ON "TradeItem"("tradeId");

-- CreateIndex
CREATE INDEX "TradeItem_tradeId_type_idx" ON "TradeItem"("tradeId", "type");

-- CreateIndex
CREATE INDEX "TradeProposal_proposerId_idx" ON "TradeProposal"("proposerId");

-- CreateIndex
CREATE INDEX "TradeProposal_tradeId_proposerId_idx" ON "TradeProposal"("tradeId", "proposerId");

-- CreateIndex
CREATE INDEX "WishlistItem_wishlistId_itemType_idx" ON "WishlistItem"("wishlistId", "itemType");

-- AddForeignKey
ALTER TABLE "TradeItem" ADD CONSTRAINT "TradeItem_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "Trade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
