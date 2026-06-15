-- CreateEnum
CREATE TYPE "TradeStatus" AS ENUM ('OPEN', 'CONCLUDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "WishlistItemType" AS ENUM ('SPECIFIC_CARD', 'FILTER');

-- CreateTable
CREATE TABLE "Trade" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "linkedWishlistId" TEXT,
    "status" "TradeStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TradeItem" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "offeredTradeId" TEXT,
    "requestedTradeId" TEXT,

    CONSTRAINT "TradeItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TradeProposal" (
    "id" TEXT NOT NULL,
    "tradeId" TEXT NOT NULL,
    "proposerId" TEXT NOT NULL,
    "message" TEXT,
    "status" "ProposalStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TradeProposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProposalItem" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "ProposalItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wishlist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WishlistItem" (
    "id" TEXT NOT NULL,
    "wishlistId" TEXT NOT NULL,
    "itemType" "WishlistItemType" NOT NULL,
    "cardId" TEXT,
    "filterType" TEXT,
    "filterRarity" TEXT,

    CONSTRAINT "WishlistItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Trade_ownerId_idx" ON "Trade"("ownerId");

-- CreateIndex
CREATE INDEX "TradeItem_offeredTradeId_idx" ON "TradeItem"("offeredTradeId");

-- CreateIndex
CREATE INDEX "TradeItem_requestedTradeId_idx" ON "TradeItem"("requestedTradeId");

-- CreateIndex
CREATE INDEX "TradeProposal_tradeId_idx" ON "TradeProposal"("tradeId");

-- CreateIndex
CREATE INDEX "ProposalItem_proposalId_idx" ON "ProposalItem"("proposalId");

-- CreateIndex
CREATE INDEX "Wishlist_userId_idx" ON "Wishlist"("userId");

-- CreateIndex
CREATE INDEX "WishlistItem_wishlistId_idx" ON "WishlistItem"("wishlistId");

-- AddForeignKey
ALTER TABLE "TradeItem" ADD CONSTRAINT "TradeItem_offeredTradeId_fkey" FOREIGN KEY ("offeredTradeId") REFERENCES "Trade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradeItem" ADD CONSTRAINT "TradeItem_requestedTradeId_fkey" FOREIGN KEY ("requestedTradeId") REFERENCES "Trade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradeProposal" ADD CONSTRAINT "TradeProposal_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "Trade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalItem" ADD CONSTRAINT "ProposalItem_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "TradeProposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishlistItem" ADD CONSTRAINT "WishlistItem_wishlistId_fkey" FOREIGN KEY ("wishlistId") REFERENCES "Wishlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
