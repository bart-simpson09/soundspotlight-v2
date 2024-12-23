import {Module} from '@nestjs/common';
import { UsersService } from './users.service';
import {UsersController} from "./users.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../entities/user.entity";
import {ConfigModule} from "@nestjs/config";
import {JwtService} from "../shared/jwt.service";
import {ImageService} from "../shared/image.service";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([User])
    ],
    controllers: [UsersController],
    providers: [UsersService, JwtService, ImageService],
})
export class UserModule {
}
