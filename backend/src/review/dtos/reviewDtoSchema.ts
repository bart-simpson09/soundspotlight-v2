import z from 'zod';

export const reviewDtoSchema = z.object({
    rate: z.number(),
    content: z.string().min(3),
    albumId: z.string(),
})

export type ReviewDto = z.infer<typeof reviewDtoSchema>