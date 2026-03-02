import z from 'zod';

export const queueCreationValid = z.object({
    name: z.string().min(3).max(20),
    businessId: z.coerce.number(),
    defaultServiceTime: z.coerce.number().min(1).default(10),
})

export const queueStatusValid = z.object({
    status: z.enum(['OPEN', 'PAUSED', 'LOCKED', 'CLOSED']),
});

export const managerAssignmentValid = z.object({
    userId: z.coerce.number(),
});