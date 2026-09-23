import prisma from "../../config/prisma.js";

type ProjectDetails = {
    ownerId: number;
    name: string;
    description?: string;
    color?: string;
}
type ProjectUpdateDetails = {
    projectId: number;
    userId: number;
    name?: string;
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

export const getUserProjects = async (userId:number)=>{
    const memberships = await prisma.projectMember.findMany({
        where: {
            userId
        },
        select: {
            role: true,
            project: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    color: true,
                    createdAt: true
                }
            }
        }
    })
    return memberships.map(({role,project})=>({
        ...project,
        role
    }))
}

export const getProjectById = async (projectId: number,userId:number)=>{
    const project = await prisma.project.findUnique({
        where: {
            id: projectId
        },
        select: {
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
                    avatarUrl: true
                }
            },
            members: {
                select:{
                    id: true,
                    role: true,
                    user: {
                        select:{
                            id: true,
                            username: true,
                            email: true,
                            avatarUrl: true
                        }
                    }
                }
            }
        }
    })

    if(!project){
        throw new Error("Project does not exist")
    }

    const membership = await prisma.projectMember.findUnique({
        where: {
            projectId_userId: {
                projectId,
                userId
            }
        }
    })
    if(!membership){
        throw new Error("You are not a member of this project")
    }
    return project
}

export const updateProject = async ({projectId,userId,name,description,color}:ProjectUpdateDetails)=>{
    const project = await prisma.project.findUnique({
        where: {
            id: projectId
        }
    })
    if(!project){
        throw new Error("Project does not exist")
    }

    const membership = await prisma.projectMember.findUnique({
        where: {
            projectId_userId:{
                projectId,
                userId
            }
        },
        select: {
            role: true
        }
    })

    if(!membership){
        throw new Error("You are not a member of this project")
    }
    if(membership.role !== "OWNER"){
        throw new Error("Only the project owner can update this project")
    }
    
    const updatedProject = await prisma.project.update({
        where: {
            id: projectId
        },
        data: {
            name,
            description,
            color
        },
        select: {
            id: true,
            name: true,
            description: true,
            color: true,
            createdAt: true,
            updatedAt: true
        }
    })
    return updatedProject
}

export const deleteProject = async (projectId: number,userId: number)=>{
    const project = await prisma.project.findUnique({
        where: {
            id: projectId
        }
    })

    if(!project){
        throw new Error("Project does not exist")
    }

    const membership = await prisma.projectMember.findUnique({
        where: {
            projectId_userId: {
                projectId,
                userId
            }
        },
        select: {
            role: true
        }
    })

    if(!membership){
        throw new Error("You are not a member of this project")
    }

    if(membership.role !== "OWNER"){
        throw new Error("Only the project owner can delete this project")
    }

     await prisma.project.delete({
        where: {
            id: projectId
        }
    })
}
