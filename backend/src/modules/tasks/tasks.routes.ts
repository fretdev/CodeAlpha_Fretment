import Router from "express"
import { create,getTask,getTasks,remove,update } from "./tasks.controller.js"
import { authenticate } from "../../middleware/auth.js"
import { validate } from "../../middleware/validate.js"
import { createTaskSchema,updateTaskSchema } from "./tasks.schema.js"

const router = Router()

router.post("/:projectId/tasks",
    authenticate,
    validate(createTaskSchema),
    create
)

router.get(
    "/:projectId/tasks",
    authenticate,
    getTasks
)

router.get("/:projectId/tasks/:taskId",
    authenticate,
    getTask
)

router.patch(
    "/:projectId/tasks/:taskId",
    authenticate,
    validate(updateTaskSchema),
    update
)

router.delete(
    "/:projectId/tasks/:taskId",
    authenticate,
    remove
)

export default router