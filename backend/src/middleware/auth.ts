import type { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken"

export const authenticate = (req: Request,res:Response,next:NextFunction)=>{
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({
            message: "Authentication required"
        })
    }

    const token = authHeader.split(" ")[1]

    if(!token){
        return res.status(401).json({
            message: "Authentication required"
        })
    }

    const jwtSecret = process.env.JWT_SECRET

    if(!jwtSecret){
        return res.status(500).json({
            message: "Server authentication configuration is missing"
        })
    }
    try {
        const payload = jwt.verify(token,jwtSecret)
        if(
            typeof payload !== "object" || payload === null || typeof payload.userId !== "number"
        ){
            return res.status(401).json({
                message: "Invalid authentication token"
            })
        }

        req.userId = payload.userId
        next()
    } catch{
        return res.status(401).json({
            message: "Invalid or expired authentication token"
        })
    }
}