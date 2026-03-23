import z from 'zod';

export const joinQueueValidator = z.object({
    queueId: z.coerce.number().int(),
});

