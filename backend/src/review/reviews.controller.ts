import {Body, Controller, Post, Req} from '@nestjs/common';
import {Request} from "express";
import {ReviewsService} from "./reviews.service";
import {ReviewDto} from "./dtos/reviewDtoSchema";

@Controller()
export class ReviewsController {
    constructor(
        private readonly reviewsService: ReviewsService,
    ) {}

    @Post('/reviews/add')
    async addReview(
        @Body() reviewDto: ReviewDto,
        @Req() req: Request
    ) {
        const currentUserId = req.headers['current_user_id'].toString();
        return this.reviewsService.addReview(reviewDto, currentUserId);
    }
}