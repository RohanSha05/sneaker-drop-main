/*
  Warnings:

  - You are about to drop the column `description` on the `drops` table. All the data in the column will be lost.
  - You are about to drop the column `endsAt` on the `drops` table. All the data in the column will be lost.
  - You are about to drop the column `startsAt` on the `drops` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `drops` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "drops" DROP COLUMN "description",
DROP COLUMN "endsAt",
DROP COLUMN "startsAt",
DROP COLUMN "status";
