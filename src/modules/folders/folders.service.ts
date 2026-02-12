import { prisma } from "../../config/prisma.js"
import ApiError from "../../utils/ApiError.js"
import checkForCycle from "../../utils/checkforCycle.js";
import { deleteFile } from "../files/files.service.js";


export const createFolder = async (name: string, user_id: string, parent_id?: string) => {
    if (parent_id) {
        const parent = await prisma.folders.findFirst({
            where: {
                id: parent_id,
                user_id,
                is_deleted: false
            }
        })

        if (!parent) {
            throw new ApiError(404, "parent folder not found");
        }

        
    }
    const folder = await prisma.folders.create({
        data: {
            name, 
            user_id, 
            parent_id: parent_id ?? null
        }
    })

    return folder
}   

export const getFolder = async (user_id: string, folder_id: string) => {
    const folder = await prisma.folders.findFirst({
        where: {id: folder_id, user_id, is_deleted: false},
        include: {
            children: {
                where: {
                    is_deleted: false
                }
            },
            files: {
                where: {
                    fileStatus: "UPLOADED"
                }
            }
        }
    })
    if (!folder) {
        throw new ApiError(404, "folder not found")
    }
    return folder
}

export const listRootFolder = async (user_id: string) => {
    const folders = await prisma.folders.findMany({
        where: {user_id, parent_id: null, is_deleted: false}
    })
    return folders
} 

export const renameFolder = async (user_id: string, folder_id: string, name: string) => {
    const folder = await prisma.folders.findFirst({
        where: {user_id, id: folder_id, is_deleted: false}
    })

    if (!folder) {
        throw new ApiError(404, "folder not found")
    }

    return await prisma.folders.update({
        where: {user_id, id: folder_id, is_deleted: false},
        data: {name}
    })
}

export const deleteFolder = async (user_id: string, folder_id: string) => {
    const folder = await getFolder(user_id, folder_id)

    


    for (const file of folder.files) {
        if (file.fileStatus === "UPLOADED") {
            await deleteFile(user_id, file.id);
        }
    }


    for (const child of folder.children) {
        if (!child.is_deleted) {
            await deleteFolder(user_id, child.id);
        }
    }

    await prisma.folders.update({
        where: { id: folder_id },
        data: { is_deleted: true }
    });
    

}

export const moveFolder = async (user_id: string, folder_id: string, new_parent_id? : string) => {
    const folder = await prisma.folders.findFirst({
        where: {id: folder_id, user_id}
    })
    if (!folder) {
        new ApiError(404, "folder not found");
    }
    if (new_parent_id) {
        const new_parent = await prisma.folders.findFirst({
            where: {id: new_parent_id, user_id}
        })
        if (!new_parent) {
            new ApiError(404, "parent folder not found");
        }
    }
    await checkForCycle(user_id, folder_id, new_parent_id);

    return prisma.folders.update({
        where: { id: folder_id, user_id},
        data: {parent_id: new_parent_id ?? null}
    });
}

