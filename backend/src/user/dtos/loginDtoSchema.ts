import z from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const loginDtoSchema = z.object({
    email: z.string().min(3).email(),
    password: z.string().min(6),
});

export type LoginDto = z.infer<typeof loginDtoSchema>;

export class LoginDtoClass {
    @ApiProperty({
        description: 'User email address (must be a valid email, min length 3)',
        example: 'user@example.com',
        minLength: 3,
    })
    email: string;

    @ApiProperty({
        description: 'User password (min length: 6)',
        example: 'password123',
        minLength: 6,
    })
    password: string;
}