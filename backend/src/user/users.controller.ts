import {
    Body,
    Controller,
    Get,
    HttpException,
    Patch,
    Post,
    Req,
    Res,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import {UsersService} from "./users.service";
import {Request, Response} from "express";
import {RegisterDto, registerDtoSchema} from "./dtos/registerDtoSchema";
import {LoginDto, loginDtoSchema} from "./dtos/loginDtoSchema";
import {AuthMetaData} from "../guards/auth.metadata.decorator";
import {Roles} from "../guards/roles.decorator";
import {Role} from "../entities/user.entity";
import {FileInterceptor} from "@nestjs/platform-express";

@Controller()
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) {
    }

    @Post('/auth/login')
    @AuthMetaData('SkipAuthorizationCheck')
    async login(@Res() response: Response, @Body() bodyRaw: object) {
        const parseSuccess = loginDtoSchema.safeParse(bodyRaw);
        if (!parseSuccess.success) {
            throw new HttpException('Invalid request body', 400);
        }

        const loginDto: LoginDto = parseSuccess.data;

        const user = await this.usersService.verify(loginDto);
        if (!user) {
            throw new HttpException('Invalid credentials', 401);
        }

        delete user.avatar;

        await this.usersService.createJWT(user, response);
    }

    @Post('/auth/register')
    @AuthMetaData('SkipAuthorizationCheck')
    async register(@Res() response: Response, @Body() bodyRaw: object) {
        const parseResult = registerDtoSchema.safeParse(bodyRaw);
        if (!parseResult.success) {
            const validationErrors = parseResult.error.errors.map(err => ({
                field: err.path[0],
                message: err.message,
            }));
            throw new HttpException(
                {message: 'Validation failed', errors: validationErrors},
                400
            );
        }

        const dto: RegisterDto = parseResult.data;

        const user = await this.usersService.register(dto);
        delete user.avatar;

        await this.usersService.createJWT(user, response);
    }

    @Post('/auth/logout')
    @AuthMetaData('SkipAuthorizationCheck')
    async logout(@Res() response: Response) {
        response.clearCookie('jwt', {
            httpOnly: true,
        });
        response.status(200).json({message: 'Logged out successfully'});
        response.end();
    }

    @Get('/users/:id')
    async user(@Req() req: Request, @Res() res: Response) {
        const userId = req.params.id;

        try {
            const user = await this.usersService.getUserById(userId);

            if (!user) {
                return res.status(404).json({message: "User not found"});
            }

            delete user.password;

            user.avatar = await this.usersService.fetchAndEncodeAvatar(userId);

            return res.status(200).json(user);
        } catch (err) {
            return res.status(500).json({message: 'Internal server error'});
        }
    }

    @Get('/users')
    @Roles(Role.admin)
    async users(@Res() res: Response) {
        try {
            const users = await this.usersService.getAllUsers();

            if (!users || users.length === 0) {
                return res.status(404).json({message: "Users not found"});
            }

            await Promise.all(users.map(async (user) => {
                user.avatar = await this.usersService.fetchAndEncodeAvatar(user.id);
            }));

            return res.status(200).json(users);
        } catch (err) {
            return res.status(500).json({message: 'Internal server error'});
        }
    }

    @Post('/users/changePhoto')
    @UseInterceptors(FileInterceptor('userPhoto'))
    async changePhoto(
        @UploadedFile() userPhoto: Express.Multer.File,
        @Req() req: Request
    ) {
        const currentUserId = req.headers['current_user_id'].toString();
        return this.usersService.changeUserPhoto(userPhoto, currentUserId);
    }

    @Patch('/users/modifyRole')
    @Roles(Role.admin)
    async modifyUserRole(
        @Body() body: { userID: string; action: string },
    ) {
        const {userID, action} = body;
        return this.usersService.modifyUserRole(userID, action);
    }
}