import { date, success } from "zod";
import * as tokenServices from "../services/token.services.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { joinQueueValidator } from "../validator/token.validator.js";
import { tr } from "zod/v4/locales";

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

export const getTokenController = asyncHandler(async(req,res)=>{
    const rawId = req.params.queueId;
    const parsed = joinQueueValidator.parse({queueId: rawId});
    const tokens = await tokenServices.getQueueTokens(parsed.queueId);
    res.status(201).json({
        success: true,
        Queue: tokens
    })

})

export const callNextTokenController = asyncHandler(async(req,res)=>{
    const rawId = req.params.queueId;
    const parsed = joinQueueValidator.parse({queueId: rawId});
    const tokenUpdated = await tokenServices.callNextToken(parsed.queueId);
    res.status(201).json({
        success: true,
        data: tokenUpdated
    })
})

export const serveCurentTokenController  = asyncHandler(async(req,res)=>{
    const rawId  = req.params.queueId;
    const parsed = joinQueueValidator.parse({queueId: rawId});
    const tokenServing = await tokenServices.serveCurentToken(parsed.queueId);
    res.status(201).json({
        success: true,
        data: tokenServing
    })
})