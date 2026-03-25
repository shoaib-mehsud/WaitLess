import z from 'zod';

export const joinQueueValidator = z.object({
    queueId: z.coerce.number().int(),
});


export const serveSpecificTokenValidator = z.object({
    queueId: z.coerce.number().int().positive(),
    tokenId: z.coerce.number().int().positive()
})