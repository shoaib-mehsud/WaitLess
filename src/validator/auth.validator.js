import z from 'zod'

export const signupValidator = z.object({
    name: z.string().min(2, "Name must be atleast 2 characters long").max(20, "Please use a short name"),
    email: z.string().email("Please provide a valid email address"),
    password: z.string()
        .min(8, "Password too short")
        .max(32, "Password too long")
        // .regex(/[A-Z]/, "Must have uppercase")
        // .regex(/[0-9]/, "Must have number")
})

export const signinValidator = z.object({
    email: z.string().email("Please provide a valid email address"),
    password: z.string()
        .min(8, "Password too short")
        .max(32, "Password too long")
        // .regex(/[A-Z]/, "Must have uppercase")
        // .regex(/[0-9]/, "Must have number")
})
