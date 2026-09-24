import { Request,Response } from "express"
import { getNotifications } from "./notifications.service.js"


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