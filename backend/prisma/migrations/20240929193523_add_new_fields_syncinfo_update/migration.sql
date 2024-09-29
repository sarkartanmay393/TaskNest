/*
  Warnings:

  - You are about to drop the column `requireSyncing` on the `SyncInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SyncInfo" DROP COLUMN "requireSyncing";
