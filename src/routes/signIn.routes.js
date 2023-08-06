import { Router } from 'express';
import signUpSchema from '../schemas/signUpSchema';
import { validateSchema } from '../middlewares/validateSchema.middleware';
import { userLogin } from '../controllers/userController';

const signInRouter = Router();

signInRouter.post('/login', validateSchema(signUpSchema), userLogin);

export default signInRouter;