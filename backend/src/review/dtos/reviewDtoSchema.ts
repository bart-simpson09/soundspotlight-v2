import z from 'zod';
import {ApiProperty} from "@nestjs/swagger";

export const reviewDtoSchema = z.object({
    rate: z.number(),
    content: z.string().min(3),
    albumId: z.string(),
})

export type ReviewDto = z.infer<typeof reviewDtoSchema>

export class ReviewDtoClass {
    @ApiProperty({
        description: 'Numeric rating for the album (e.g., 1-5)',
        example: 4.5,
        type: Number,
    })
    rate: number;

    @ApiProperty({
        description: 'Review text, minimum 3 characters',
        example: 'This album was amazing!',
        minLength: 3,
        type: String,
    })
    content: string;

    @ApiProperty({
        description: 'ID of the album being reviewed',
        example: 'abc123-uuid-album-id',
        type: String,
    })
    albumId: string;
}