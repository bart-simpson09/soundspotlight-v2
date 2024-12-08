import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import * as bcrypt from 'bcrypt';
import {User} from "../entities/user.entity";
import {RegisterDto} from "./dtos/registerDtoSchema";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {
    }

    async verify(email: string, password: string): Promise<User | null> {
        const user = await this.usersRepository.findOneBy({email})
        if (!user) {
            return null;
        }

        const success = await bcrypt.compare(password, user.password);
        if (!success) {
            return null;
        }

        return user;
    }

    async register(dto: RegisterDto) {
        const hash = await bcrypt.hash(dto.password, 8);

        return this.usersRepository.save({
            email: dto.email,
            password: hash,
            firstName: dto.firstName,
            lastName: dto.lastName,
            avatar: 'https://avatars.dicebear.com/api/human/john-doe.svg',
        })
    }
}