import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from './entities/user.entity';
import {UserModule} from "./user/user.module";
import {Author} from "./entities/author.entity";
import {Language} from "./entities/language.entity";
import {Category} from "./entities/category.entity";
import {Album} from "./entities/album.entity";
import {Review} from "./entities/review.entity";
import {Favorite} from "./entities/favorite.entity";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('POSTGRES_HOST'),
                port: parseInt(configService.get<string>('POSTGRES_PORT', '5432')),
                username: configService.get<string>('POSTGRES_USER'),
                password: configService.get<string>('POSTGRES_PASSWORD'),
                database: configService.get<string>('DATABASE_NAME', 'soundspotlight'),
                entities: [User, Author, Language, Category, Album, Review, Favorite],
                synchronize: true,
                logging: true,
            })
        }),
        UserModule,
    ],
})
export class AppModule {
}
