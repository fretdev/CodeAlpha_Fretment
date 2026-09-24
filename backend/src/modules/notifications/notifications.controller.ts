import { Request,Response } from "express"
import { getNotifications, markAllNotificationAsRead, markNotificationAsRead, markNotificationAsUnread } from "./notifications.service.js"


export const get = async(req:Request,res:Response)=>{
    try{
        if(req.userId === undefined){
            return res.status(401).json({
                message: "Authentication required"
            })
        }
        const notifications = await getNotifications(req.userId)

        res.status(200).json({
            notifications
        })
    } catch(error){
        res.status(500).json({
            message: "Something went wrong"
        })
    }
}

export const markRead = async (req:Request,res:Response)=>{
    try{
        const notificationId = Number(req.params.notificationId)
        if(!Number.isInteger(notificationId) || notificationId <= 0){
            return res.status(400).json({
                message: "Invalid notification ID"
            })
        }
        if(req.userId === undefined){
            return res.status(401).json({
                message: "Authentication required"
            })
        }
        
        const result = await markNotificationAsRead(notificationId,req.userId)
        
        return res.status(200).json({
            notification:result
        })
    } catch(error){
        if(error instanceof Error && error.message === "Notification does not exist"){
            return res.status(404).json({
                message: error.message
            })
        }
        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}

export const markUnread = async (req:Request,res:Response)=>{
    try{
        const notificationId = Number(req.params.notificationId)
        if(!Number.isInteger(notificationId) || notificationId <= 0){
            return res.status(400).json({
                message: "Invalid notification ID"
            })
        }
        if(req.userId === undefined){
            return res.status(401).json({
                message: "Authentication required"
            })
        }

        const result = await markNotificationAsUnread(notificationId,req.userId)

        return res.status(200).json({
            notification:result
        })

    } catch(error){
        if(error instanceof Error && error.message === "Notification does not exist"){
            return res.status(404).json({
                message: error.message
            })
        }
        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}

export const markAllRead = async (req:Request,res:Response)=>{
    try{
        if(req.userId === undefined){
            return res.status(401).json({
                message: "Authentication required"
            })
        }

        const result = await markAllNotificationAsRead(req.userId)

        return res.status(200).json({
            count:result.count
        })
    } catch(error){
        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}