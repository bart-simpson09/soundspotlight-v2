import { DataSource } from 'typeorm';
import { Photo } from './entities/test.entity';

export const photoProviders = [
    {
        provide: 'PHOTO_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Photo),
        inject: ['DATA_SOURCE'],
    },
];