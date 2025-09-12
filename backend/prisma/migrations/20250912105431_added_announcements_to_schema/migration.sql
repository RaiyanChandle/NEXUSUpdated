-- CreateEnum
CREATE TYPE "public"."AnnouncementType" AS ENUM ('GLOBAL', 'CLASS', 'TEACHER');

-- CreateTable
CREATE TABLE "public"."Announcement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "public"."AnnouncementType" NOT NULL,
    "classId" TEXT,
    "teacherId" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Announcement" ADD CONSTRAINT "Announcement_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
