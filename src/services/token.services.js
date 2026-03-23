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

export async function getQueueTokens(queueId) {
  return await prisma.token.findMany({
    where: {
      queueId: Number(queueId),
      state: {
        in: ['WAITING', 'CALLED']
      }
    },
    select: {
      id: true,
      ticketCode: true,
      state: true,
      user: {
        select: {
          name: true 
        }
      }
    },
    
    orderBy: {
      ticketCode: 'asc'
    }
  });
}


export async function callNextToken(queueId){

  return await prisma.$transaction(async(tx)=>{

    // locks the queue row, so that it remain consistent under multiple request at same time 
    const queueResult = await tx.$queryRaw`
    SELECT "id" FROM "queues"
    WHERE id = ${queueId}
    FOR UPDATE
    `
   
    const tokenToUpdate = await tx.token.findFirst({
      where: {
        queueId: Number(queueId),
        state: 'WAITING'
      },
      orderBy: {ticketCode: 'asc'}
    });

     if(!tokenToUpdate ){
      throw new Error ("Tickets not Found")
    }

    const updatedToken = await tx.token.update({
      where: {
        id: tokenToUpdate.id
      },
      data: {
        state: 'CALLED',
        calledAt: new Date()
      },
      select: {
        id: true,
        ticketCode: true,
        state: true,
        user:{
          select: {
            name: true
          }
        }
      }
    });

    
return updatedToken
  }

)

}