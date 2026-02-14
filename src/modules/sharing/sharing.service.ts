import { prisma } from "../../config/prisma.js";
import ApiError from "../../utils/ApiError.js";
import { resolveTargetUser } from "../../utils/helper.js";


export const shareFile = async (user_id: string, file_id: string, target_user_email: string) => {
    const targetUser = await resolveTargetUser(target_user_email, user_id);
    const share = await prisma.shared_Files.findUnique({
        where: {
            file_id_shared_with: {
                file_id,
                shared_with: targetUser.id
            }
        }
    })
    if (share && share.revoked) {
        return await prisma.shared_Files.update({
            where: {
                file_id_shared_with: {
                    file_id,
                    shared_with: targetUser.id
                }
            },
            data: {
                revoked: false
            }
        })
    }
    if (share && !share.revoked) {
        throw new ApiError(400, "share already exists")
    }
    return await prisma.shared_Files.create({
        data: {
            file_id,
            shared_by: user_id,
            shared_with: targetUser.id
        }
    })
}

export const getSharedFiles = async (user_id: string) => {
    return prisma.shared_Files.findMany({
        where: {
            shared_with: user_id, 
            revoked: false,
            file: {
                fileStatus: "UPLOADED"
            }
        },
        include: {
            file: true,
            sharedByUser: true,
        }
    })
}

export const revokeShareFile = async (user_id: string, share_id: string) => {
    const share = await prisma.shared_Files.findFirst({
        where: { id: share_id, shared_by: user_id }
    })

    if (!share) {
        throw new ApiError(404, "share not found");
    }

    await prisma.shared_Files.update({
        where: {
            id: share_id
        },
        data: {
            revoked: true
        }
    })
}

export const shareFolder = async (user_id: string, folder_id: string, target_user_email: string) => {
    const targetUser = await resolveTargetUser(target_user_email, user_id);

    const folder = await prisma.folders.findUnique({
        where: { id: folder_id }
    });

    if (!folder || folder.user_id !== user_id || folder.is_deleted) {
        throw new ApiError(404, "file not found");
    }

    const share = await prisma.shared_Folders.findUnique({
        where: {
            folder_id_shared_with: {
                folder_id,
                shared_with: targetUser.id
            }
        }
    })
    if (share && share.revoked) {
        return await prisma.shared_Folders.update({
            where: {
                folder_id_shared_with: {
                    folder_id,
                    shared_with: targetUser.id
                }
            },
            data: {
                revoked: false
            }
        })
    }
    if (share && !share.revoked) {
        throw new ApiError(400, "share already exists")
    }
    return await prisma.shared_Folders.create({
        data: {
            folder_id,
            shared_by: user_id,
            shared_with: targetUser.id
        }
    })
}

export const getSharedFolders = async (user_id: string) => {
    return prisma.shared_Folders.findMany({
        where: {
            shared_with: user_id, 
            revoked: false,
            folder: {
                is_deleted: false
            }
        },
        include: {
            folder: true,
            sharedByUser: true,
        }
    })
}

export const revokeShareFolder = async (user_id: string, share_id: string) => {
    const share = await prisma.shared_Folders.findFirst({
        where: { id: share_id, shared_by: user_id }
    })

    if (!share) {
        throw new ApiError(404, "share not found");
    }

    await prisma.shared_Folders.update({
        where: {
            id: share_id
        },
        data: {
            revoked: true
        }
    })
}