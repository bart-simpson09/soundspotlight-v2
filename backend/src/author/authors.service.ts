import {Injectable} from '@nestjs/common';
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
}