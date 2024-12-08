import {Body, Controller, HttpException, Post, Res} from '@nestjs/common';
import {UsersService} from "./users.service";
import {Response} from "express";
import {registerDtoSchema} from "./dtos/registerDtoSchema";
import {JwtService} from "../shared/jwt.service";

@Controller()
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        ) {
    }

    @Post('/auth/login')
    async login(@Res() response: Response, @Body('email') email: string, @Body('password') password: string) {
        const user = await this.usersService.verify(email, password);
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
        })

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