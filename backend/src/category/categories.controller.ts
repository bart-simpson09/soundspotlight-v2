import {Controller, Get, Res} from '@nestjs/common';
import {Response} from "express";
import {CategoriesService} from "./categories.service";

@Controller()
export class CategoriesController {
    constructor(
        private readonly categoriesService: CategoriesService,
    ) {}

    @Get('/categories/')
    async categories(@Res() res: Response) {
        try {
            try {
                const categories = await this.categoriesService.getAllCategoriess();
                return res.status(200).json(categories);

            } catch (err) {
                return res.status(401).json({ message: err.message });
            }

        } catch (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}