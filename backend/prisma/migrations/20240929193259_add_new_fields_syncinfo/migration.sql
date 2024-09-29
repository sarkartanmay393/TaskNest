-- CreateTable
CREATE TABLE "SyncInfo" (
    "userId" SERIAL NOT NULL,
    "lastSuccessfulSyncAt" TIMESTAMP(3),
    "requireSyncing" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SyncInfo_pkey" PRIMARY KEY ("userId")
);
