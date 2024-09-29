-- CreateTable
CREATE TABLE "UserConfig" (
    "userId" SERIAL NOT NULL,
    "googleId" TEXT NOT NULL,

    CONSTRAINT "UserConfig_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserConfig_googleId_key" ON "UserConfig"("googleId");
