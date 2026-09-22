import { Request,Response } from "express";
import { createProject,getUserProjects,getProjectById} from "./projects.service.js";


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

export const getProjects = async (req:Request,res:Response)=>{
    try{
        if(req.userId === undefined){
            return res.status(401).json({
                message: "Authentication required"
            })
        }

        const projects = await getUserProjects(req.userId)

        return res.status(200).json({
            projects
        })
    } catch(error){
        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}

export const getProject = async (req:Request,res:Response)=>{
    try{
        const projectId = Number(req.params.id)
        if(!Number.isInteger(projectId) || projectId <= 0){
            return res.status(400).json({
                message: "Invalid project ID"
            })
        }
        if(req.userId === undefined){
            return res.status(401).json({
                message: "Authentication required"
            })
        }

        const project = await getProjectById(projectId,req.userId)

        return res.status(200).json({
            project
        })
    }catch(error){
        if(error instanceof Error && error.message === "Project does not exist"){
            return res.status(404).json({
                message: error.message
            })
        }
        if(error instanceof Error && error.message === "You are not a member of this project"){
            return res.status(403).json({
                message: error.message
            })
        }
        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}