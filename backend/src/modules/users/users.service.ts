import prisma from "../../config/prisma.js"


export const me = async (userId: number)=>{
    const user = await prisma.user.findUnique({
        where: {
          id: userId
        }
    })
    if(!user){
        throw new Error("User does not exist")
    }
    return{  
            id:user.id,
            username: user.username,
            email: user.email,
            avatarUrl: user.avatarUrl,
            bio: user.bio,
            createdAt: user.createdAt
    }
}