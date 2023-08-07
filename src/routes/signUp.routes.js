import { Router } from 'express';
import { validateSchema } from '../middlewares/validateSchema.middleware.js';
import signUpSchema from '../schemas/signUpSchema.js';
import { createUser, getUser } from '../controllers/userController.js';
import { validateToken } from '../middlewares/authSchema.middleware.js';


const userRouter = Router();

userRouter.post('/signup', validateToken, validateSchema(signUpSchema), createUser);

export default userRouter;