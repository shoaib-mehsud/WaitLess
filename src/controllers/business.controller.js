import * as bussinessServices from "../services/business.services.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as businessValidator from "../validator/business.validator.js";

export const createBusiness = asyncHandler (async(req,res)=>{
    console.log("--------------------A--------------------")
    const validatedData = businessValidator.createBusinessValidator.parse(req.body);
        console.log("--------------------B--------------------")

    const newBusiness =await bussinessServices.createBusiness(validatedData);

    res.status(201).json({
        success: true,
        message: "Business Created Successfully",
        business: newBusiness
    })
})

export const getBusiness = asyncHandler(async(req,res)=>{
    const header = parseInt(req.params.id);

    const businessToShow = await bussinessServices.getBusiness(header);

    res.status(201).json({
        success: true,
        message: "Business Details ",
        business:businessToShow
    })

})