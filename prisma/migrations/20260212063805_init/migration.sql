-- AlterTable
ALTER TABLE "Files" ADD COLUMN     "folder_id" TEXT;

-- AlterTable
ALTER TABLE "Folders" ADD COLUMN     "files_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Files" ADD CONSTRAINT "Files_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "Folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
