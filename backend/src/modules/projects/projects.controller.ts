import { Request,Response } from "express";
import { createProject } from "./projects.service.js";


export const create = async (req:Request,res:Response)=>{
    try{
        const {name,description,color} = req.body
        const ownerId = req.userId
        if(ownerId === undefined){
            return res.status(401).json({
                message: "Authentication required"
            })
        }
        const project = await createProject({ownerId,name,description,color})

        
        return res.status(201).json({
            message: "Project created successfully",
            project
        })
    }catch(error){
        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}