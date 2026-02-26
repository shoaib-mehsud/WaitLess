import bcrypt from 'bcrypt';
import { prisma } from '../config/db.js';



export async function signup(userData) {
    const { name, email, password, userRole } = userData

    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        throw new Error("A user with this email already exist.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            userRole: userRole
        },
        select: {
            id: true,
            name: true,
            email: true,
            userRole: true,
            createdAt: true
        }

    });

    return newUser;
}