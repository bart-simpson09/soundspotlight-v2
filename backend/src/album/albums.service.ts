import {HttpException, Injectable, StreamableFile} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Album, AlbumStatus} from "../entities/album.entity";
import {ImageService} from "../shared/image.service";
import {AlbumDto} from "./dtos/albumDtoSchema";
import * as fs from "node:fs";

@Injectable()
export class AlbumsService {
    constructor(
        @InjectRepository(Album)
        private albumsRepository: Repository<Album>,
        private readonly imageService: ImageService,
    ) {
    }

    async getAlbumsByParams(params: {
        status: string;
        title?: string;
        author?: string;
        category?: string;
        language?: string;
    }) {
        const query = this.albumsRepository
            .createQueryBuilder('album')
            .leftJoinAndSelect('album.author', 'author')
            .leftJoinAndSelect('album.language', 'language')
            .leftJoinAndSelect('album.category', 'category')
            .leftJoinAndSelect('album.addedBy', 'addedBy')
            .where('album.status = :status', { status: params.status });

        if (params.title) {
            query.andWhere('LOWER(album.albumTitle) LIKE LOWER(:title)', { title: `%${params.title}%` });
        }
        if (params.author) {
            query.andWhere('LOWER(author.id) LIKE LOWER(:author)', { author: `%${params.author}%` });
        }
        if (params.category) {
            query.andWhere('category.id = :category', { category: params.category });
        }
        if (params.language) {
            query.andWhere('language.id = :language', { language: params.language });
        }

        return await query.getMany();
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

    async addAlbum(dto: AlbumDto, coverFile: Express.Multer.File) {
        const existingAlbum = await this.albumsRepository.findOneBy({ albumTitle: dto.title });

        if (existingAlbum) {
            fs.unlinkSync(coverFile.path);
            throw new HttpException('Album with this title already exists', 409);
        }

        return this.albumsRepository.save({
            albumTitle: dto.title,
            author: { id: dto.author },
            language: { id: dto.language },
            category: { id: dto.category },
            numberOfSongs: dto.numberOfSongs,
            description: dto.description,
            coverImageURL: "../src/assets/covers/" + coverFile.filename,
            releaseDate: dto.releaseDate,
            status: AlbumStatus.pending,
        });
    }

}