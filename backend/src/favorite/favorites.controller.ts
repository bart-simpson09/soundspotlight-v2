import {Body, Controller, Post, Req, Res} from '@nestjs/common';
import {Request, Response} from "express";
import {FavoritesService} from "./favorites.service";

@Controller()
export class FavoritesController {
    constructor(
        private readonly favoritesService: FavoritesService,
    ) {
    }

    @Post('/toggleFavorite')
    async favorites(
        @Res() res: Response,
        @Req() req: Request,
        @Body('albumId') albumId: string
    ) {
        const currentUserId = req.headers['current_user_id'].toString()

        try {
            const result = await this.favoritesService.toggleFavorite(currentUserId, albumId);
            return res.status(200).json(result);

        } catch (err) {
            return res.status(401).json({message: err.message});
        }
    }
}