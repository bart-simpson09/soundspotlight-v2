import {HttpException, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Author} from "../entities/author.entity";

@Injectable()
export class AuthorsService {
    constructor(
        @InjectRepository(Author)
        private authorsRepository: Repository<Author>,
    ) {
    }

    async getAllAuthors() {
        return await this.authorsRepository.find();
    }

    async addAuthor(authorName: string) {
        const existingAuthor = await this.authorsRepository.findOneBy({name: authorName});

        if (existingAuthor) {
            throw new HttpException('Author with this name already exists', 409);
        }

        return this.authorsRepository.save({
            name: authorName,
        });
    }
}