/*
  Warnings:

  - You are about to drop the column `clerkId` on the `Admin` table. All the data in the column will be lost.
  - Added the required column `password` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Admin_clerkId_key";

-- AlterTable
ALTER TABLE "public"."Admin" DROP COLUMN "clerkId",
ADD COLUMN     "password" TEXT NOT NULL;
