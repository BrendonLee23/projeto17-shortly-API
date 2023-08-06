import { Router } from "express";
import signInRouter from "./signIn.routes.js";
import userRouter from "./signUp.routes.js";
import urlRouter from "./urls.routes.js";


const router = Router()
router.use(signInRouter)
router.use(userRouter)
router.use(urlRouter)

export default router;
