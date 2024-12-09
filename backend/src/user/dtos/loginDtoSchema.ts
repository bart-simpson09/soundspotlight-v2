import z from 'zod';

export const loginDtoSchema = z.object({
    email: z.string().min(3).email(),
    password: z.string().min(6),
})

export type LoginDto = z.infer<typeof loginDtoSchema>