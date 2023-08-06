import { Router } from 'express';
import { validateSchema } from '../middlewares/validateSchema.middleware';
import signUpSchema from '../schemas/signUpSchema';
import { createUser, getUser } from '../controllers/userController';
import { validateToken } from '../middlewares/authSchema.middleware';


const userRouter = Router();

userRouter.post('/users', validateSchema(signUpSchema), createUser);
userRouter.get('/users', validateToken, getUser);

export default userRouter;