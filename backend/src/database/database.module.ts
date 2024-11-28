import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import process from "node:process";
import {ConfigModule, ConfigService} from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: process.env.POSTGRES_HOST,
                port: 5432,
                username: process.env.POSTGRES_USER,
                password: process.env.POSTGRES_PASSWORD,
                database: 'soundspotlight',
                entities: [__dirname + '/../**/*.entity{.ts,.js}',],
                synchronize: true,
            }),
        }),
    ],
})
export class DatabaseModule {}