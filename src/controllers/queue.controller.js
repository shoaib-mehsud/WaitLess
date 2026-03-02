import * as queueServices from '../services/queue.services.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as queueValidator from '../validator/queue.validator.js';
import { prisma } from "../config/db.js";

export const createQueue = asyncHandler(async(req,res)=>{

    const validatedData = queueValidator.queueCreationValid.parse(req.body);
    const queueToCreate = await queueServices.createQueue(validatedData);
    res.status(201).json({
        success: true,
        message: "Queue Created Successfully",
        queue: queueToCreate
    });
    
})

export const getBusinessQueues = asyncHandler(async(req, res) => {

    const { businessid } = req.params; // this is a proper way , instead of     const businessid = parseInt(req.params.businessid;

    const queues = await queueServices.fetchQueuesByBusiness(Number(businessid));
    res.status(200).json({
        success: true,
        queues
     });
});


export const updateQueueStatus = asyncHandler(async(req, res) => {

    const { id } = req.params;
    const { status } = queueValidator.queueStatusValid.parse(req.body);
    const queue = await queueServices.modifyQueueStatus(Number(id), status);
    res.status(200).json({
        success: true,
        message: `Queue is now ${status}`, 
        queue });
});


export const assignManager = asyncHandler(async(req, res) => {
    const { id } = req.params; 
    const { userId } = queueValidator.managerAssignmentValid.parse(req.body);
    const management = await queueServices.linkManager(Number(id), userId);
    res.status(201).json({ 
        success: true, 
        message: "Manager Assigned", 
        management });
});

export const getQueueManagers = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const managers = await queueServices.fetchManagers(Number(id));
    res.status(200).json({ 
        success: true, 
        managers });
});

export const removeManager = asyncHandler(async(req, res) => {
    const { id, userId } = req.params;
    const managerToRemove = await queueServices.unlinkManager(Number(id), Number(userId));
    res.status(200).json({ 
        success: true, 
        message: "Manager Removed",
        removedManager: managerToRemove
    });
});

export const deleteQueue = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const existingQueue = await prisma.queue.findUnique({
        where: { id: Number(id) }
    });

    if (!existingQueue) {
        // 404 --> for resourse not found
        return res.status(404).json({ success: false, message: "Queue not found" });
    }

    const deletedData = await queueServices.deleteQueue(id);

    res.status(200).json({
        success: true,
        message: "Queue deleted successfully",
        data: deletedData
    });
});