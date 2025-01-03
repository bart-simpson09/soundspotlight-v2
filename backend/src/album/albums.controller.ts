import {Controller, Get, Query, Req, Res} from '@nestjs/common';
import {Request, Response} from "express";
import {AlbumsService} from "./albums.service";

@Controller()
export class AlbumsController {
    constructor(
        private readonly albumsService: AlbumsService,
    ) {}

    @Get('/albums/')
    async albums(
        @Res() res: Response,
        @Query('status') status: string,
        @Query('title') title?: string,
        @Query('author') author?: string,
        @Query('category') category?: string,
        @Query('language') language?: string
    ) {
        try {
            const validStatuses = ['published', 'pending'];

            if (!validStatuses.includes(status)) {
                return res.status(400).json({ message: 'Invalid status' });
            }

            const albums = await this.albumsService.getAlbumsByParams({
                status,
                title,
                author,
                category,
                language
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
    async album(@Req() req: Request, @Res() res: Response) {
        const albumId = req.params.id;

        try {
            const album = await this.albumsService.getAlbumById(albumId);

            if (!album) {
                return res.status(404).json({ message: "Album not found" });
            }

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
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}