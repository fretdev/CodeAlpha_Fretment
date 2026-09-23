import Router from "express"
import { authenticate } from "../../middleware/auth.js"
import { validate } from "../../middleware/validate.js"
import { createCommentSchema,updateCommentSchema } from "./comments.schema.js"
import { create,get,update,remove } from "./comments.controller.js"

const router = Router()

router.post(
    "/:projectId/tasks/:taskId/comments",
    authenticate,
    validate(createCommentSchema),
    create
)

router.get(
    "/:projectId/tasks/:taskId/comments",
    authenticate,
    get
)

router.patch(
    "/:projectId/tasks/:taskId/comments/:commentId",
    authenticate,
    validate(updateCommentSchema),
    update
)

router.delete(
    "/:projectId/tasks/:taskId/comments/:commentId",
    authenticate,
    remove
)

export default router