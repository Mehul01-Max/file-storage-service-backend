/*
  Warnings:

  - The primary key for the `File_Versions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Files` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Folders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Shared_Files` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "File_Versions" DROP CONSTRAINT "File_Versions_file_id_fkey";

-- DropForeignKey
ALTER TABLE "Files" DROP CONSTRAINT "Files_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Folders" DROP CONSTRAINT "Folders_parent_folder_id_fkey";

-- DropForeignKey
ALTER TABLE "Folders" DROP CONSTRAINT "Folders_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Shared_Files" DROP CONSTRAINT "Shared_Files_file_id_fkey";

-- DropForeignKey
ALTER TABLE "Shared_Files" DROP CONSTRAINT "Shared_Files_user_id_fkey";

-- AlterTable
ALTER TABLE "File_Versions" DROP CONSTRAINT "File_Versions_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "file_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "File_Versions_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "File_Versions_id_seq";

-- AlterTable
ALTER TABLE "Files" DROP CONSTRAINT "Files_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Files_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Files_id_seq";

-- AlterTable
ALTER TABLE "Folders" DROP CONSTRAINT "Folders_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "parent_folder_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Folders_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Folders_id_seq";

-- AlterTable
ALTER TABLE "Shared_Files" DROP CONSTRAINT "Shared_Files_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "file_id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Shared_Files_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Shared_Files_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AddForeignKey
ALTER TABLE "Files" ADD CONSTRAINT "Files_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folders" ADD CONSTRAINT "Folders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folders" ADD CONSTRAINT "Folders_parent_folder_id_fkey" FOREIGN KEY ("parent_folder_id") REFERENCES "Folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File_Versions" ADD CONSTRAINT "File_Versions_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "Files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shared_Files" ADD CONSTRAINT "Shared_Files_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "Files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shared_Files" ADD CONSTRAINT "Shared_Files_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
