import prisma from "../../config/prisma.js"
import { NotificationType } from "../../generated/prisma/enums.js"

type CreateNotificationDetails = {
    type: NotificationType;
    message: string;
    referenceId?: number;
    userId: number;
    actorId?: number;
}

export const createNotification = async({type,message,referenceId,userId,actorId}:CreateNotificationDetails)=>{
    const notification = await prisma.notification.create({
        data: {
            type,
            message,
            referenceId,
            userId,
            actorId
        }
    })

    return notification
}

export const getNotifications = async (userId:number)=>{
    const notifications = await prisma.notification.findMany({
        where:{
            userId
        },
        select: {
            id: true,
            type: true,
            message: true,
            referenceId: true,
            isRead: true,
            createdAt: true,
            actor: {
                select: {
                    id: true,
                    username: true,
                    avatarUrl: true
                }
            }
        },
        orderBy:{
            createdAt: "desc"
        }
    })
    return notifications
}