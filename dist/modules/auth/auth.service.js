import bcrypt from 'bcrypt';
import { prisma } from '../../config/prisma.js';
import ApiError from '../../utils/ApiError.js';
import { generateToken } from '../../utils/jwt.js';
export const register = async (email, password, name) => {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        throw new ApiError(400, "Email already in use");
    }
    const password_hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            email,
            password_hash,
            name
        },
        select: {
            id: true,
            email: true,
            name: true,
            created_at: true
        }
    });
    return user;
};
export const login = async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new ApiError(401, "invalid credentials");
    }
    const ok = bcrypt.compare(password, user.password_hash);
    if (!ok) {
        throw new ApiError(401, "invalid credentials");
    }
    const token = generateToken(user.id);
    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.created_at
        },
        token
    };
};
//# sourceMappingURL=auth.service.js.map