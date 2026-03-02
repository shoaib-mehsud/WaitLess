import express from 'express';
import { verifyJWT } from '../middleware/auth.middleware.js';
import * as  queueController  from '../controllers/queue.controller.js';

const queueRouter = express.Router();
queueRouter.post('/',verifyJWT,queueController.createQueue);
queueRouter.get('/business/:businessid',queueController.getBusinessQueues);
queueRouter.patch('/:id/status',verifyJWT,queueController.updateQueueStatus);

// assign manager
queueRouter.post('/:id/manager', verifyJWT, queueController.assignManager);
// get queue with managers
queueRouter.get('/:id/managers', verifyJWT, queueController.getQueueManagers);
//remove manager
queueRouter.delete('/:id/managers/:userId', verifyJWT, queueController.removeManager);
//delete a queue
queueRouter.delete('/:id',verifyJWT,queueController.deleteQueue);

export default queueRouter;
