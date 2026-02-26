import express from 'express'
import { signupCont } from '../controllers/auth.controller.js'


const authRouter = express.Router();

authRouter.post('/signup',signupCont)









export default authRouter;