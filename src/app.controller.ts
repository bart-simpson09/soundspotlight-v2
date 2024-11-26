import {Controller, Get, Inject} from '@nestjs/common';
import { AppService } from './app.service';
import {Repository} from "typeorm";
import {Photo} from "./entities/test.entity";
import {InjectRepository} from "@nestjs/typeorm";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
              @InjectRepository(Photo) private readonly photosRepository: Repository<Photo>) {}

  @Get()
  getHello() {
    return this.photosRepository.find();
  }
}
