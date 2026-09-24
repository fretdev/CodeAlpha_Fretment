import Router from "express"
import { authenticate } from "../../middleware/auth.js"
import { get,markRead,markUnread,markAllRead } from "./notifications.controller.js"

const router = Router()

router.get("/",
    authenticate,
    get
)

router.patch("/read-all",
    authenticate,
    markAllRead
)

router.patch("/:notificationId/read",
    authenticate,
    markRead
)

router.patch("/:notificationId/unread",
    authenticate,
    markUnread
)

export default router