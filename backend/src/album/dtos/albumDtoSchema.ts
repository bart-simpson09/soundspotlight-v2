import z from 'zod';
import {ApiProperty} from "@nestjs/swagger";

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

export class AlbumDtoClass {
    @ApiProperty({
        description: 'Album title (min length: 3)',
        example: 'Greatest Hits',
        minLength: 3,
    })
    title: string;

    @ApiProperty({
        description: 'Author or artist name (min length: 3)',
        example: 'John Doe',
        minLength: 3,
    })
    author: string;

    @ApiProperty({
        description: 'Description of the album (min length: 3)',
        example: 'This is an amazing compilation of hits.',
        minLength: 3,
    })
    cover: string;

    @ApiProperty({
        description: 'Release date in ISO format (YYYY-MM-DD)',
        example: '2023-12-31',
        format: 'date',
    })
    releaseDate: Date;

    @ApiProperty({
        description: 'Language identifier (could be an ID or name)',
        example: 'en',
    })
    language: string;

    @ApiProperty({
        description: 'Category identifier (could be an ID or name)',
        example: 'pop',
    })
    category: string;

    @ApiProperty({
        description: 'Number of songs in the album',
        example: 10,
    })
    numberOfSongs: number;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'The album cover image file',
        required: true,
    })
    albumCover?: any;
}