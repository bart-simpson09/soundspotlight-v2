import {DataSource} from 'typeorm';
import * as process from "node:process";
import {Photo} from "./entities/test.entity";

export const databaseProviders = [
    {
        provide: 'DATA_SOURCE',
        useFactory: async () => {
            const dataSource = new DataSource({
                type: 'postgres',
                host: process.env.POSTGRES_HOST,
                port: 5432,
                username: process.env.POSTGRES_USER,
                password: process.env.POSTGRES_PASSWORD,
                database: 'soundspotlight',
                entities: [
                    __dirname + '/../**/*.entity{.ts,.js}',
                    //Photo
                ],
                synchronize: true,
            });

            return dataSource.initialize();
        },
    },
];