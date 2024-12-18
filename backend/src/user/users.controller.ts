import {Body, Controller, Get, HttpException, Post, Req, Res} from '@nestjs/common';
import {UsersService} from "./users.service";
import {Request, Response} from "express";
import {RegisterDto, registerDtoSchema} from "./dtos/registerDtoSchema";
import {JwtService} from "../shared/jwt.service";
import {LoginDto, loginDtoSchema} from "./dtos/loginDtoSchema";

@Controller()
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        ) {
    }

    @Post('/auth/login')
    async login(@Res() response: Response, @Body() bodyRaw: object) {
        const parseSuccess = loginDtoSchema.safeParse(bodyRaw);
        if (!parseSuccess.success) {
            throw new HttpException('Invalid request body', 400);
        }

        const loginDto: LoginDto = parseSuccess.data;

        const user = await this.usersService.verify(loginDto);
        if (!user) {
            throw new HttpException('Invalid credentials', 401);
        }

        const jwt = await this.jwtService.sign({
            sub: user.id,
            email: user.email,
            role: user.role,
        });

        response.cookie('jwt', jwt, {
            httpOnly: true,
            maxAge: 1000 * 60 * 15,
        });

        delete user.password;

        response.json(user);
        response.end();
    }

    @Post('/auth/register')
    async register(@Res() response: Response, @Body() bodyRaw: object) {
        const parseResult = registerDtoSchema.safeParse(bodyRaw);
        if (!parseResult.success) {
            const validationErrors = parseResult.error.errors.map(err => ({
                field: err.path[0],
                message: err.message,
            }));
            throw new HttpException(
                { message: 'Validation failed', errors: validationErrors },
                400
            );
        }

        const dto: RegisterDto = parseResult.data;

        const user = await this.usersService.register(dto);

        const jwt = await this.jwtService.sign({
            sub: user.id,
            email: user.email,
            role: user.role,
        });

        response.cookie('jwt', jwt, {
            httpOnly: true,
            maxAge: 1000 * 60 * 15,
        });
        delete user.password;

        response.json(user);
        response.end();
    }

    @Post('/auth/logout')
    async logout(@Res() response: Response) {
        response.clearCookie('jwt', {
            httpOnly: true,
        });
        response.status(200).json({ message: 'Logged out successfully' });
        response.end();
    }

    @Get('/auth/check')
    async checkAuth(@Req() req: Request, @Res() res: Response) {
        const token = req.cookies?.jwt;

        if (!token) {
            return res.status(200).json({ isAuthenticated: false });
        }

        try {
            const payload = await this.jwtService.verify(token);
            return res.status(200).json({ isAuthenticated: true, user: payload });
        } catch (err) {
            return res.status(200).json({ isAuthenticated: false });
        }
    }

    @Get('/users/:id')
    async user(@Req() req: Request, @Res() res: Response) {
        const userId = req.params.id;

        try {
            const user = await this.usersService.getUserById(userId);
            delete user.password;

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            return res.status(200).json(user);
        } catch (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}