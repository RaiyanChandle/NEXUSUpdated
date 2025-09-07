/*
  Warnings:

  - You are about to drop the column `name` on the `Admin` table. All the data in the column will be lost.
  - Added the required column `name` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Admin" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "public"."Teacher" ADD COLUMN     "name" TEXT NOT NULL;
