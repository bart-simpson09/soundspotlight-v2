import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AuthorsController} from './authors.controller';
import {AuthorsService} from './authors.service';
import {Author} from '../entities/author.entity';
import {JwtService} from "../shared/jwt.service";
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([Author])
    ],

    controllers: [AuthorsController],
    providers: [AuthorsService, JwtService],
})
export class AuthorsModule {
}