import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {ConfigModule} from "@nestjs/config";
import {Review} from "../entities/review.entity";
import {ReviewsController} from "./reviews.controller";
import {ReviewsService} from "./reviews.service";
import {Album} from "../entities/album.entity";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([Review, Album]),
    ],

    controllers: [ReviewsController],
    providers: [ReviewsService],
})
export class ReviewsModule {}