import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";
import {ImageService} from "../shared/image.service";
import {Album} from "../entities/album.entity";
import {AlbumsController} from "./albums.controller";
import {AlbumsService} from "./albums.service";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([Album])
    ],
    controllers: [AlbumsController],
    providers: [AlbumsService, ImageService],
})
export class AlbumsModule {
}