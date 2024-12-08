import z from 'zod';

export const registerDtoSchema = z.object({
    email: z.string().min(3).email(),
    password: z.string().min(6),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
})

export type RegisterDto = z.infer<typeof registerDtoSchema>