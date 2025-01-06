import {Body, Controller, Post, Req, Res} from '@nestjs/common';
import {Request, Response} from "express";
import {FavoritesService} from "./favorites.service";
import {AuthMetaData} from "../guards/auth.metadata.decorator";

@Controller()
export class FavoritesController {
    constructor(
        private readonly favoritesService: FavoritesService,
    ) {}

    @Post('/toggleFavorite')
    @AuthMetaData('SkipAuthorizationCheck')
    async favorites(
        @Res() res: Response,
        @Req() req: Request,
        @Body('albumId') albumId: string
    ) {
        const currentUserId = req.headers['current_user_id'].toString()

        try {
            try {
                const result = await this.favoritesService.toggleFavorite(currentUserId, albumId);
                return res.status(200).json(result);

            } catch (err) {
                return res.status(401).json({ message: err.message });
            }

        } catch (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}