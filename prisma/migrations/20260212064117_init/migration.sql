/*
  Warnings:

  - Changed the type of `mime_type` on the `Files` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Files" DROP COLUMN "mime_type",
ADD COLUMN     "mime_type" TEXT NOT NULL;

-- DropEnum
DROP TYPE "MIMEType";
