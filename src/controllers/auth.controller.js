import { signup,signin } from "../services/auth.services.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signupValidator,signinValidator } from "../validator/auth.validator.js";

export const signupCont = asyncHandler(async(req,res)=>{

    const   validatedData = signupValidator.parse(req.body);
    const   newUser = await signup(validatedData);

    res.status(201).json({
        success: true,
        message: "Welcome to Waitless! Account created successfully.",
        data: newUser
    })

})

export const signinCont = asyncHandler(async(req,res)=>{

    const validatedData = signinValidator.parse(req.body);
    const userToSignin = await signin(validatedData);
     res.status(201).json({
        success: true,
        message: "Login successfully.",
        data: userToSignin
    })
    
})