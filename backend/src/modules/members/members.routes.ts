import Router from "express"
import { authenticate } from "../../middleware/auth.js"
import { validate } from "../../middleware/validate.js"
import { addMemberSchema } from "./members.schema.js"
import { getMembers,addMember,deleteMember } from "./members.controller.js"

const router = Router()

router.get("/:projectId/members",
    authenticate,
    getMembers
)
router.post("/:projectId/members",
    authenticate,
    validate(addMemberSchema),
    addMember
)
router.delete("/:projectId/members/:userId",
    authenticate,
    deleteMember
)

export default router