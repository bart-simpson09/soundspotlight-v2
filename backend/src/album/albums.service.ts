import {HttpException, Injectable, StreamableFile} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Album, AlbumStatus} from "../entities/album.entity";
import {ImageService} from "../shared/image.service";
import {AlbumDto} from "./dtos/albumDtoSchema";
import * as fs from "node:fs";
import {Author} from "../entities/author.entity";
import {AuthorsService} from "../author/authors.service";
import {Favorite} from "../entities/favorite.entity";

@Injectable()
export class AlbumsService {
    constructor(
        @InjectRepository(Album)
        private albumsRepository: Repository<Album>,
        @InjectRepository(Author)
        private authorsRepository: Repository<Author>,
        private readonly imageService: ImageService,
        private authorsService: AuthorsService,
        @InjectRepository(Favorite)
        private favoritesRepository: Repository<Favorite>,
    ) {
    }

    async getAlbumsByParams(params: {
        title?: string;
        author?: string;
        category?: string;
        language?: string;
        currentUserId: string;
    }) {
        const query = this.albumsRepository
            .createQueryBuilder('album')
            .leftJoinAndSelect('album.author', 'author')
            .leftJoinAndSelect('album.language', 'language')
            .leftJoinAndSelect('album.category', 'category')
            .leftJoinAndSelect('album.addedBy', 'addedBy')
            .where('album.status = :status', { status: AlbumStatus.published });

        if (params.title) {
            query.andWhere('LOWER(album.albumTitle) LIKE LOWER(:title)', { title: `%${params.title}%` });
        }
        if (params.author) {
            query.andWhere('LOWER(author.name) LIKE LOWER(:author)', { author: `%${params.author}%` });
        }
        if (params.category) {
            query.andWhere('category.id = :category', { category: params.category });
        }
        if (params.language) {
            query.andWhere('language.id = :language', { language: params.language });
        }

        const albums = await query.getMany();

        const favoriteAlbumIds = await this.favoritesRepository
            .createQueryBuilder('favorite')
            .select('favorite.album.id', 'albumId')
            .where('favorite.user.id = :userId', { userId: params.currentUserId })
            .getRawMany();

        const favoriteIdsSet = new Set(favoriteAlbumIds.map(fav => fav.albumId));

        return albums.map(album => ({
            ...album,
            isFavorite: favoriteIdsSet.has(album.id),
        }));
    }

    async getAlbumById(id: string, currentUserId: string) {
        const album = await this.albumsRepository
            .createQueryBuilder('album')
            .where('album.id = :id', { id })
            .andWhere('album.status = :status', { status: AlbumStatus.published })
            .leftJoinAndSelect('album.author', 'author')
            .leftJoinAndSelect('album.language', 'language')
            .leftJoinAndSelect('album.category', 'category')
            .getOne();

        if (!album) {
            throw new HttpException('Album not found', 404);
        }

        const favorite = await this.favoritesRepository
            .createQueryBuilder('favorite')
            .where('favorite.album.id = :albumId', { albumId: id })
            .andWhere('favorite.user.id = :userId', { userId: currentUserId })
            .getOne();

        return {
            ...album,
            isFavorite: !!favorite,
        };
    }

    async getAlbumCover(id: string): Promise<StreamableFile> {
        const album = await this.albumsRepository.findOneBy({ id: id });

        if (!album) {
            throw new HttpException('Album not found', 404);
        }

        return this.imageService.getImage(album.coverImageURL);
    }

    async addAlbum(dto: AlbumDto, coverFile: Express.Multer.File, currentUserId: string) {
        const existingAlbum = await this.albumsRepository.findOneBy({ albumTitle: dto.title });
        const existingAuthor = await this.authorsRepository.findOneBy({name: dto.author});
        let authorID: string;

        if (existingAlbum) {
            fs.unlinkSync(coverFile.path);
            throw new HttpException('Album with this title already exists', 409);
        }

        if (existingAuthor) {
            authorID = existingAuthor.id;
        } else {
            await this.authorsService.addAuthor(dto.author);
            const newAuthor = await this.authorsRepository.findOneBy({name: dto.author});
            authorID = newAuthor.id;
        }

        return this.albumsRepository.save({
            albumTitle: dto.title,
            author: { id: authorID },
            language: { id: dto.language },
            category: { id: dto.category },
            numberOfSongs: dto.numberOfSongs,
            description: dto.description,
            coverImageURL: "../src/assets/covers/" + coverFile.filename,
            releaseDate: dto.releaseDate,
            status: AlbumStatus.pending,
            addedBy: {id: currentUserId}
        });
    }

