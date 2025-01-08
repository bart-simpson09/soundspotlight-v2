import {Body, Controller, Get, Patch, Post, Req, Res} from '@nestjs/common';
import {Request, Response} from "express";
import {ReviewsService} from "./reviews.service";
import {ReviewDto} from "./dtos/reviewDtoSchema";
import {AuthMetaData} from "../guards/auth.metadata.decorator";
import {Roles} from "../guards/roles.decorator";
import {Role} from "../entities/user.entity";

@Controller()
export class ReviewsController {
    constructor(
        private readonly reviewsService: ReviewsService,
    ) {}

    @Post('/reviews/add')
    @AuthMetaData('SkipAuthorizationCheck')
    async addReview(
        @Body() reviewDto: ReviewDto,
        @Req() req: Request
    ) {
        const currentUserId = req.headers['current_user_id'].toString();
        return this.reviewsService.addReview(reviewDto, currentUserId);
    }

    @Get('/pendingReviews')
    @Roles(Role.admin)
    //@AuthMetaData('SkipAuthorizationCheck')
    async pendingReviews(
        @Res() res: Response,
    ) {
        try {
            const pendingReviews = await this.reviewsService.getPendingReviews();

            return res.status(200).json(pendingReviews);
        } catch (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    @Patch('/reviews/modifyStatus')
    @Roles(Role.admin)
    async modifyAlbumStatus(
        @Body() body: { reviewId: string; action: string },
    ) {
        const { reviewId, action } = body;
        return this.reviewsService.modifyReviewStatus(reviewId, action);
    }
}