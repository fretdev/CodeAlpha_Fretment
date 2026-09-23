import Router from "express"
import { authenticate } from "../../middleware/auth.js"
import { validate } from "../../middleware/validate.js"
import { create,getProject,getProjects, removeProject, update } from "./projects.controller.js"
import { createProjectSchema, updateProjectSchema } from "./projects.schema.js"

const router = Router()

router.post("/",
    authenticate,
    validate(createProjectSchema),
    create
)
router.get("/",
    authenticate,
    getProjects
)

router.get("/:id",
    authenticate,
    getProject
)

router.patch("/:id",
    authenticate,
    validate(updateProjectSchema),
    update
)

router.delete("/:id",
    authenticate,
    removeProject
)


export default router