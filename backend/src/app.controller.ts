import {Controller, Get, Inject} from '@nestjs/common';
import { AppService } from './app.service';
import {Repository} from "typeorm";
import {Photo} from "./entities/test.entity";
import {InjectRepository} from "@nestjs/typeorm";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}