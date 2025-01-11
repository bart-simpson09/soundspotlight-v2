import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule} from "@nestjs/config";
import {Category} from "../entities/category.entity";
import {CategoriesController} from "./categories.controller";
import {CategoriesService} from "./categories.service";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([Category])
    ],

    controllers: [CategoriesController],
    providers: [CategoriesService],
})
export class CategoriesModule {
}