import express from "express"
import cors from "cors"
import authRoutes from "./modules/auth/auth.routes.js"
import usersRoutes from "./modules/users/users.routes.js"
import projectRoutes from "./modules/projects/projects.routes.js"
import membersRoutes from "./modules/members/members.routes.js"
import tasksRoutes from "./modules/tasks/tasks.routes.js"
import commentsRoutes from "./modules/comments/comments.routes.js"

const app = express()

app.use(cors())

app.use(express.json())


app.get("/api/health",(req,res)=>{
    res.json({
        status: "ok"
    })
})

app.use("/api/auth",authRoutes)

app.use("/api/users",usersRoutes)

app.use("/api/projects",projectRoutes)

app.use("/api/projects",membersRoutes)

app.use("/api/projects",tasksRoutes)

app.use("/api/projects", commentsRoutes)

export default app