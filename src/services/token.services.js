import { prisma } from '../config/db.js';

export async function joinQueue(queueId, userId) {


  return await prisma.$transaction(async (tx) => {


    // locks the queue row
    const queueResult = await tx.$queryRaw`
      SELECT "businessId" FROM "queues"
      where id = ${queueId}
      FOR UPDATE
      `;

    if (!queueResult || queueResult.length === 0) {
      throw new Error("Queue not found");
    }

    const actualBusinessId = queueResult[0].businessId;

    // Prevent duplicate active tokens in the specific queue
    const existingToken = await tx.token.findFirst({
      where: {
        userId: userId,
        queueId: Number(queueId),
        state: 'WAITING'
      }
    });

    // if (existingToken) {
    //   throw new Error("You are already waiting in this queue.");
    // }


    // read the last Token Number
    const lastTokenNumber = await tx.token.findFirst({
      where: { queueId: queueId },
      orderBy: { ticketCode: 'desc' }
    })

    // calculate next token number
    const nextTokenNumber = lastTokenNumber ? lastTokenNumber.ticketCode + 1 : 1;

    // create new token 
    const newToken = await tx.token.create({
      data: {
        queueId: queueId,
        businessId: actualBusinessId,
        userId: userId,
        ticketCode: nextTokenNumber,
        state: 'WAITING'
      }
    });

    return newToken;
  })
}
