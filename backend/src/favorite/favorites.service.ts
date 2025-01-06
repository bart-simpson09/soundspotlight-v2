import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Favorite} from "../entities/favorite.entity";

@Injectable()
export class FavoritesService {
    constructor(
        @InjectRepository(Favorite)
        private favoritesRepository: Repository<Favorite>,
    ) {
    }

    async toggleFavorite(userId: string, albumId: string) {
        const favoriteEntity = await this.favoritesRepository.findOneBy({
            user: {id: userId},
            album: {id: albumId}
        });

        if (favoriteEntity) {
            await this.favoritesRepository.remove(favoriteEntity);
            return {message: 'Favorite removed'};
        } else {
            const newFavorite = this.favoritesRepository.create({
                user: { id: userId },
                album: { id: albumId }
            });
            await this.favoritesRepository.save(newFavorite);
            return { message: 'Favorite added' };
        }
    }
}