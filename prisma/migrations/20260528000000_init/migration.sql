-- CreateTable
CREATE TABLE "Waitlist" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "rewardCopy" TEXT NOT NULL,
    "referralWeight" INTEGER NOT NULL DEFAULT 10,
    "brandColor" TEXT NOT NULL DEFAULT '#7c3aed',
    "logoUrl" TEXT,
    "isPoweredByHidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Waitlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaitlistSignup" (
    "id" TEXT NOT NULL,
    "waitlistId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "referrerId" TEXT,
    "referralCount" INTEGER NOT NULL DEFAULT 0,
    "basePosition" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WaitlistSignup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Waitlist_slug_key" ON "Waitlist"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "WaitlistSignup_waitlistId_email_key" ON "WaitlistSignup"("waitlistId", "email");

-- CreateIndex
CREATE INDEX "WaitlistSignup_waitlistId_idx" ON "WaitlistSignup"("waitlistId");

-- AddForeignKey
ALTER TABLE "WaitlistSignup" ADD CONSTRAINT "WaitlistSignup_waitlistId_fkey" FOREIGN KEY ("waitlistId") REFERENCES "Waitlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaitlistSignup" ADD CONSTRAINT "WaitlistSignup_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "WaitlistSignup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
