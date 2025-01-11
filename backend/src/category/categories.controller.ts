import {Controller, Get, HttpStatus, Res} from '@nestjs/common';
import {Response} from "express";
import {CategoriesService} from "./categories.service";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";

@Controller()
export class CategoriesController {
    constructor(
        private readonly categoriesService: CategoriesService,
    ) {
    }

    @Get('/categories/')
    @ApiOperation({ summary: 'Retrieve a list of categories' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'List of categories retrieved successfully.',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access.',
    })
    async categories(@Res() res: Response) {
        try {
            const categories = await this.categoriesService.getAllCategories();
            return res.status(200).json(categories);

        } catch (err) {
            return res.status(401).json({message: err.message});
        }
    }
}