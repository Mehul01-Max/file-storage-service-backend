-- CreateTable
CREATE TABLE "Shared_Folders" (
    "id" TEXT NOT NULL,
    "folder_id" TEXT NOT NULL,
    "shared_by" TEXT NOT NULL,
    "shared_with" TEXT NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Shared_Folders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shared_Folders_folder_id_shared_with_key" ON "Shared_Folders"("folder_id", "shared_with");

-- AddForeignKey
ALTER TABLE "Shared_Folders" ADD CONSTRAINT "Shared_Folders_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "Folders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shared_Folders" ADD CONSTRAINT "Shared_Folders_shared_by_fkey" FOREIGN KEY ("shared_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shared_Folders" ADD CONSTRAINT "Shared_Folders_shared_with_fkey" FOREIGN KEY ("shared_with") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
