import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {  createBusiness,getBusiness,updateBusiness  } from '../controllers/business.controller.js'


const businessRouter = express.Router();
businessRouter.post('/',verifyJWT,createBusiness);
businessRouter.get('/:id',getBusiness);
businessRouter.patch('/:id',verifyJWT,updateBusiness)

export default businessRouter;