import prisma from "../../config/prisma.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

type RegisterInput = {
    username: string;
    email: string;
    password: string;
}

type LoginInput = {
    email: string;
    password: string;
}

export const registerUser = async ({
    username,email,password,
}:RegisterInput)=>{
    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    })

    if(existingUser) {
        throw new Error("Email already in use")
    }

    const passwordHash = await bcrypt.hash(password,12)

    const user = await prisma.user.create({
        data: {
            username,
            email,
            passwordHash
        },
        select: {
            id: true,
            username: true,
            email: true,
            avatarUrl: true,
            bio: true,
            createdAt: true,
        },
    })
    return user
}

export const loginUser = async ({email,password}: LoginInput) =>{
    const user = await prisma.user.findUnique({
        where: {
            email,
        }
    })

    if (!user){
        throw new Error("Invalid email or password")
    }

    const paswordMatches = await bcrypt.compare(password,user.passwordHash)

    if(!paswordMatches){
        throw new Error("Invalid email or password")
    }

    const jwtSecret = process.env.JWT_SECRET

    if(!jwtSecret){
        throw new Error("JWT_SECRET is not configured")
    }

    const token = jwt.sign(
        {userId: user.id},
        jwtSecret,
        {expiresIn: "1d"}
    )

    return{
        token,
        user: {
            id:user.id,
            username: user.username,
            email: user.email,
            avatarUrl: user.avatarUrl,
            bio:user.bio,
            createdAt: user.createdAt
        }
    }
}