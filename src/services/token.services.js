import { tr } from 'zod/v4/locales';
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
    // Checks if any token already in CALLED state, i yes and the manager call 
    // this function callNextToken will throw an error that one user is already CALLED

    const checkTokenAlreadyCalled = await tx.token.findFirst({
      where: {
        queueId: Number(queueId),
        state: 'CALLED'
      }
    });

    if(checkTokenAlreadyCalled){
      throw new Error ("one user is already in CALLED state")
    }
   
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

export async function serveCurentToken(queueId){

  const isAnyTokenInCalledState =  await prisma.token.findFirst({
    where: {queueId: queueId,
            state: 'CALLED'
    }
  });
   
  if(!isAnyTokenInCalledState){
    throw new Error ("No one is called to server")
  }

  // Checks if any token already in SERVING state, iF yes and the manager call it
    // so it will throw an error that one user is already SERVING

    const checkTokenAlreadySrving = await prisma.token.findFirst({
      where: {
        queueId: Number(queueId),
        state: 'SERVING'
      }
    });

    if(checkTokenAlreadySrving){
      throw new Error ("one user is already in SERVING state, 2 user canot be serve at single time")
    }
  const tokenToServe = await prisma.token.update({
    where: {
      id: isAnyTokenInCalledState.id
    },
    data: {
      state: 'SERVING',
      servedAt: new Date()
    },
    select:{
      id: true,
      ticketCode: true,
      state: true,
      user: {
        select: {
          name: true
        }
      }
    }
  })
  return tokenToServe;
}

export async function completeToken(queueId){

  const isAnyTokenInServingState = await prisma.token.findFirst({
    where: {
      queueId: queueId,
      state: 'SERVING'
    }
  });

    if(!isAnyTokenInServingState){
    throw new Error ("Their is no active appointment to complete")
  }


  const tokenCompleted = await prisma.token.update({
    where: {
      id: isAnyTokenInServingState.id 
    },
    data: {
      state: 'COMPLETED',
      completedAt: new Date()
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
    }
  });

  return tokenCompleted;

}


export async function holdSpecificToken(queueId,tokenId) {
  

  const targetToken = await prisma.token.findFirst({
    where: {
      id: tokenId,
      queueId: queueId
    }
  });

  if(!targetToken){
    throw new Error ("Queue or Token doesnot exist");
  }

  // state Validation
  if (targetToken.state !== 'CALLED' && targetToken.state !== 'SERVING') {
    throw new Error(`Cannot put ticket on hold. Current state is ${targetToken.state}.`);
  }

  //Update the state
  // if the user was SERVING, and then we change its state to PRIORITY --> then the servedAt time calculated will be wiped out, by declaring isServing null
  //but if they were moved from CALLED to PRIORITY ,       * We explicitly pass `targetToken.servedAt` to preserve whatever value is currently in the DB  and for CALLED its already null or zero

  const isServing = targetToken.state === 'SERVING';
  const tokenOnHold = await prisma.token.update({
    where: {
      id: tokenId
    },
    data: {
      state: 'PRIORITY',
      servedAt: isServing? null : targetToken.servedAt
    }
  });
  return tokenOnHold
}


export async function serveSpecificToken(queueId,tokenId) {
  

    const checkAnotherTokenAlreadyServing = await prisma.token.findFirst({
      where: {
        queueId: queueId,
        state: 'SERVING'
            }
    });

    if (checkAnotherTokenAlreadyServing) {
        throw new Error(`Cannot serve now. Ticket ${checkAnotherTokenAlreadyServing.ticketCode} is currently Serving.`);
      }

      //  Does the token exist
      const targetToken = await prisma.token.findUnique({
        where: { id: tokenId }
      });

      // state Validation
      if (!targetToken) {
        throw new Error("Invalid Token ID. Token not found.");
      }

      if (targetToken.state !== 'PRIORITY') {
      throw new Error(`Can only serve users from PRIORITY hold. This user is currently ${targetToken.state}.`);
      }

    // Update the state of token
    const specificTokenToServe = await prisma.token.update({
      where: {
        id: tokenId,
        // state: 'PRIORITY'
      },
      data: {
      state: 'SERVING',
      servedAt: new Date()
    },
    select:{
      id: true,
      ticketCode: true,
      state: true,
      user: {
        select: {
          name: true
        }
      }
    }
    });
    return specificTokenToServe;
}

export async function cancelToken(userId,tokenId,queueId){

  //Fetch the token and check, if not just throw an error earlier 
  // We include the business owner so we can check it later that this queue belongs to that bisiness owner without extra queries
  const targetToken = await prisma.token.findFirst({
    where: {
      queueId: queueId,
      id: tokenId,
    },
    include: {
      business: {
        select :{
          ownerId: true
        }
      }
    }
  });

  if(!targetToken){
    throw new Error ("Invalid Token ID. Token not found");
  }

  // STATE validation
  const allowedStates = ['WAITING', 'CALLED'];

  if (!allowedStates.includes(targetToken.state)) {
  throw new Error(`Cannot cancel the ticket. Current state is ${targetToken.state}`);
  }
  //Authorization Check

  let isAuthorized = false;

  if(targetToken.userId === userId ){
    isAuthorized = true;
  }
  else if (targetToken.business.ownerId === userId){
    isAuthorized = true
  }
  else {
    const isManagerHasControl = await prisma.queueManager.findUnique({
    where: {
      userId_queueId:{
        userId: userId,
        queueId: queueId
      }
    }
    });
    if (isManagerHasControl) isAuthorized = true;
  }

  //Throw an error for UNAUTHORIZED users
  if (!isAuthorized) {
    throw new Error("Forbidden: You do not have permission to cancel this ticket.");

  }
  // The change of state to CANCELLED
  const cancelledToken = await prisma.token.update({
    where: {
      id: tokenId
    },
    data: {
      state: 'CANCELLED'
    },
    select: {
      id: true,
      ticketCode: true,
      state: true
    }
  });
  return cancelledToken

}