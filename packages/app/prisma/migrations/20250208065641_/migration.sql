/*
  Warnings:

  - You are about to drop the column `eventType` on the `Call` table. All the data in the column will be lost.
  - The primary key for the `TaskCall` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `eventType` to the `TaskCall` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "TaskCall_callId_key";

-- AlterTable
ALTER TABLE "Call" DROP COLUMN "eventType";

-- AlterTable
ALTER TABLE "TaskCall" DROP CONSTRAINT "TaskCall_pkey",
ADD COLUMN     "eventType" "TaskCallEvent" NOT NULL,
ADD CONSTRAINT "TaskCall_pkey" PRIMARY KEY ("callId", "taskId", "eventType");
