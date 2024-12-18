import {Controller, Get, Req, Res} from '@nestjs/common';
import {AuthorsService} from "./authors.service";
import {Request, Response} from "express";
import {JwtService} from "../shared/jwt.service";

@Controller()
export class AuthorsController {
    constructor(
        private readonly authorsService: AuthorsService,
        private readonly jwtService: JwtService,

    ) {
    }

    @Get('/authors/')
    async authors(@Req() req: Request, @Res() res: Response) {
        try {
            const token = req.cookies?.jwt;
            if (!token) {
                return res.status(401).json( {message: 'token not found'} );
            }

            try {
                await this.jwtService.verify(token);
                const authors = await this.authorsService.getAllAuthors();
                return res.status(200).json(authors);

            } catch (err) {
                return res.status(401).json({ message: err.message });
            }

        } catch (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}