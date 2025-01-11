import {Body, Controller, Get, Patch, Post, Query, Req, Res, UploadedFile, UseInterceptors} from '@nestjs/common';
import {Request, Response} from "express";
import {AlbumsService} from "./albums.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {AlbumDto} from "./dtos/albumDtoSchema";
import {Role} from "../entities/user.entity";
import {Roles} from "../guards/roles.decorator";

@Controller()
export class AlbumsController {
    constructor(
        private readonly albumsService: AlbumsService,
    ) {}

    @Get('/albums/')
    async albums(
        @Res() res: Response,
        @Req() req: Request,
        //@Query('status') status: string,
        @Query('title') title?: string,
        @Query('author') author?: string,
        @Query('category') category?: string,
        @Query('language') language?: string
    ) {
        try {
            const currentUserId = req.headers['current_user_id'].toString();

            const albums = await this.albumsService.getAlbumsByParams({
                title,
                author,
                category,
                language,
                currentUserId
            });

            await Promise.all(albums.map(async (album) => {
                album.coverImageURL = await this.albumsService.fetchAndEncodeCoverImage(album.id);
            }));

            return res.status(200).json(albums);
        } catch (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }


    @Get('/albums/:id')
    async album(@Req() req: Request, @Res() res: Response) {
        const albumId = req.params.id;
        const currentUserId = req.headers['current_user_id'].toString();

        try {
            const album = await this.albumsService.getAlbumById(albumId, currentUserId);

            album.coverImageURL = await this.albumsService.fetchAndEncodeCoverImage(album.id);

            return res.status(200).json(album);
        } catch (err) {
            return res.status(404).json({ message: "Album not found" });
        }
    }

    @Get('/favAlbums')
    async favoritesAlbums(
        @Res() res: Response,
        @Req() req: Request,
    ) {
        try {
            const currentUserId = req.headers['current_user_id'].toString();

            const favAlbums = await this.albumsService.getFavoriteAlbums(currentUserId);

            await Promise.all(favAlbums.map(async (album) => {
                album.coverImageURL = await this.albumsService.fetchAndEncodeCoverImage(album.id);
            }));

            return res.status(200).json(favAlbums);
        } catch (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    @Get('/topAlbums')
    async topAlbums(
        @Res() res: Response,
        @Req() req: Request,
    ) {
        try {
            const currentUserId = req.headers['current_user_id'].toString();

            const topAlbums = await this.albumsService.getTopAlbums(currentUserId);

            await Promise.all(topAlbums.map(async (album) => {
                album.coverImageURL = await this.albumsService.fetchAndEncodeCoverImage(album.id);
            }));

            return res.status(200).json(topAlbums);
        } catch (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    @Get('/pendingAlbums')
    @Roles(Role.admin)
    async pendingAlbums(
        @Res() res: Response,
        @Req() req: Request,
    ) {
        try {
            const pendingAlbums = await this.albumsService.getPendingAlbums();

            await Promise.all(pendingAlbums.map(async (album) => {
                album.coverImageURL = await this.albumsService.fetchAndEncodeCoverImage(album.id);
            }));

            return res.status(200).json(pendingAlbums);
        } catch (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    @Post('/albums/add')
    @UseInterceptors(FileInterceptor('albumCover'))
    async addAlbum(
        @Body() albumDto: AlbumDto,
        @UploadedFile() albumCover: Express.Multer.File,
        @Req() req: Request
    ) {
        const currentUserId = req.headers['current_user_id'].toString();
        return this.albumsService.addAlbum(albumDto, albumCover, currentUserId);
    }

    @Patch('/albums/modifyStatus')
    @Roles(Role.admin)
    async modifyAlbumStatus(
        @Body() body: { albumID: string; action: string },
    ) {
        const { albumID, action } = body;
        return this.albumsService.modifyAlbumStatus(albumID, action);
    }

    @Get('/userAlbums')
    async userAlbums(
        @Res() res: Response,
        @Req() req: Request,
    ) {
        try {
            const currentUserId = req.headers['current_user_id'].toString();
            const userAlbums = await this.albumsService.getUserAlbums(currentUserId);

            await Promise.all(userAlbums.map(async (album) => {
                album.coverImageURL = await this.albumsService.fetchAndEncodeCoverImage(album.id);
            }));

            return res.status(200).json(userAlbums);
        } catch (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}