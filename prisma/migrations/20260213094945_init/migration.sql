/*
  Warnings:

  - You are about to drop the column `expires_at` on the `Shared_Files` table. All the data in the column will be lost.
  - You are about to drop the column `permission` on the `Shared_Files` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Shared_Files` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[file_id,shared_with]` on the table `Shared_Files` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shared_by` to the `Shared_Files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shared_with` to the `Shared_Files` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Shared_Files" DROP CONSTRAINT "Shared_Files_user_id_fkey";

-- AlterTable
ALTER TABLE "Shared_Files" DROP COLUMN "expires_at",
DROP COLUMN "permission",
DROP COLUMN "user_id",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "shared_by" TEXT NOT NULL,
ADD COLUMN     "shared_with" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Permission";

-- CreateIndex
CREATE UNIQUE INDEX "Shared_Files_file_id_shared_with_key" ON "Shared_Files"("file_id", "shared_with");

-- AddForeignKey
ALTER TABLE "Shared_Files" ADD CONSTRAINT "Shared_Files_shared_by_fkey" FOREIGN KEY ("shared_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shared_Files" ADD CONSTRAINT "Shared_Files_shared_with_fkey" FOREIGN KEY ("shared_with") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
