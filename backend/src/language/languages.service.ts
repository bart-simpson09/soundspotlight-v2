import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Language} from "../entities/language.entity";

@Injectable()
export class LanguagesService {
    constructor(
        @InjectRepository(Language)
        private languagesRepository: Repository<Language>,
    ) {
    }

    async getAllLanguages() {
        return await this.languagesRepository.find();
    }
}