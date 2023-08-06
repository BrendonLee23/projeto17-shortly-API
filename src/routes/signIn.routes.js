import { Router } from 'express';
import signUpSchema from '../schemas/signUpSchema.js';
import { validateSchema } from '../middlewares/validateSchema.middleware.js';
import { userLogin } from '../controllers/userController.js';

const signInRouter = Router();

signInRouter.post('/login', validateSchema(signUpSchema), userLogin);

export default signInRouter;