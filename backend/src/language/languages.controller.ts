import {Controller, Get, HttpStatus, Res} from '@nestjs/common';
import {Response} from "express";
import {LanguagesService} from "./languages.service";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";

@Controller()
export class LanguagesController {
    constructor(
        private readonly languagesService: LanguagesService,
    ) {
    }

    @Get('/languages/')
    @ApiOperation({ summary: 'Retrieve a list of languages' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'List of languages retrieved successfully.',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access.',
    })
    async languages(@Res() res: Response) {
        try {
            const languages = await this.languagesService.getAllLanguages();
            return res.status(200).json(languages);

        } catch (err) {
            return res.status(401).json({message: err.message});
        }
    }
}