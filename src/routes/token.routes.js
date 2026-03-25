import express from 'express';
import { verifyJWT } from '../middleware/auth.middleware.js'; 

import * as tokenController from '../controllers/token.controller.js';

const tokenRouter = express.Router();

tokenRouter.post('/join/:queueId',verifyJWT,tokenController.joinQueueController)
tokenRouter.get('/queue/:queueId',verifyJWT,tokenController.getTokenController)
tokenRouter.patch('/call/:queueId',verifyJWT,tokenController.callNextTokenController)
tokenRouter.patch('/serve/:queueId',verifyJWT,tokenController.serveCurentTokenController)
tokenRouter.patch('/complete/:queueId',verifyJWT,tokenController.completeTokenController)
tokenRouter.patch('/:queueId/hold/:tokenId',verifyJWT,tokenController.holdSpecificTokenController)
tokenRouter.patch('/:queueId/serve-priority/:tokenId',verifyJWT,tokenController.serveSpecificTokenController)



export default tokenRouter;