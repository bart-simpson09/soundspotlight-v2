import {Module} from '@nestjs/common';
import { UsersService } from './users.service';
import {UsersController} from "./users.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../entities/user.entity";
import {ConfigModule} from "@nestjs/config";
import {JwtService} from "../shared/jwt.service";
import {ImageService} from "../shared/image.service";
import {MulterModule} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import * as path from "node:path";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([User]),
        MulterModule.register({
            storage: diskStorage({
                destination: path.resolve(__dirname + '../../../src/assets/avatars'),
                filename: (req, file, cb) => {
                    const timestamp = Date.now();
                    const ext = path.extname(file.originalname);
                    const basename = path.basename(file.originalname, ext);
                    const filename = `${basename}-${timestamp}${ext}`;
                    cb(null, filename);
                },
            }),
        }),
    ],
    controllers: [UsersController],
    providers: [UsersService, JwtService, ImageService],
})
export class UserModule {
}
