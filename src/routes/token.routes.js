import express from 'express';
import { verifyJWT } from '../middleware/auth.middleware.js'; 

import * as tokenController from '../controllers/token.controller.js';

const tokenRouter = express.Router();

tokenRouter.post('/join/:queueId',verifyJWT,tokenController.joinQueueController)






export default tokenRouter;