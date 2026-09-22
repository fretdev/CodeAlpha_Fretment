import Router from "express"
import { loginSchema, registerSchema } from "./auth.schema.js"
import { login, register,profile} from "./auth.controller.js"
import { validate } from "../../middleware/validate.js"
import { authenticate } from "../../middleware/auth.js"

const router = Router()

router.post("/register",
    validate(registerSchema),
    register
)

router.post("/login",
    validate(loginSchema),
    login
)

router.get("/me",
    authenticate,
    profile
)

export default router
