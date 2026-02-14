import { prisma } from "../config/prisma.js";
import ApiError from "./ApiError.js";

export const resolveTargetUser = async (email: string, user_id: string) => {
  const targetUser = await prisma.user.findUnique({ where: { email } });

  if (!targetUser) {
    throw new ApiError(404, "target user not found");
  }

  if (targetUser.id === user_id) {
    throw new ApiError(400, "cannot share with yourself");
  }

  return targetUser;
};

export const hasFolderAccess = async (folder_id: string, user_id: string) => {
  const result = await prisma.$queryRaw<{folder_id: string}[]>`
    WITH RECURSIVE folder_tree AS (
      select id, parent_id
      FROM "Folders"
      WHERE id = ${folder_id}

      UNION ALL

      SELECT f.id, f.parent_id 
      FROM "Folders" f
      INNER JOIN folder_tree ft ON f.id = ft.parent_id
    )
    SELECT sf.folder_id
    FROM "Shared_Folders" sf
    JOIN folder_tree ft ON sf.folder_id = ft.id
    WHERE sf.shared_with = ${user_id}
    AND sf.revoked = false
    LIMIT 1;
  `;
  return result.length > 0;
}
