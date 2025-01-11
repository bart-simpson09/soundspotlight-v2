import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule} from "@nestjs/config";
import {Language} from "../entities/language.entity";
import {LanguagesController} from "./languages.controller";
import {LanguagesService} from "./languages.service";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([Language])
    ],

    controllers: [LanguagesController],
    providers: [LanguagesService],
})
export class LanguagesModule {
}