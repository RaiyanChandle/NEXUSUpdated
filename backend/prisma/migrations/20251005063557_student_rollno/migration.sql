/*
  Warnings:

  - You are about to drop the column `rollno` on the `Enrollment` table. All the data in the column will be lost.
  - Added the required column `rollno` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Enrollment" DROP COLUMN "rollno";

-- AlterTable
ALTER TABLE "public"."Student" ADD COLUMN     "rollno" INTEGER NOT NULL;
