import {HttpException, Injectable, StreamableFile} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Album, AlbumStatus} from "../entities/album.entity";
import {ImageService} from "../shared/image.service";

@Injectable()
export class AlbumsService {
    constructor(
        @InjectRepository(Album)
        private albumsRepository: Repository<Album>,
        private readonly imageService: ImageService,
    ) {
    }

    async getAlbumsByStatus(status: string) {
        return await this.albumsRepository.find({
            where: { status: status as AlbumStatus },
            relations: ['author', 'language', 'category', 'addedBy'],
        });
    }

    async getAlbumById(id: string) {
        return await this.albumsRepository.findOne({
            where: { id: id },
            relations: ['author', 'language', 'category']
        });
    }

    async getAlbumCover(id: string): Promise<StreamableFile> {
        const album = await this.albumsRepository.findOneBy({ id: id });

        if (!album) {
            throw new HttpException('Album not found', 404);
        }

        return this.imageService.getImage(album.coverImageURL);
    }
}