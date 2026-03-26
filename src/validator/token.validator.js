import z from 'zod';

export const joinQueueValidator = z.object({
    queueId: z.coerce.number().int(),
});


export const serveSpecificTokenValidator = z.object({
    queueId: z.coerce.number().int().positive(),
    tokenId: z.coerce.number().int().positive()
})

export const cancelTokenValidator = z.object({
    userId: z.coerce.number().int().positive(),
    tokenId: z.coerce.number().int().positive(),
    queueId: z.coerce.number().int().positive()
})