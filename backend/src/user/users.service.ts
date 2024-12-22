import {HttpException, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import * as bcrypt from 'bcrypt';
import {User} from "../entities/user.entity";
import {RegisterDto} from "./dtos/registerDtoSchema";
import {LoginDto} from "./dtos/loginDtoSchema";
import {JwtService} from "../shared/jwt.service";
import { Response } from 'express';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {
    }

    async verify(dto: LoginDto) {
        const user = await this.usersRepository.findOneBy({ email: dto.email });

        if (!user) {
            return null;
        }

        const success = await bcrypt.compare(dto.password, user.password);
        if (!success) {
            return null;
        }

        return user;
    }

    async register(dto: RegisterDto) {
        const existingUser = await this.usersRepository.findOneBy({ email: dto.email });

        if (existingUser) {
            throw new HttpException('User with this email already exists', 409);
        }

        const hash = await bcrypt.hash(dto.password, 8);

        return this.usersRepository.save({
            email: dto.email,
            password: hash,
            firstName: dto.firstName,
            lastName: dto.lastName,
            avatar: 'https://avatars.dicebear.com/api/human/john-doe.svg',
        })
    }

    async createJWT(user: User, response: Response) {
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

    async getUserById(id: string) {
        return await this.usersRepository.findOneBy({id: id});
    }
}