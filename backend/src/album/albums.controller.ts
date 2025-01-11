import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Patch,
    Post,
    Query,
    Req,
    Res,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import {Request, Response} from "express";
import {AlbumsService} from "./albums.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {AlbumDto, AlbumDtoClass} from "./dtos/albumDtoSchema";
import {Role} from "../entities/user.entity";
import {Roles} from "../guards/roles.decorator";
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiHeader,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse
} from "@nestjs/swagger";

@Controller()
export class AlbumsController {
    constructor(
        private readonly albumsService: AlbumsService,
    ) {}

    @Get('/albums/')
    @ApiOperation({
        summary: 'Retrieve all published albums (with optional filters)',
    })
    @ApiQuery({
        name: 'title',
        required: false,
        description: 'Filter by album title (partial match)',
    })
    @ApiQuery({
        name: 'author',
        required: false,
        description: 'Filter by author name (partial match)',
    })
    @ApiQuery({
        name: 'category',
        required: false,
        description: 'Filter by category (exact match)',
    })
    @ApiQuery({
        name: 'language',
        required: false,
        description: 'Filter by language (exact match)',
    })
    @ApiHeader({
        name: 'current_user_id',
        description: 'ID of the currently authenticated user',
        required: true,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'List of albums successfully retrieved',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error',
    })
    async albums(
        @Res() res: Response,
        @Req() req: Request,
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
    @ApiOperation({
        summary: 'Retrieve a published album by ID',
    })
    @ApiParam({
        name: 'id',
        description: 'Album ID',
        required: true,
    })
    @ApiHeader({
        name: 'current_user_id',
        description: 'ID of the currently authenticated user',
        required: true,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Album found',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Album not found',
    })
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
    @ApiOperation({
        summary: 'Retrieve the favorite albums of the current user',
    })
    @ApiHeader({
        name: 'current_user_id',
        description: 'ID of the currently authenticated user',
        required: true,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Favorite albums returned',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error',
    })
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
    @ApiOperation({
        summary: 'Retrieve the top 3 published albums by average rating',
    })
    @ApiHeader({
        name: 'current_user_id',
        description: 'ID of the currently authenticated user',
        required: true,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Top albums returned',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error',
    })
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
    @ApiOperation({
        summary: 'Retrieve all albums waiting for approval (Admin only)',
    })
    @ApiBearerAuth()
    @ApiHeader({
        name: 'current_user_id',
        description: 'ID of the currently authenticated admin user',
        required: true,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Pending albums retrieved',
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Forbidden. Admin only.',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error',
    })
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
    @ApiOperation({
        summary: 'Add a new album (requires an uploaded cover file)',
    })
    @ApiHeader({
        name: 'current_user_id',
        description: 'ID of the currently authenticated user',
        required: true,
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Album details + cover image file',
        type: AlbumDtoClass,
        required: true,
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Album successfully created',
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Album with this title already exists',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Validation failed (e.g., missing required fields)',
    })
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
    @ApiOperation({ summary: 'Approve or decline a pending album (Admin only)' })
    @ApiBearerAuth()
    @ApiBody({
        description: 'Album ID and action to modify the status',
        required: true,
        schema: {
            type: 'object',
            properties: {
                albumID: { type: 'string', example: 'albumId' },
                action: {
                    type: 'string',
                    enum: ['approve', 'decline'],
                    example: 'approve',
                },
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Album status successfully modified',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Album not found',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid action',
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Forbidden. Admin only.',
    })
    async modifyAlbumStatus(
        @Body() body: { albumID: string; action: string },
    ) {
        const { albumID, action } = body;
        return this.albumsService.modifyAlbumStatus(albumID, action);
    }

    @Get('/userAlbums')
    @ApiOperation({ summary: 'Retrieve all albums added by the current user' })
    @ApiHeader({
        name: 'current_user_id',
        description: 'ID of the currently authenticated user',
        required: true,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User albums returned',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error',
    })
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