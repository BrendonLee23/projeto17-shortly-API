import { Router } from 'express';
import { validateSchema } from '../middlewares/validateSchema.middleware.js';
import { getUser, userLogin } from '../controllers/userController.js';
import signInSchema from '../schemas/signInSchema.js';
import { validateToken } from '../middlewares/authSchema.middleware.js';

const signInRouter = Router();

signInRouter.post('/signin', validateSchema(signInSchema), userLogin);
signInRouter.get('/users/me', validateToken, getUser);
/* signInRouter.get('/users', getUser); */

export default signInRouter;