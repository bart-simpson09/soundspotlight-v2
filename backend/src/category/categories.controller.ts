import {Controller, Get, Res} from '@nestjs/common';
import {Response} from "express";
import {CategoriesService} from "./categories.service";

@Controller()
export class CategoriesController {
    constructor(
        private readonly categoriesService: CategoriesService,
    ) {
    }

    @Get('/categories/')
    async categories(@Res() res: Response) {
        try {
            const categories = await this.categoriesService.getAllCategories();
            return res.status(200).json(categories);

        } catch (err) {
            return res.status(401).json({message: err.message});
        }
    }
}