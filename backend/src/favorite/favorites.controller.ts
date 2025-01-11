import {Body, Controller, HttpStatus, Post, Req, Res} from '@nestjs/common';
import {Request, Response} from "express";
import {FavoritesService} from "./favorites.service";
import {ApiBody, ApiHeader, ApiOperation, ApiResponse} from "@nestjs/swagger";

@Controller()
export class FavoritesController {
    constructor(
        private readonly favoritesService: FavoritesService,
    ) {
    }

    @Post('/toggleFavorite')
    @ApiOperation({
        summary: 'Toggle favorite status of a specific album for the current user',
    })
    @ApiHeader({
        name: 'current_user_id',
        description: 'ID of the currently authenticated user',
        required: true,
    })
    @ApiBody({
        description: 'Album ID to be toggled as a favorite',
        required: true,
        schema: {
            type: 'object',
            properties: {
                albumId: {
                    type: 'string',
                    example: 'UUID-of-some-album',
                },
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Favorite status updated successfully',
        schema: {
            example: {
                message: 'Favorite added',
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    })
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