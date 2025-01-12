import z from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const registerDtoSchema = z.object({
    email: z.string().min(3).email(),
    password: z.string().min(6),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
})

export type RegisterDto = z.infer<typeof registerDtoSchema>

export class RegisterDtoClass {
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

    @ApiProperty({
        description: 'User first name (min length: 1)',
        example: 'John',
        minLength: 1,
    })
    firstName: string;

    @ApiProperty({
        description: 'User last name (min length: 1)',
        example: 'Doe',
        minLength: 1,
    })
    lastName: string;
}