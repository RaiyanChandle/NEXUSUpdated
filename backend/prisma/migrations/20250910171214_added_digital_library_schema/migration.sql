-- CreateTable
CREATE TABLE "public"."Library" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Library_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Library" ADD CONSTRAINT "Library_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "public"."Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
