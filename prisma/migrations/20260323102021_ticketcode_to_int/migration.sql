/*
  Warnings:

  - Changed the type of `ticketCode` on the `tokens` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/

ALTER TABLE "tokens" DROP COLUMN "ticketCode";
ALTER TABLE "tokens" ADD COLUMN "ticketCode" INT NOT NULL;
CREATE UNIQUE INDEX "tokens_queueId_ticketCode_key" ON "tokens"("queueId", "ticketCode");