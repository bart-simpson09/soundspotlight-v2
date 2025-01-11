import {Body, Controller, Get, HttpStatus, Patch, Post, Req, Res} from '@nestjs/common';
import {Request, Response} from "express";
import {ReviewsService} from "./reviews.service";
import {ReviewDto, ReviewDtoClass} from "./dtos/reviewDtoSchema";
import {Roles} from "../guards/roles.decorator";
import {Role} from "../entities/user.entity";
import {ImageService} from "../shared/image.service";
import {ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse} from "@nestjs/swagger";

@Controller()
export class ReviewsController {
    constructor(
        private readonly reviewsService: ReviewsService,
        private readonly imageService: ImageService,
    ) {
    }

    @Post('/reviews/add')
    @ApiOperation({ summary: 'Add a new review (pending status by default)' })
    @ApiHeader({
        name: 'current_user_id',
        description: 'ID of the currently authenticated user',
        required: true,
    })
    @ApiBody({
        description: 'Review data containing albumId, rate, and content',
        type: ReviewDtoClass,
        required: true,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Review successfully submitted, status is pending',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized or invalid user headers',
    })
    async addReview(
        @Body() reviewDto: ReviewDto,
        @Req() req: Request
    ) {
        const currentUserId = req.headers['current_user_id'].toString();
        return this.reviewsService.addReview(reviewDto, currentUserId);
    }

    @Get('/pendingReviews')
    @Roles(Role.admin)
    @ApiOperation({ summary: 'Retrieve pending reviews (admin only)' })
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'List of pending reviews retrieved successfully',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error',
    })
    async pendingReviews(
        @Res() res: Response,
    ) {
        try {
            const pendingReviews = await this.reviewsService.getPendingReviews();

            return res.status(200).json(pendingReviews);
        } catch (err) {
            return res.status(500).json({message: 'Internal server error'});
        }
    }

    @Get('/userReviews')
    @ApiOperation({ summary: 'Retrieve the reviews created by the current user' })
    @ApiHeader({
        name: 'current_user_id',
        description: 'ID of the currently authenticated user',
        required: true,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User reviews returned successfully',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error',
    })
    async userReviews(
        @Res() res: Response,
        @Req() req: Request,
    ) {
        try {
            const currentUserId = req.headers['current_user_id'].toString();
            const userReviews = await this.reviewsService.getUserReviews(currentUserId);

            return res.status(200).json(userReviews);
        } catch (err) {
            return res.status(500).json({message: 'Internal server error'});
        }
    }

    @Patch('/reviews/modifyStatus')
    @Roles(Role.admin)
    @ApiOperation({ summary: 'Approve or reject a review (admin only)' })
    @ApiBearerAuth()
    @ApiBody({
        description: 'Review ID and the action (approve or decline)',
        required: true,
        schema: {
            type: 'object',
            properties: {
                reviewId: {
                    type: 'string',
                    example: 'some-review-id',
                },
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
        description: 'Review status successfully updated',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Review not found',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid action',
    })
    async modifyAlbumStatus(
        @Body() body: { reviewId: string; action: string },
    ) {
        const {reviewId, action} = body;
        return this.reviewsService.modifyReviewStatus(reviewId, action);
    }

    @Get('/reviews/:id')
    @ApiOperation({ summary: 'Retrieve approved reviews for a specific album' })
    @ApiParam({
        name: 'id',
        description: 'Album ID',
        required: true,
        example: 'some-album-id',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Reviews returned successfully',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Reviews not found',
    })
    async reviews(@Req() req: Request, @Res() res: Response) {
        const albumId = req.params.id;

        try {
            const albumReviews = await this.reviewsService.getAlbumReviews(albumId);

            for (const albumReview of albumReviews) {
                try {
                    const userAvatar = await this.imageService.getImage(albumReview.author.avatar);
                    const chunks = [];
                    for await (const chunk of userAvatar.getStream()) {
                        chunks.push(chunk);
                    }
                    const buffer = Buffer.concat(chunks);
                    const avatarBase64 = buffer.toString('base64');
                    albumReview.author.avatar = `data:image/png;base64,${avatarBase64}`;
                } catch (avatarErr) {
                    albumReview.author.avatar = null;
                }
            }

            return res.status(200).json(albumReviews);
        } catch (err) {
            return res.status(404).json({message: "Reviews not found"});
        }
    }
}