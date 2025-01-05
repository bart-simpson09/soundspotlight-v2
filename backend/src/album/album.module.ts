import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";
import {ImageService} from "../shared/image.service";
import {Album} from "../entities/album.entity";
import {AlbumsController} from "./albums.controller";
import {AlbumsService} from "./albums.service";
import {MulterModule} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import * as path from "node:path";
import {AuthorsService} from "../author/authors.service";
import {Author} from "../entities/author.entity";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([Album, Author]),
        MulterModule.register({
            storage: diskStorage({
                destination: path.resolve(__dirname + '../../../src/assets/covers'),
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
    controllers: [AlbumsController],
    providers: [AlbumsService, ImageService, AuthorsService],
})
export class AlbumsModule {
}