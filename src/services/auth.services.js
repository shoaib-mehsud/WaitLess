import bcrypt from 'bcryptjs';
import { prisma } from '../config/db.js';
import jwt from 'jsonwebtoken'


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

export async function signin(userCredential) {

    const { email, password } = userCredential;

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if(!user){
        const error = new Error ("Invalid Email");
        error.statusCode = 401;
        throw error;
    }

    const isPasswordCorrect = await bcrypt.compare(password,user.password);
    if(!isPasswordCorrect){
        const error = new Error ("Invalid Password");
        error.statusCode = 401;
        throw error;
    }

    const { password: _, ...safeUser } = user;
  
    const token = jwt.sign({id: user.id,role: user.userRole},process.env.JWT_SECRET,{expiresIn: "1d"});
    
    return {
        user: safeUser,
        token
    };
}