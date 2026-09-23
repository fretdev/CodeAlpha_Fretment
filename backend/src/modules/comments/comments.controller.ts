import { Request,Response } from "express"
import { createComment,getComments,updateComment,deleteComment } from "./comments.service.js"

export const create = async (req: Request, res: Response) => {
    try {
        const projectId = Number(req.params.projectId)
        const taskId = Number(req.params.taskId)
        const userId = req.userId
        const { content } = req.body

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

        const comment = await createComment(
            projectId,
            userId,
            taskId,
            content
        )

        return res.status(201).json({
            message: "Comment created successfully",
            comment
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

export const get = async (req: Request, res: Response) => {
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

        const comments = await getComments(
            projectId,
            userId,
            taskId
        )

        return res.status(200).json({
            comments
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
        const commentId = Number(req.params.commentId)
        const userId = req.userId
        const { content } = req.body

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

        if (!Number.isInteger(commentId) || commentId <= 0) {
            return res.status(400).json({
                message: "Invalid comment ID"
            })
        }

        if (userId === undefined) {
            return res.status(401).json({
                message: "Authentication required"
            })
        }

        const comment = await updateComment(
            projectId,
            userId,
            taskId,
            commentId,
            content
        )

        return res.status(200).json({
            message: "Comment updated successfully",
            comment
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

        if (error instanceof Error && error.message === "Comment does not exist") {
            return res.status(404).json({
                message: error.message
            })
        }

        if (error instanceof Error && error.message === "You can only edit your own comment") {
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
        const commentId = Number(req.params.commentId)
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

        if (!Number.isInteger(commentId) || commentId <= 0) {
            return res.status(400).json({
                message: "Invalid comment ID"
            })
        }

        if (userId === undefined) {
            return res.status(401).json({
                message: "Authentication required"
            })
        }

        await deleteComment(
            projectId,
            userId,
            taskId,
            commentId
        )

        return res.status(200).json({
            message: "Comment deleted successfully"
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

        if (error instanceof Error && error.message === "Comment does not exist") {
            return res.status(404).json({
                message: error.message
            })
        }

        if (error instanceof Error && error.message === "You can only delete your own comment") {
            return res.status(403).json({
                message: error.message
            })
        }

        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}