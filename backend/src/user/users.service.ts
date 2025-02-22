import {HttpException, Injectable, StreamableFile} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import * as bcrypt from 'bcrypt';
import {Role, User} from "../entities/user.entity";
import {RegisterDto} from "./dtos/registerDtoSchema";
import {LoginDto} from "./dtos/loginDtoSchema";
import {JwtService} from "../shared/jwt.service";
import {Response} from 'express';
import {ImageService} from "../shared/image.service";
import {ProducerService} from "../queues/producer.service";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly imageService: ImageService,
        private producerService: ProducerService,
    ) {
    }

    async verify(dto: LoginDto) {
        const user = await this.usersRepository.findOneBy({email: dto.email});

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
        const existingUser = await this.usersRepository.findOneBy({email: dto.email});

        if (existingUser) {
            throw new HttpException('User with this email already exists', 409);
        }

        const hash = await bcrypt.hash(dto.password, 8);

        const emailData = {
            to: dto.email,
            subject: "Welcome to SoundSpotlight!",
            message: `
              <div>
                <h1>Welcome to SoundSpotlight!</h1>
                <p>Hi ${dto.firstName},</p>
                <p>
                  We’re excited to have you join the SoundSpotlight community! Here, you’ll find amazing music, connect with other enthusiasts, and explore a world of sound tailored just for you.
                </p>
                <p>Cheers,</p>
                <p>The SoundSpotlight Team</p>
              </div>`
        }


        await this.producerService.addToEmailQueue(emailData);

        return this.usersRepository.save({
            email: dto.email,
            password: hash,
            firstName: dto.firstName,
            lastName: dto.lastName,
            avatar: '../src/assets/avatars/default-avatar.png',
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

    async getAllUsers() {
        return await this.usersRepository.find({
            order: {
                firstName: 'ASC',
            },
        });
    }

    async getUserAvatar(id: string): Promise<StreamableFile> {
        const user = await this.usersRepository.findOneBy({id: id});

        if (!user) {
            throw new HttpException('User not found', 404);
        }

        return this.imageService.getImage(user.avatar);
    }

    async modifyUserRole(id: string, action: string) {
        const existingUser = await this.usersRepository.findOneBy({id});

        if (!existingUser) {
            throw new HttpException('User not found', 404);
        }

        if (action === 'grant') {
            existingUser.role = Role.admin;
        } else if (action === 'revoke') {
            existingUser.role = Role.user;
        } else {
            throw new HttpException('Invalid action', 400);
        }

        await this.usersRepository.save(existingUser);
    }

    async changeUserPhoto(photoFile: Express.Multer.File, currentUserId: string) {
        const existingUser = await this.usersRepository.findOneBy({id: currentUserId});

        if (!existingUser) {
            throw new HttpException('User not found', 404);
        }

        existingUser.avatar = "../src/assets/avatars/" + photoFile.filename;

        await this.usersRepository.save(existingUser);

        delete existingUser.password;
        return existingUser;
    }

    async fetchAndEncodeAvatar(userId: string): Promise<string | null> {
        try {
            const avatarFile = await this.getUserAvatar(userId);
            const chunks = [];
            for await (const chunk of avatarFile.getStream()) {
                chunks.push(chunk);
            }
            const buffer = Buffer.concat(chunks);
            return `data:image/png;base64,${buffer.toString('base64')}`;
        } catch {
            return null;
        }
    }
}