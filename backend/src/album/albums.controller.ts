import {Body, Controller, Get, Post, Query, Req, Res, UploadedFile, UseInterceptors} from '@nestjs/common';
import {Request, Response} from "express";
import {AlbumsService} from "./albums.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {AlbumDto} from "./dtos/albumDtoSchema";
import {AuthMetaData} from "../guards/auth.metadata.decorator";

@Controller()
export class AlbumsController {
    constructor(
        private readonly albumsService: AlbumsService,
    ) {}

    @Get('/albums/')
    @AuthMetaData('SkipAuthorizationCheck')
    async albums(
        @Res() res: Response,
        @Req() req: Request,
        @Query('status') status: string,
        @Query('title') title?: string,
        @Query('author') author?: string,
        @Query('category') category?: string,
        @Query('language') language?: string
    ) {
        try {
            const validStatuses = ['published', 'pending'];
            const currentUserId = req.headers['current_user_id'].toString();

            if (!validStatuses.includes(status)) {
                return res.status(400).json({ message: 'Invalid status' });
            }

            const albums = await this.albumsService.getAlbumsByParams({
                status,
                title,
                author,
                category,
                language,
                currentUserId
            });

            for (const album of albums) {
                try {
                    const coverFile = await this.albumsService.getAlbumCover(album.id);
                    const chunks = [];
                    for await (const chunk of coverFile.getStream()) {
                        chunks.push(chunk);
                    }
                    const buffer = Buffer.concat(chunks);
                    const coverBase64 = buffer.toString('base64');
                    album.coverImageURL = `data:image/png;base64,${coverBase64}`;
                } catch (avatarErr) {
                    album.coverImageURL = null;
                }
            }

            return res.status(200).json(albums);
        } catch (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }


    @Get('/albums/:id')
    @AuthMetaData('SkipAuthorizationCheck')
    async album(@Req() req: Request, @Res() res: Response) {
        const albumId = req.params.id;
        const currentUserId = req.headers['current_user_id'].toString();

        try {
            const album = await this.albumsService.getAlbumById(albumId, currentUserId);

            try {
                const coverFile = await this.albumsService.getAlbumCover(albumId);
                const chunks = [];
                for await (const chunk of coverFile.getStream()) {
                    chunks.push(chunk);
                }
                const buffer = Buffer.concat(chunks);
                const coverBase64 = buffer.toString('base64');
                album.coverImageURL = `data:image/png;base64,${coverBase64}`;
            } catch (avatarErr) {
                album.coverImageURL = null;
            }

            return res.status(200).json(album);
        } catch (err) {
            return res.status(404).json({ message: "Album not found" });
        }
    }

    @Post('/albums/add')
    @AuthMetaData('SkipAuthorizationCheck')
    @UseInterceptors(FileInterceptor('albumCover'))
    async addAlbum(
        @Body() albumDto: AlbumDto,
        @UploadedFile() albumCover: Express.Multer.File,
        @Req() req: Request
    ) {
        const currentUserId = req.headers['current_user_id'].toString();
        return this.albumsService.addAlbum(albumDto, albumCover, currentUserId);
    }
}