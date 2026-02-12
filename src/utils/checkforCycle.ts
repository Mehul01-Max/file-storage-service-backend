import { prisma } from "../config/prisma.js";
import ApiError from "./ApiError.js";


const checkForCycle = async (folder_id: string,  user_id: string, new_parent_id?: string) => {
    let currentParentId = new_parent_id ?? null;

    while (currentParentId) {
        if (currentParentId === folder_id) {
            throw new ApiError(400, "cannot create cyclic folder structure");
        }

        const parent = await prisma.folders.findUnique({
            where: { id: currentParentId, user_id }
        })
        if (!parent) break;
        currentParentId = parent.parent_id;
    }
}


export default checkForCycle;