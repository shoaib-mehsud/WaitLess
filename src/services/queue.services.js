import { prisma } from "../config/db.js";


export async function createQueue(data) {

    const newQueue = await prisma.queue.create({
        data,
       select: { id: true, name: true } 
    });
    return newQueue;
}

// list all queues for a business
export async function fetchQueuesByBusiness(businessId){

    const businessQueues = await prisma.queue.findMany({
        where: {businessId}
    });
    return businessQueues;
}

// changes the  queue state 
export async function modifyQueueStatus(id,status) {
    
    const queueId = id;
    const newState = status
    const queue =  await prisma.queue.findUnique({
        where: {id: queueId},
    });

    if(!queue){
        throw new Error("Queue not found")
    };

    // to prevent hitting database if stata is not changing
    if(queue.state === newState){
        return queue
    }
    // payload build
    const updateData = {
        state: newState
    }

    if(newState === 'PAUSED'){
        updateData.lastPausedAt = new Date();
    }

    else if (queue.state === 'PAUSED' && queue.lastPausedAt){

        const now = new Date();

        const totalDiffInMilliSec = now.getTime() - queue.lastPausedAt.getTime();
        const totalDiffInSec = Math.floor(totalDiffInMilliSec/1000);

        updateData.totalPausedTime = queue.totalPausedTime + totalDiffInSec;
        updateData.lastPausedAt = null;
    };

    const updateQueue = prisma.queue.update({
        where: {
            id: queueId
        },
        data: updateData
    });

    return updateQueue;


}

// deleting a queue
export async function deleteQueue(id) {
    return await prisma.queue.delete({
        where: { id: Number(id) }
    });
}
// assigning a manager to queue
export async function linkManager(queueId, userId) {

    return await prisma.queueManager.create({
        data: { queueId, userId }
    });
}

// list the all managers who are assigned to a queue
export async function fetchManagers(queueId) {

    return await prisma.queueManager.findMany({
        where: { queueId },
        select: { user: { select: { id: true, name: true, email: true } } }
    });
}

// remove the manager from queue
export async function unlinkManager(queueId, userId) {

    return await prisma.queueManager.delete({
        where: { userId_queueId: { userId, queueId } } // Composite Key check
    });
}

