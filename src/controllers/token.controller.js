import * as tokenServices from "../services/token.services.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { joinQueueValidator } from "../validator/token.validator.js";

export const joinQueueController = asyncHandler(async(req,res)=>{

    const user = req.user;
    console.log("--------------------------------------------User",user);

    const rawId = req.params.queueId
    console.log("--------------------- raw ID: ",rawId);
    const parsed = joinQueueValidator.parse({queueId: rawId});
    const queueId = parsed.queueId;
    console.log("------------------  queueID: ",queueId);

    const userId = user.id;
    console.log("------------------ Userid", userId)
    const newToken = await tokenServices.joinQueue(queueId,userId);
    res.status(201).json({
        success: true,
        message: "Queue is joined successfully",
        data: newToken
    });



})