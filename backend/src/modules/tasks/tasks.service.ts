import { title } from "node:process";
import prisma from "../../config/prisma.js";

type CreateTaskDetails  = {
    projectId: number;
    creatorId: number;
    title: string;
    description?: string;
    dueDate: string;
    assigneeId?: number;
}

export const createTask = async ({projectId,creatorId,title,description,dueDate,assigneeId}: CreateTaskDetails)=>{
    const project = await prisma.project.findUnique({
        where: {
            id: projectId
        }
    })

    if(!project){
        throw new Error("Project does not exist")
    }

    const creatorMembership = await prisma.projectMember.findUnique({
        where: {
            projectId_userId:{
                projectId,
                userId: creatorId
            }
        }
    })

    if(!creatorMembership){
        throw new Error("You are not a member of this project")
    }
    if(assigneeId !== undefined){
        const assignee = await prisma.user.findUnique({
            where: {
                id: assigneeId
            }
        })

        if(!assignee){
            throw new Error("Assignee does not exist")
        }

        const assigneeMemebership = await prisma.projectMember.findUnique({
            where:{
                projectId_userId:{
                    projectId,
                    userId: assigneeId
                }
            }
        })

        if(!assigneeMemebership){
            throw new Error("Assignee is not a member of this project")
        }
    }

   const task = await prisma.task.create({
    data:{
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        projectId,
        creatorId,
        assigneeId
    },
    select: {
        id:true,
        title: true,
        description: true,
        status: true,
        priority: true,
        dueDate: true,
        createdAt: true,
        updatedAt: true,
        projectId: true,
        creator: {
            select: {
                id: true,
                username: true,
                email: true,
                avatarUrl: true,
            }
        },
        assignee: {
            select: {
                id: true,
                username: true,
                email: true,
                avatarUrl: true
            }
        }
    }
   })
   return task
}

export const getProjectTasks = async(projectId: number,userId:number)=>{
    const project = await prisma.project.findUnique({
        where:{
            id:projectId
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

    const tasks = await prisma.task.findMany({
        where: {
            projectId
        },
        select: {
            id: true,
            title: true,
            description: true,
            status:true,
            priority: true,
            dueDate: true,
            createdAt: true,
            updatedAt: true,
            projectId: true,
            creator:{
                select: {
                    id: true,
                    username: true,
                    email: true,
                    avatarUrl: true
                }
            },
            assignee: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        avatarUrl: true
                    }
                }
        },
        orderBy: {
            createdAt: "desc"
        }
    })
    return tasks
}

export const getTaskById = async(projectId:number,taskId:number,userId:number)=>{
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
        }
    })
    if(!membership){
        throw new Error("You are not a member of this project")
    }

    const task = await prisma.task.findFirst({
        where: {
            id: taskId,
            projectId
        },
        select:{
             id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            dueDate: true,
            createdAt: true,
            updatedAt: true,
            projectId: true,
            creator: {
                select: {
                    id: true,
                    username: true,
                    email: true,
                    avatarUrl: true
                }
            },
            assignee: {
                select: {
                    id: true,
                    username: true,
                    email: true,
                    avatarUrl: true
                }
            }
        }
    })
    if(!task){
        throw new Error("Task does not exist")
    }
    return task
}

type UpdateTaskDetails = {
    projectId: number
    taskId: number
    userId: number
    title?: string
    description?: string
    status?: "TODO" | "IN_PROGRESS" | "DONE"
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
    dueDate?: string
    assigneeId?: number
}

export const updateTask = async ({
    projectId,
    taskId,
    userId,
    title,
    description,
    status,
    priority,
    dueDate,
    assigneeId
}: UpdateTaskDetails) => {
    const project = await prisma.project.findUnique({
        where: {
            id: projectId
        }
    })

    if (!project) {
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

    if (!membership) {
        throw new Error("You are not a member of this project")
    }

    const task = await prisma.task.findFirst({
        where: {
            id: taskId,
            projectId
        }
    })

    if (!task) {
        throw new Error("Task does not exist")
    }

    if (assigneeId !== undefined) {
        const assignee = await prisma.user.findUnique({
            where: {
                id: assigneeId
            }
        })

        if (!assignee) {
            throw new Error("Assignee does not exist")
        }

        const assigneeMembership = await prisma.projectMember.findUnique({
            where: {
                projectId_userId: {
                    projectId,
                    userId: assigneeId
                }
            }
        })

        if (!assigneeMembership) {
            throw new Error("Assignee is not a member of this project")
        }
    }

    const updatedTask = await prisma.task.update({
        where: {
            id: taskId
        },
        data: {
            title,
            description,
            status,
            priority,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            assigneeId
        },
        select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            dueDate: true,
            createdAt: true,
            updatedAt: true,
            projectId: true,
            creator: {
                select: {
                    id: true,
                    username: true,
                    email: true,
                    avatarUrl: true
                }
            },
            assignee: {
                select: {
                    id: true,
                    username: true,
                    email: true,
                    avatarUrl: true
                }
            }
        }
    })

    return updatedTask
}