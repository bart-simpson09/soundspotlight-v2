import {Controller, Get, Res} from '@nestjs/common';
import {Response} from "express";
import {LanguagesService} from "./languages.service";

@Controller()
export class LanguagesController {
    constructor(
        private readonly languagesService: LanguagesService,
    ) {}

    @Get('/languages/')
    async languages(@Res() res: Response) {
        try {
            try {
                const languages = await this.languagesService.getAllLanguages();
                return res.status(200).json(languages);

            } catch (err) {
                return res.status(401).json({ message: err.message });
            }

        } catch (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}