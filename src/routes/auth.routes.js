import express from 'express'
import { signupCont,signinCont } from '../controllers/auth.controller.js'


const authRouter = express.Router();

authRouter.post('/signup',signupCont)
authRouter.post('/signin',signinCont)








export default authRouter;