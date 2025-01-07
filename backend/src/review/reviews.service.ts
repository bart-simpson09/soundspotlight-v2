import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Review, ReviewStatus} from "../entities/review.entity";
import {ReviewDto} from "./dtos/reviewDtoSchema";

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private reviewsRepository: Repository<Review>,
    ) {
    }

    async addReview(dto: ReviewDto, currentUserId: string) {

        return this.reviewsRepository.save({
            rate: dto.rate,
            content: dto.content,
            author: {id: currentUserId},
            album: {id: dto.albumId},
            status: ReviewStatus.pending
        })
    }
}