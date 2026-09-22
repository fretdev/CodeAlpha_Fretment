import Router from "express"
import { authenticate } from "../../middleware/auth.js"
import { validate } from "../../middleware/validate.js"
import { addMember, create,deleteMember,getMembers,getProject,getProjects, removeProject, update } from "./projects.controller.js"
import { addMemberSchema, createProjectSchema, updateProjectSchema } from "./projects.schema.js"

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

router.get("/:id/members",
    authenticate,
    getMembers
)
router.post("/:id/members",
    authenticate,
    validate(addMemberSchema),
    addMember
)
router.delete("/:id/members/:userId",
    authenticate,
    deleteMember
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