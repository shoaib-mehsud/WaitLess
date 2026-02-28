/*
  Warnings:

  - The values [PAUSE] on the enum `QueueStatus` will be removed. If these variants are still used in the database, this will fail.
  - The `status` column on the `businesses` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[queueId,sequenceNumber]` on the table `tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "QueueStatus_new" AS ENUM ('OPEN', 'PAUSED', 'LOCKED', 'CLOSED');
ALTER TABLE "queues" ALTER COLUMN "state" TYPE "QueueStatus_new" USING ("state"::text::"QueueStatus_new");
ALTER TYPE "QueueStatus" RENAME TO "QueueStatus_old";
ALTER TYPE "QueueStatus_new" RENAME TO "QueueStatus";
DROP TYPE "public"."QueueStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "businesses" DROP COLUMN "status",
ADD COLUMN     "status" "BusinessStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "queues" ADD COLUMN     "state" "QueueStatus" NOT NULL DEFAULT 'OPEN';

-- DropEnum
DROP TYPE "BusinesStatus";

-- CreateIndex
CREATE UNIQUE INDEX "tokens_queueId_sequenceNumber_key" ON "tokens"("queueId", "sequenceNumber");
