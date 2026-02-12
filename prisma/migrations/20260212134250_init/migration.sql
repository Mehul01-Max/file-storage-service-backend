/*
  Warnings:

  - You are about to drop the column `is_deleted` on the `Files` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Files" DROP COLUMN "is_deleted";
