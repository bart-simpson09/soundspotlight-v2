import z from 'zod';

export const albumDtoSchema = z.object({
    title: z.string().min(3),
    author: z.string().min(3),
    description: z.string().min(3),
    cover: z.string().regex(/\.(jpg|jpeg|png)$/i, 'Invalid file type'),
    releaseDate: z.date(),
    language: z.string(),
    category: z.string(),
    numberOfSongs: z.number(),
})

export type AlbumDto = z.infer<typeof albumDtoSchema>