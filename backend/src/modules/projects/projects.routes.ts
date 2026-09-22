import Router from "express"
import { authenticate } from "../../middleware/auth.js"
import { validate } from "../../middleware/validate.js"
import { create } from "./projects.controller.js"
import { createProjectSchema } from "./projects.schema.js"

const router = Router()

router.post("/",
    authenticate,
    validate(createProjectSchema),
    create
)

export default router