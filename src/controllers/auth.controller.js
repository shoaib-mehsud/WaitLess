import { signup } from "../services/auth.services.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signupValidator } from "../validator/auth.validator.js";

export const signupCont = asyncHandler(async(req,res)=>{

    const   validatedData = signupValidator.parse(req.body);
    const   newUser = await signup(validatedData);

    res.status(201).json({
        success: true,
        message: "Welcome to Waitless! Account created successfully.",
        data: newUser
    })

})