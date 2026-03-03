import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import * as businessController from '../controllers/business.controller.js'


const businessRouter = express.Router();
businessRouter.post('/',verifyJWT,businessController.createBusiness);
businessRouter.get('/:id',businessController.getBusiness);
businessRouter.patch('/:id',verifyJWT,businessController.updateBusiness)
businessRouter.delete('/:id', verifyJWT, businessController.deleteBusiness);

export default businessRouter;