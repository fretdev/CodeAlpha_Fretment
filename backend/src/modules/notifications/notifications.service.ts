import prisma from "../../config/prisma.js"
import { NotificationType } from "../../generated/prisma/enums.js"
import { emitToUser } from "../sockets/socket.js"

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

    emitToUser(userId,"notification",notification)

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

export const markNotificationAsRead = async (notificationId:number,userId:number)=>{
    const notification = await prisma.notification.findFirst({
        where:{
            id:notificationId,
            userId
        }
    })

    if(!notification){
        throw new Error("Notification does not exist")
    }

    const updatedNotification = await prisma.notification.update({
        where:{
            id:notificationId
        },
        data: {
            isRead: true
        },
        select:{
            id: true,
            type: true,
            message: true,
            referenceId: true,
            isRead: true,
            createdAt: true,
            actor:{
                select:{
                    id:true,
                    username:true,
                    avatarUrl: true,
                }
            }
        }
    })

    return updatedNotification
}

export const markNotificationAsUnread = async (notificationId:number,userId:number)=>{
    const notification = await prisma.notification.findFirst({
        where:{
            id:notificationId,
            userId
        }
    })

    if(!notification){
        throw new Error("Notification does not exist")
    }

    const updatedNotification = await prisma.notification.update({
        where:{
            id:notificationId
        },
        data: {
            isRead: false
        },
        select:{
            id: true,
            type: true,
            message: true,
            referenceId: true,
            isRead: true,
            createdAt: true,
            actor:{
                select:{
                    id:true,
                    username:true,
                    avatarUrl: true,
                }
            }
        }
    })

    return updatedNotification
}

export const markAllNotificationAsRead = async (userId:number)=>{
    const result = await prisma.notification.updateMany({
        where: {
            userId
        },
        data:{
            isRead: true
        }
    })
    return result
}