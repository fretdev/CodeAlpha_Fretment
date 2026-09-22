import prisma from "../../config/prisma.js";

type ProjectDetails = {
    ownerId: number;
    name: string;
    description?: string;
    color?: string;
}

export const createProject = async ({ownerId,name,description,color}:ProjectDetails)=>{
    const project = await prisma.project.create({
        data: {
            name,
            description,
            color,
            ownerId,
            members:{
                create: {
                    userId: ownerId,
                    role: "OWNER"
                }
            }
        },
        select:{
            id: true,
            name: true,
            description: true,
            color: true,
            createdAt: true,
            owner: {
                select: {
                    id: true,
                    username: true,
                    email: true,
                    avatarUrl: true,
                }
            },
            members: {
                select: {
                    id:true,
                    role: true,
                    user: {
                        select: {
                            id: true,
                            username: true,
                            email: true,
                            avatarUrl: true,
                        }
                    }
                }
            }

        }
        }
    )
    return project
}