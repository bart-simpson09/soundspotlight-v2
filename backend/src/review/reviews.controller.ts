import {Body, Controller, Get, Patch, Post, Req, Res} from '@nestjs/common';
import {Request, Response} from "express";
import {ReviewsService} from "./reviews.service";
import {ReviewDto} from "./dtos/reviewDtoSchema";
import {Roles} from "../guards/roles.decorator";
import {Role} from "../entities/user.entity";
import {ImageService} from "../shared/image.service";

@Controller()
export class ReviewsController {
    constructor(
        private readonly reviewsService: ReviewsService,
        private readonly imageService: ImageService,
    ) {
    }

    @Post('/reviews/add')
    async addReview(
        @Body() reviewDto: ReviewDto,
        @Req() req: Request
    ) {
        const currentUserId = req.headers['current_user_id'].toString();
        return this.reviewsService.addReview(reviewDto, currentUserId);
    }

    @Get('/pendingReviews')
    @Roles(Role.admin)
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
    async modifyAlbumStatus(
        @Body() body: { reviewId: string; action: string },
    ) {
        const {reviewId, action} = body;
        return this.reviewsService.modifyReviewStatus(reviewId, action);
    }

    @Get('/reviews/:id')
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