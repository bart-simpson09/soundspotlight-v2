import {HttpException, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Review, ReviewStatus} from "../entities/review.entity";
import {ReviewDto} from "./dtos/reviewDtoSchema";
import {Album} from "../entities/album.entity";

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private reviewsRepository: Repository<Review>,
        @InjectRepository(Album)
        private albumsRepository: Repository<Album>,
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

    async getPendingReviews() {
        return await this.reviewsRepository.createQueryBuilder('review')
            .leftJoinAndSelect('review.album', 'album')
            .leftJoinAndSelect('album.author', 'author')
            .leftJoinAndSelect('review.author', 'user')
            .select([
                'review.id',
                'review.status',
                'review.content',
                'review.rate',
                'album.albumTitle',
                'author.name',
                'user.firstName',
                'user.lastName'
            ])
            .where('review.status = :status', { status: 'pending' })
            .getMany();
    }

    async modifyReviewStatus(id: string, action: string) {
        const existingReview = await this.reviewsRepository.findOne({
            where: { id },
            relations: ['album']
        });


        if (!existingReview) {
            throw new HttpException('Album not found', 404);
        }

        if (action === 'approve') {
            existingReview.status = ReviewStatus.approved;

            const albumId = existingReview.album.id;

            const album = await this.albumsRepository.findOneBy({ id: albumId });
            if (album.avgRate === 0) {
                album.avgRate = existingReview.rate;
            } else {
                album.avgRate = (album.avgRate + existingReview.rate) / 2;
            }

            await this.albumsRepository.save(album)

        } else if (action === 'decline') {
            existingReview.status = ReviewStatus.rejected;
        } else {
            throw new HttpException('Invalid action', 400);
        }

        await this.reviewsRepository.save(existingReview);
    }
}