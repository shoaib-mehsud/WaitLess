import z from 'zod';
export const createBusinessValidator = z.object({
    name: z.string()
    .min(2,"Name is too short, Please use a proper name")
    .max(20,"Name is too long, Please use a proper name"),
    ownerId: z.int(),
})