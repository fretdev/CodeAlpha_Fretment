import Router from "express"
import { authenticate } from "../../middleware/auth.js"
import { get } from "./notifications.controller.js"

const router = Router()

router.get("/",
    authenticate,
    get
)

export default router