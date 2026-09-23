import prisma from "../../config/prisma.js";


type AddMemberDetails = {
    projectId: number;
    userId: number;
    email: string;
}

export const getProjectMembers = async (projectId: number,userId:number)=>{
    const project = await prisma.project.findUnique({
        where:{
            id: projectId
        }
    })

    if(!project){
        throw new Error("Project does not exist")
    }

    const membership = await prisma.projectMember.findUnique({
        where:{
            projectId_userId:{
                projectId,
                userId
            }
        }
    })

    if(!membership){
        throw new Error("You are not a member of this project")
    }

    const members = await prisma.projectMember.findMany({
        where: {
            projectId
        },
        select: {
            id: true,
            role:true,
            joinedAt: true,
            user: {
                select:{
                    id: true,
                    username: true,
                    email:true,
                    avatarUrl: true
                }
            }
        }
    })
    return members
}

export const addProjectMember = async ({projectId,userId,email}:AddMemberDetails)=>{
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
        throw new Error("Only the project owner can add members")
    }

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if(!user){
        throw new Error("User does not exist")
    }

    const existingMember = await prisma.projectMember.findUnique({
        where:{
            projectId_userId: {
                projectId,
                userId: user.id
            }
        }
    })

    if(existingMember){
        throw new Error("User is already a member of this project")
    }

    const member = await prisma.projectMember.create({
        data:{
            projectId,
            userId: user.id,
            role: "MEMBER"
        },
        select: {
            id:true,
            role: true,
            joinedAt: true,
            user:{
                select:{
                    id:true,
                    username:true,
                    email:true,
                    avatarUrl:true
                }
            }
        }
    })

    return member
}

export const removeProjectMember = async (projectId:number,userId:number,targetUserId:number)=>{
    const project = await prisma.project.findUnique({
        where: {
            id: projectId
        }
    })
    if(!project){
        throw new Error("Project does not exist")
    }

    const membership = await prisma.projectMember.findUnique({
        where:{
            projectId_userId: {
                projectId,
                userId
            }
        },
        select:{
            role: true
        }
    })

    if(!membership){
        throw new Error("You are not a member of this project")
    }
    
    if(membership.role !== "OWNER"){
        throw new Error("Only the project owner can remove members")
    }

    const targetMember = await prisma.projectMember.findUnique({
        where: {
            projectId_userId: {
                projectId,
                userId: targetUserId
            }
        },
        select:{
            id: true,
            role:true
        }
    })

    if(!targetMember){
        throw new Error("User is not a member of this project")
    }

    if(targetMember.role === "OWNER"){
        throw new Error("Project owner cannot be removed")
    }

    await prisma.projectMember.delete({
        where: {
            id: targetMember.id
        }
    })
}