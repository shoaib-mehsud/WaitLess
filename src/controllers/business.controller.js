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

export const updateBusiness = asyncHandler(async(req,res)=>{
    const header = parseInt(req.params.id);

    const allowedFields = ["name"];
    const fieldsToUpdate = {};
    Object.keys(req.body).forEach((key)=>{
        if(allowedFields.includes(key)){
            fieldsToUpdate[key] = req.body[key];
        }
    });
    const validatedData = businessValidator.updateValidator.parse(fieldsToUpdate);

    const updateBusiness = await bussinessServices.updateBusiness(header,validatedData);
    res.json({
        message: "Business updated successfully",
        course: updateBusiness
    })

})