import { Router } from 'express';
import { validateToken } from '../middlewares/authSchema.middleware.js';
import validateURL from '../middlewares/urlSchema.middleware.js';
import { deleteNewUrl, getNewUrl, getUrl, insertURL } from '../controllers/urlsController.js';


const urlRouter = Router();

urlRouter.post('/urls/shorten', validateToken, validateURL, insertURL);
urlRouter.get('/urls/:id', getUrl);
urlRouter.get('/urls/open/:shortUrl', getNewUrl);
urlRouter.delete('/urls/:id', validateToken, deleteNewUrl);

export default urlRouter;