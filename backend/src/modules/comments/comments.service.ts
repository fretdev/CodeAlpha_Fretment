import prisma from "../../config/prisma.js"
import { createNotification } from "../notifications/notifications.service.js"
import { NotificationType } from "../../generated/prisma/enums.js"

export const createComment = async (
    projectId: number,
    userId: number,
    taskId: number,
    content: string
) => {
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

    const comment = await prisma.comment.create({
        data: {
            content,
            taskId,
            authorId: userId
        },
        select: {
            id: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            author: {
                select: {
                    id: true,
                    username: true,
                    email: true,
                    avatarUrl: true
                }
            }
        }
    })

    const previouscomments = await prisma.comment.findMany({
        where:{
            taskId,
            authorId: {
                not: userId
            }
        },
        select:{
            authorId: true
        },
        distinct:["authorId"]
    })

    const recipientsIds = new Set<number>()

    if(task.creatorId !== userId){
        recipientsIds.add(task.creatorId)
    }
    if(task.assigneeId && task.assigneeId !== userId){
        recipientsIds.add(task.assigneeId)
    }

    for (const previouscomment of previouscomments){
        recipientsIds.add(previouscomment.authorId)
    }

    await Promise.all([...recipientsIds].map(recipientId =>
        createNotification({
            type: NotificationType.COMMENT_ADDED,
            message: `${comment.author.username} commented on "${task.title}"`,
            referenceId: comment.id,
            userId: recipientId,
            actorId: userId
        })
    ))
    return comment
}

export const getComments = async (projectId:number,userId:number,taskId:number)=>{
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

    const task = await prisma.task.findFirst({
        where:{
            id:taskId,
            projectId
        }
    })
    if(!task){
        throw new Error("Task does not exist")
    }

    const comments = await prisma.comment.findMany({
        where:{
            taskId
        },
         select: {
            id: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            author: {
                select: {
                    id: true,
                    username: true,
                    email: true,
                    avatarUrl: true
                }
            }
        },
        orderBy:{
            createdAt:"asc"
        }
    })
    return comments
}

export const updateComment = async (
    projectId: number,
    userId: number,
    taskId: number,
    commentId: number,
    content: string
) => {
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

    const comment = await prisma.comment.findFirst({
        where: {
            id: commentId,
            taskId
        }
    })

    if (!comment) {
        throw new Error("Comment does not exist")
    }

    if (comment.authorId !== userId) {
        throw new Error("You can only edit your own comment")
    }

    const updatedComment = await prisma.comment.update({
        where: {
            id: commentId
        },
        data: {
            content
        },
        select: {
            id: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            author: {
                select: {
                    id: true,
                    username: true,
                    email: true,
                    avatarUrl: true
                }
            }
        }
    })

    return updatedComment
}
export const deleteComment = async (
    projectId: number,
    userId: number,
    taskId: number,
    commentId: number
) => {
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

    const comment = await prisma.comment.findFirst({
        where: {
            id: commentId,
            taskId
        }
    })

    if (!comment) {
        throw new Error("Comment does not exist")
    }

    if (comment.authorId !== userId) {
        throw new Error("You can only delete your own comment")
    }

    await prisma.comment.delete({
        where: {
            id: commentId
        }
    })
}