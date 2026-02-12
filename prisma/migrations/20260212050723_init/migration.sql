/*
  Warnings:

  - Added the required column `fileStatus` to the `Files` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FileStatus" AS ENUM ('UPLOADING', 'UPLOADED', 'FAILED');

-- AlterTable
ALTER TABLE "Files" ADD COLUMN     "fileStatus" "FileStatus" NOT NULL;
