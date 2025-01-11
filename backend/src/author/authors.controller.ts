import {Controller, Get, Res} from '@nestjs/common';
import {AuthorsService} from "./authors.service";
import {Response} from "express";

@Controller()
export class AuthorsController {
    constructor(
        private readonly authorsService: AuthorsService,
    ) {
    }

    @Get('/authors/')
    async authors(@Res() res: Response) {
        try {
            const authors = await this.authorsService.getAllAuthors();
            return res.status(200).json(authors);

        } catch (err) {
            return res.status(401).json({message: err.message});
        }
    }
}