import * as tokenServices from "../services/token.services.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { joinQueueValidator,serveSpecificTokenValidator } from "../validator/token.validator.js";

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

export const completeTokenController = asyncHandler(async(req,res)=>{

    const rawId  = req.params.queueId;
    const parsed = joinQueueValidator.parse({queueId: rawId});
    const tokenIsCompleted = await tokenServices.completeToken(parsed.queueId);
    res.status(201).json({
        success: true,
        data: tokenIsCompleted
    })
})


export const holdSpecificTokenController = asyncHandler(async(req,res)=>{

    const rawData  = req.params;
    const parsed = serveSpecificTokenValidator.parse(rawData);
    const {queueId,tokenId} = parsed;
    const tokenHeld = await tokenServices.holdSpecificToken(queueId,tokenId);
    res.status(201).json({
        success: true,
        data: tokenHeld
    })
})
export const serveSpecificTokenController = asyncHandler(async(req,res)=>{

    const rawData  = req.params;
    const parsed = serveSpecificTokenValidator.parse(rawData);
    const {queueId,tokenId} = parsed;
    const tokenIsCompleted = await tokenServices.serveSpecificToken(queueId,tokenId);
    res.status(201).json({
        success: true,
        data: tokenIsCompleted
    })
})