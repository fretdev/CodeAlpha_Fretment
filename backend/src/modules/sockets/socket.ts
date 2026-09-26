import { Server } from "socket.io"
import { Server as HttpServer } from "http"
import jwt from "jsonwebtoken"

let io: Server

export const initializeSocket = (server: HttpServer) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            credentials: true
        }
    })

    io.use((socket, next) => {
        const token = socket.handshake.auth.token

        if (!token) {
            return next(new Error("Authentication required"))
        }

        const jwtSecret = process.env.JWT_SECRET

        if (!jwtSecret) {
            return next(new Error("Server authentication configuration is missing"))
        }

        try {
            const payload = jwt.verify(token, jwtSecret)

            if (
                typeof payload !== "object" ||
                payload === null ||
                typeof payload.userId !== "number"
            ) {
                return next(new Error("Invalid authentication token"))
            }

            socket.data.userId = payload.userId

            next()
        } catch {
            next(new Error("Invalid or expired authentication token"))
        }
    })

    io.on("connection", (socket) => {
        console.log(`Socket connected: ${socket.id}`)
        console.log(`User connected: ${socket.data.userId}`)

        socket.join(`user:${socket.data.userId}`)

        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id}`)
        })
    })
}

export const emitToUser = (userId: number, event: string, data: unknown) => {
    io.to(`user:${userId}`).emit(event, data)
}