import Router from "express"
import { profile } from "./users.controller.js"
import { authenticate } from "../../middleware/auth.js"

const router = Router()


router.get("/me",
    authenticate,
    profile
)


export default router