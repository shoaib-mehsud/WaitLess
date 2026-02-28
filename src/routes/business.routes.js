import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {  createBusiness,getBusiness  } from '../controllers/business.controller.js'


const businessRouter = express.Router();
businessRouter.post('/',verifyJWT,createBusiness);
businessRouter.get('/:id',getBusiness)

export default businessRouter;