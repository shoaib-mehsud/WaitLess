import * as businessServices from "../services/business.services.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as businessValidator from "../validator/business.validator.js";
import { prisma } from "../config/db.js";



export const createBusiness = asyncHandler (async(req,res)=>{
    console.log("--------------------A--------------------")
    const validatedData = businessValidator.createBusinessValidator.parse(req.body);
        console.log("--------------------B--------------------")

    const newBusiness =await businessServices.createBusiness(validatedData);

    res.status(201).json({
        success: true,
        message: "Business Created Successfully",
        business: newBusiness
    })
})

export const getBusiness = asyncHandler(async(req,res)=>{
    const header = parseInt(req.params.id);

    const businessToShow = await businessServices.getBusiness(header);

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

    const updateBusiness = await businessServices.updateBusiness(header,validatedData);
    res.json({
        message: "Business updated successfully",
        course: updateBusiness
    })

})

export const deleteBusiness = asyncHandler(async (req, res) => {
    
    const businessId = Number(req.params.id);
    const actorId = req.user.id; // This is the 'id' decrypted from your JWT

    //  Fetch the Business to check who the real owner is
    const business = await prisma.business.findUnique({
        where: { id: businessId },
        select: { ownerId: true } 
    });

    if (!business) {
        return res.status(404).json({ success: false, message: "Business not found" });
    }

    //  Ownership Check
    if (business.ownerId !== actorId) {
        return res.status(403).json({ 
            success: false, 
            message: "Permission Denied: You are not the owner of this business." 
        });
    }

    const businessToDelete = await businessServices.deleteBusiness(businessId);

    res.status(200).json({
        success: true,
        message: "Business deleted successfully by its owner."
    });
    return businessToDelete;
});