import { Request, Response } from "express";
import { me } from "./users.service.js";


export const profile = async (req:Request,res:Response)=>{
    try{
        if(!req.userId){
            return res.status(401).json({
                message: "Authentication required"
            })
        }

        const result = await me(req.userId)

        return res.status(200).json({
            message: "Profile retrieved successfully",
            user: result
        })
    } catch(error){
        if(error instanceof Error && error.message === "User does not exist"){
            return res.status(404).json({
                message: error.message
            })
        }
        return res.status(500).json({
            message: "Something happened"
        })
    }
}