/*
  Warnings:

  - You are about to drop the column `completedAt` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `dropId` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `releasedAt` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `reservedAt` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `reservations` table. All the data in the column will be lost.
  - Added the required column `drop_id` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires_at` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `reservations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_dropId_fkey";

-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_userId_fkey";

-- DropIndex
DROP INDEX "reservations_dropId_status_idx";

-- DropIndex
DROP INDEX "reservations_expiresAt_idx";

-- DropIndex
DROP INDEX "reservations_userId_dropId_idx";

-- AlterTable
ALTER TABLE "drops" ADD COLUMN     "description" TEXT,
ADD COLUMN     "endsAt" TIMESTAMP(3),
ADD COLUMN     "startsAt" TIMESTAMP(3),
ADD COLUMN     "status" "DropStatus" NOT NULL DEFAULT 'SCHEDULED';

-- AlterTable
ALTER TABLE "reservations" DROP COLUMN "completedAt",
DROP COLUMN "createdAt",
DROP COLUMN "dropId",
DROP COLUMN "expiresAt",
DROP COLUMN "releasedAt",
DROP COLUMN "reservedAt",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "completed_at" TIMESTAMP(3),
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "drop_id" TEXT NOT NULL,
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "released_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "drops_status_startsAt_idx" ON "drops"("status", "startsAt");

-- CreateIndex
CREATE INDEX "reservations_drop_id_status_idx" ON "reservations"("drop_id", "status");

-- CreateIndex
CREATE INDEX "reservations_expires_at_idx" ON "reservations"("expires_at");

-- CreateIndex
CREATE INDEX "reservations_user_id_drop_id_idx" ON "reservations"("user_id", "drop_id");

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_drop_id_fkey" FOREIGN KEY ("drop_id") REFERENCES "drops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
