import {Body, Controller, HttpException, Post, Res} from '@nestjs/common';
import {UsersService} from "./users.service";
import {Response} from "express";
import {registerDtoSchema} from "./dtos/registerDtoSchema";
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
    async register(@Body() bodyRaw: object) {
        const parseSuccess = registerDtoSchema.safeParse(bodyRaw);
        if (!parseSuccess) {
            throw new HttpException('Bad request', 400);
        }

        const user = await this.usersService.register(parseSuccess.data);
        delete user.password;

        return user;
    }
}