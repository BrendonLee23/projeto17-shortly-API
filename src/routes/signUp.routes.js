import { Router } from 'express';
import { validateSchema } from '../middlewares/validateSchema.middleware.js';
import signUpSchema from '../schemas/signUpSchema.js';
import { createUser } from '../controllers/userController.js';


const userRouter = Router();

userRouter.post('/signup', validateSchema(signUpSchema), createUser);

export default userRouter;