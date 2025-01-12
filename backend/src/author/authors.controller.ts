import {Controller, Get, HttpStatus, Res} from '@nestjs/common';
import {AuthorsService} from "./authors.service";
import {Response} from "express";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";

@Controller()
export class AuthorsController {
    constructor(
        private readonly authorsService: AuthorsService,
    ) {
    }

    @Get('/authors/')
    @ApiOperation({ summary: 'Retrieve a list of all authors' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'List of authors retrieved successfully.',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access or invalid credentials.',
    })
    async authors(@Res() res: Response) {
        try {
            const authors = await this.authorsService.getAllAuthors();
            return res.status(200).json(authors);

        } catch (err) {
            return res.status(401).json({message: err.message});
        }
    }
}