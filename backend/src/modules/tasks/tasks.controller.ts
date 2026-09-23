import { Request,Response } from "express"
import { createTask,getProjectTasks,getTaskById,updateTask,deleteTask} from "./tasks.service.js"

export const create = async(req:Request,res:Response)=>{
    try{
        const projectId = Number(req.params.projectId)
        const creatorId = req.userId
        const {title,description,dueDate,assigneeId}= req.body
        
        if(!Number.isInteger(projectId) || projectId <=0){
            return res.status(400).json({
                message: "Invalid project ID"
            })
        }
        if(creatorId === undefined){
            return res.status(401).json({
                message: "Authentication required"
            })
        }

        const task = await createTask({projectId,creatorId,title,description,dueDate,assigneeId})

        return res.status(201).json({
            message: "Task created successfully",
            task
        })
    } catch(error){
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
        if(error instanceof Error && error.message === "Assignee does not exist"){
            return res.status(404).json({
                message: error.message
            })
        }
        if(error instanceof Error && error.message === "Assignee is not a member of this project"){
            return res.status(403).json({
                message: error.message
            })
        }

        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}

export const getTasks = async (req: Request, res: Response) => {
    try {
        const projectId = Number(req.params.projectId)
        const userId = req.userId

        if (!Number.isInteger(projectId) || projectId <= 0) {
            return res.status(400).json({
                message: "Invalid project ID"
            })
        }

        if (userId === undefined) {
            return res.status(401).json({
                message: "Authentication required"
            })
        }

        const tasks = await getProjectTasks(projectId, userId)

        return res.status(200).json({
            tasks
        })
    } catch (error) {
        if (error instanceof Error && error.message === "Project does not exist") {
            return res.status(404).json({
                message: error.message
            })
        }

        if (error instanceof Error && error.message === "You are not a member of this project") {
            return res.status(403).json({
                message: error.message
            })
        }

        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}

export const getTask = async (req: Request, res: Response) => {
    try {
        const projectId = Number(req.params.projectId)
        const taskId = Number(req.params.taskId)
        const userId = req.userId

        if (!Number.isInteger(projectId) || projectId <= 0) {
            return res.status(400).json({
                message: "Invalid project ID"
            })
        }

        if (!Number.isInteger(taskId) || taskId <= 0) {
            return res.status(400).json({
                message: "Invalid task ID"
            })
        }

        if (userId === undefined) {
            return res.status(401).json({
                message: "Authentication required"
            })
        }

        const task = await getTaskById(projectId, taskId, userId)

        return res.status(200).json({
            task
        })
    } catch (error) {
        if (error instanceof Error && error.message === "Project does not exist") {
            return res.status(404).json({
                message: error.message
            })
        }

        if (error instanceof Error && error.message === "You are not a member of this project") {
            return res.status(403).json({
                message: error.message
            })
        }

        if (error instanceof Error && error.message === "Task does not exist") {
            return res.status(404).json({
                message: error.message
            })
        }

        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}

export const update = async (req: Request, res: Response) => {
    try {
        const projectId = Number(req.params.projectId)
        const taskId = Number(req.params.taskId)
        const userId = req.userId

        if (!Number.isInteger(projectId) || projectId <= 0) {
            return res.status(400).json({
                message: "Invalid project ID"
            })
        }

        if (!Number.isInteger(taskId) || taskId <= 0) {
            return res.status(400).json({
                message: "Invalid task ID"
            })
        }

        if (userId === undefined) {
            return res.status(401).json({
                message: "Authentication required"
            })
        }

        const task = await updateTask({
            projectId,
            taskId,
            userId,
            ...req.body
        })

        return res.status(200).json({
            message: "Task updated successfully",
            task
        })
    } catch (error) {
        if (error instanceof Error && error.message === "Project does not exist") {
            return res.status(404).json({
                message: error.message
            })
        }

        if (error instanceof Error && error.message === "You are not a member of this project") {
            return res.status(403).json({
                message: error.message
            })
        }

        if (error instanceof Error && error.message === "Task does not exist") {
            return res.status(404).json({
                message: error.message
            })
        }

        if (error instanceof Error && error.message === "Assignee does not exist") {
            return res.status(404).json({
                message: error.message
            })
        }

        if (error instanceof Error && error.message === "Assignee is not a member of this project") {
            return res.status(403).json({
                message: error.message
            })
        }

        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}

export const remove = async (req: Request, res: Response) => {
    try {
        const projectId = Number(req.params.projectId)
        const taskId = Number(req.params.taskId)
        const userId = req.userId

        if (!Number.isInteger(projectId) || projectId <= 0) {
            return res.status(400).json({
                message: "Invalid project ID"
            })
        }

        if (!Number.isInteger(taskId) || taskId <= 0) {
            return res.status(400).json({
                message: "Invalid task ID"
            })
        }

        if (userId === undefined) {
            return res.status(401).json({
                message: "Authentication required"
            })
        }

        await deleteTask(projectId, taskId, userId)

        return res.status(200).json({
            message: "Task deleted successfully"
        })
    } catch (error) {
        if (error instanceof Error && error.message === "Project does not exist") {
            return res.status(404).json({
                message: error.message
            })
        }

        if (error instanceof Error && error.message === "You are not a member of this project") {
            return res.status(403).json({
                message: error.message
            })
        }

        if (error instanceof Error && error.message === "Task does not exist") {
            return res.status(404).json({
                message: error.message
            })
        }

        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}