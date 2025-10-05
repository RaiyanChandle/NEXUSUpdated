/*
  Warnings:

  - You are about to drop the column `rollNo` on the `Enrollment` table. All the data in the column will be lost.
  - Added the required column `rollno` to the `Enrollment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Enrollment_classId_rollNo_key";

-- AlterTable
ALTER TABLE "public"."Enrollment" DROP COLUMN "rollNo",
ADD COLUMN     "rollno" INTEGER NOT NULL;
