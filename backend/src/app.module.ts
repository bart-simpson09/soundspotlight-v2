import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Photo} from "./entities/test.entity";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: 5432,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: 'soundspotlight',
        entities: [__dirname + '/../**/*.entity.js',],
        synchronize: true,
        logging: true,
      }),
    }), TypeOrmModule.forFeature([Photo]),],
  controllers: [AppController],
  providers: [AppService,],
})
export class AppModule {}