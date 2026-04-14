-- CreateEnum
CREATE TYPE "SwitchStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "SwicthMembers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "switchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "offeredCards" TEXT[],
    "givedCards" TEXT[],
    "receivedCards" TEXT[],

    CONSTRAINT "SwicthMembers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Switchs" (
    "id" TEXT NOT NULL,
    "firstMemberId" TEXT NOT NULL,
    "secondMemberId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "SwitchStatus" NOT NULL,

    CONSTRAINT "Switchs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SwitchMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SwitchMembers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "SwicthMembers_switchId_idx" ON "SwicthMembers"("switchId");

-- CreateIndex
CREATE INDEX "Switchs_firstMemberId_idx" ON "Switchs"("firstMemberId");

-- CreateIndex
CREATE INDEX "Switchs_secondMemberId_idx" ON "Switchs"("secondMemberId");

-- CreateIndex
CREATE INDEX "Switchs_firstMemberId_secondMemberId_idx" ON "Switchs"("firstMemberId", "secondMemberId");

-- CreateIndex
CREATE INDEX "_SwitchMembers_B_index" ON "_SwitchMembers"("B");

-- AddForeignKey
ALTER TABLE "Switchs" ADD CONSTRAINT "Switchs_firstMemberId_fkey" FOREIGN KEY ("firstMemberId") REFERENCES "SwicthMembers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Switchs" ADD CONSTRAINT "Switchs_secondMemberId_fkey" FOREIGN KEY ("secondMemberId") REFERENCES "SwicthMembers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SwitchMembers" ADD CONSTRAINT "_SwitchMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "SwicthMembers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SwitchMembers" ADD CONSTRAINT "_SwitchMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "Switchs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
