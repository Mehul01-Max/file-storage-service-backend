/*
  Warnings:

  - You are about to drop the column `parent_folder_id` on the `Folders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Folders" DROP CONSTRAINT "Folders_parent_folder_id_fkey";

-- AlterTable
ALTER TABLE "Folders" DROP COLUMN "parent_folder_id",
ADD COLUMN     "parent_id" TEXT;

-- AddForeignKey
ALTER TABLE "Folders" ADD CONSTRAINT "Folders_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