    async getFavoriteAlbums(userId: string) {
        const favoriteAlbums = await this.favoritesRepository
            .createQueryBuilder('favorite')
            .innerJoinAndSelect('favorite.album', 'album')
            .leftJoinAndSelect('album.author', 'author')
            .leftJoinAndSelect('album.language', 'language')
            .leftJoinAndSelect('album.category', 'category')
            .leftJoinAndSelect('album.addedBy', 'addedBy')
            .where('favorite.user.id = :userId', { userId: userId })
            .andWhere('album.status = :status', { status: AlbumStatus.published })
            .getMany();

        return favoriteAlbums.map(fav => ({
            ...fav.album,
            isFavorite: true,
        }));
    }

    async getTopAlbums(userId: string) {
        const topAlbums = await this.albumsRepository
            .createQueryBuilder('album')
            .leftJoinAndSelect('album.author', 'author')
            .leftJoinAndSelect('album.language', 'language')
            .leftJoinAndSelect('album.category', 'category')
            .leftJoinAndSelect('album.addedBy', 'addedBy')
            .where('album.status = :status', { status: AlbumStatus.published })
            .orderBy('album.avgRate', 'DESC')
            .limit(3)
            .getMany();

        const favoriteAlbumIds = await this.favoritesRepository
            .createQueryBuilder('favorite')
            .select('favorite.album_id', 'albumId')
            .where('favorite.user_id = :userId', { userId: userId })
            .getRawMany();

        const favoriteIds = favoriteAlbumIds.map(fav => fav.albumId);

        return topAlbums.map(album => ({
            ...album,
            isFavorite: favoriteIds.includes(album.id),
        }));
    }

    async getPendingAlbums() {
        return await this.albumsRepository
            .createQueryBuilder('album')
            .leftJoinAndSelect('album.author', 'author')
            .leftJoinAndSelect('album.language', 'language')
            .leftJoinAndSelect('album.category', 'category')
            .leftJoinAndSelect('album.addedBy', 'addedBy')
            .where('album.status = :status', { status: AlbumStatus.pending })
            .getMany();
    }

    async modifyAlbumStatus(id: string, action: string) {
        const existingAlbum = await this.albumsRepository.findOneBy({ id });

        if (!existingAlbum) {
            throw new HttpException('Album not found', 404);
        }

        if (action === 'approve') {
            existingAlbum.status = AlbumStatus.published;
        } else if (action === 'decline') {
            existingAlbum.status = AlbumStatus.rejected;
        } else {
            throw new HttpException('Invalid action', 400);
        }

        await this.albumsRepository.save(existingAlbum);
    }

    async getUserAlbums(userId: string) {
        return await this.albumsRepository
            .createQueryBuilder('album')
            .leftJoinAndSelect('album.author', 'author')
            .leftJoinAndSelect('album.language', 'language')
            .leftJoinAndSelect('album.category', 'category')
            .where('album.addedBy.id = :userId', { userId })
            .select([
                'album.id',
                'album.albumTitle',
                'album.description',
                'album.status',
                'album.coverImageURL',
                'album.releaseDate',
                'author.name',
                'language.name',
                'category.name',
            ])
            .getMany();
    }

    async fetchAndEncodeCoverImage(albumId: string): Promise<string | null> {
        try {
            const coverFile = await this.getAlbumCover(albumId);
            const chunks = [];
            for await (const chunk of coverFile.getStream()) {
                chunks.push(chunk);
            }
            const buffer = Buffer.concat(chunks);
            return `data:image/png;base64,${buffer.toString('base64')}`;
        } catch {
            return null;
        }
    }



}