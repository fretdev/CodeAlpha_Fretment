import { registerUser,loginUser,me } from "./auth.service.js";
import { Response,Request } from "express";

export const register = async (req: Request, res: Response)=>{
    try{
        const user = await registerUser(req.body)

        return res.status(201).json({
            message: "User registered successfully",
            user,
        })
    } catch (error){
      if(error instanceof Error && error.message === "Email already in use"){
        return res.status(409).json({
            message: error.message,
        })
      }
      return res.status(500).json({
        message: "Something went wrong"
      })
    }
}

export const login = async (req: Request,res: Response)=>{
    try{
        const result = await loginUser(req.body)

        return res.status(200).json({
            message: "Login successful",
            token: result.token,
            user: result.user
        })
    }catch(error){
        if(error instanceof Error && error.message === "Invalid email or password"){
            return res.status(401).json({
                message: error.message
            })
        }
        if(error instanceof Error && error.message === "JWT_SECRET is not configured"){
            return res.status(500).json({
                message: "Server authentication configuration is missing"
            })
        }

        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}

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